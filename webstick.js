const fs = require('fs')

console.info(`WebStick v${require('./package.json').version}\n(c) Bryle Baligad, 2023`)

//#region - vgen xbox
const Vgen = require('@evilazio/vgen-xbox')
const vgen = new Vgen.VGen()
try {
    vgen.plugin(1)
    vgen.unplug(1)
} catch (e) {
    vgen.installDriver(() => {
        console.info("--------=========######=========--------\n\n        Installed gamepad driver\n          Open start.bat again\n\n--------=========######=========--------")
        var seconds = 5;
        setInterval(() => {
            process.stdout.write(`\rClosing in ${seconds} second${seconds > 1 ? 's...     ' : '...      '}`)
        }, 50);
        setInterval(() => {
            seconds -= 1;
        }, 1000);
        setTimeout(() => {
            process.stdout.write("\n")
            console.clear()
            process.exit(0)
        }, 5000);
    })
}

//#endregion

//#region - HTTP Server (serve web gamepad client)
const http = require('http')
const qrcode = require('qrcode-terminal')

http.createServer(async (req, res) => {
    if (req.url == "/joy.js") {
        res.setHeader("Content-Type", "text/javascript")
        res.write(fs.readFileSync('./joy.js'))
        res.end()
    } else {
        res.write(fs.readFileSync('./gamepad.html'));
        res.end()
    }
}).listen(8778)

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.info(`Connect to http://${add}:8778 or scan the QR code below\n`);
    qrcode.generate(`http://${add}:8778`, {small: true})
})

//#endregion

//#region - WebSocket Server (receive data from client)
const WebSocketServer = require("ws").WebSocketServer;
const wss = new WebSocketServer({port: 8779});

wss.on('connection', (ws, req) => {
    ws.ip = req.socket.remoteAddress

    if (vgen.getNumEmptySlots() == 0) {
        console.info(`${ws.ip} tried to connect, but there are no more slots`)
        ws.send("ZERO SLOTS")
        ws.close()
        return;
    }

    ws.controllerID = vgen.pluginNext()
    ws.cid = ws.controllerID
    console.info(`${ws.ip} connected with controller ID ${ws.cid}`)

    ws.on('close', () => {
        vgen.unplug(ws.controllerID);
        console.info(`${ws.ip} disconnected with controller ID ${ws.cid}`)
    })

    ws.on('message', (data, isBinary) => {
        var message = isBinary ? data : data.toString();
        console.info(`${ws.ip} (${ws.cid}): ${message}`);
        switch (message) {
            case "A DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.A, true)
                break;

            case "A UP":
                vgen.setButton(ws.cid, Vgen.Buttons.A, false)
                break;

            case "B DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.B, true)
                break;

            case "B UP":
                vgen.setButton(ws.cid, Vgen.Buttons.B, false)
                break;

            case "X DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.X, true)
                break;

            case "X UP":
                vgen.setButton(ws.cid, Vgen.Buttons.X, false)
                break;

            case "Y DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.Y, true)
                break;

            case "Y UP":
                vgen.setButton(ws.cid, Vgen.Buttons.Y, false)
                break;

            case "HAT N DOWN":
                vgen.setDpad(ws.cid, Vgen.Dpad.UP)
                break;

            case "HAT N UP":
                vgen.setDpad(ws.cid, Vgen.Dpad.NONE)
                break;

            case "HAT S DOWN":
                vgen.setDpad(ws.cid, Vgen.Dpad.DOWN)
                break;

            case "HAT S UP":
                vgen.setDpad(ws.cid, Vgen.Dpad.NONE)
                break;

            case "HAT W DOWN":
                vgen.setDpad(ws.cid, Vgen.Dpad.LEFT)
                break;

            case "HAT W UP":
                vgen.setDpad(ws.cid, Vgen.Dpad.NONE)
                break;
            
            case "HAT E DOWN":
                vgen.setDpad(ws.cid, Vgen.Dpad.RIGHT)
                break;

            case "HAT E UP":
                vgen.setDpad(ws.cid, Vgen.Dpad.NONE)
                break;

            case "BACK DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.BACK, true)
                break;

            case "BACK UP":
                vgen.setButton(ws.cid, Vgen.Buttons.BACK, false)
                break;

            case "START DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.START, true)
                break;

            case "START UP":
                vgen.setButton(ws.cid, Vgen.Buttons.START, false)
                break;

            case "SHOULDER L DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.LEFT_SHOULDER, true)
                break;
    
            case "SHOULDER L UP":
                vgen.setButton(ws.cid, Vgen.Buttons.LEFT_SHOULDER, false)
                break;

            case "SHOULDER R DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.RIGHT_SHOULDER, true)
                break;
    
            case "SHOULDER R UP":
                vgen.setButton(ws.cid, Vgen.Buttons.RIGHT_SHOULDER, false)
                break;

            case "TRIGGER L DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.LEFT_THUMB, true)
                break;
    
            case "TRIGGER L UP":
                vgen.setButton(ws.cid, Vgen.Buttons.LEFT_THUMB, false)
                break;

            case "TRIGGER R DOWN":
                vgen.setButton(ws.cid, Vgen.Buttons.RIGHT_THUMB, true)
                break;
    
            case "TRIGGER R UP":
                vgen.setButton(ws.cid, Vgen.Buttons.RIGHT_THUMB, false)
                break;

            case "PING!":
                ws.send("PONG!")
                break;

            default:
                if (message.startsWith("LEFT STICK")) {
                    vgen.setAxisL(ws.cid, message.split(" ")[2], message.split(" ")[3])
                }

                if (message.startsWith("RIGHT STICK")) {
                    vgen.setAxisR(ws.cid, message.split(" ")[2], message.split(" ")[3])
                }
        }
    })
})

//#endregion