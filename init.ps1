$json = Get-Content -Raw -Path package.json | ConvertFrom-Json

Clear-Host
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output "WebStick $($json.version)  -  (c) Bryle Baligad, 2023 - 2024"
if ((Test-Path .\node.exe) -eq $false) {
    Write-Output "Downloading prerequisite (node.js v16.20.2)"
    Invoke-WebRequest http://local.brylebaligad.com/public/dist/WebStick/0.0.1/node.zip -OutFile node.zip
    Write-Output "Unpacking prerequisite (node.js v16.20.2)"
    Expand-Archive -Path .\node.zip -DestinationPath .\
    Remove-Item .\node.zip
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
