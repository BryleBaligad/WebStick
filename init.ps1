Clear-Host
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output "WebStick v0.0.21  -  (c) Bryle Baligad, 2023"
if ((Test-Path .\node.exe) -eq $false) {
    Write-Output "Downloading prerequisite (node.js v16.20.2)"
    Invoke-WebRequest http://local.brylebaligad.com/public/dist/WebStick/0.0.1/node.exe -OutFile node.exe
    if ((Test-Path .\node_modules) -eq $false) {
        Write-Output "Downloading prerequisite (node_modules)"
        Invoke-WebRequest http://local.brylebaligad.com/public/dist/WebStick/0.0.1/node_modules.zip -OutFile node_modules.zip
        Write-Output "Unpacking prerequisite (node_modules)"
        Expand-Archive -Path .\node_modules.zip -DestinationPath .\node_modules
        Remove-Item .\node_modules.zip
    }
}

Clear-Host
.\node.exe webstick.js
