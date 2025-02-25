@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set publicPath="%curPath%public\"
set nodeModulesPath="%curPath%node_modules\"
set webPath="%curPath%..\CreatorMessage\build\web-mobile\"

if not exist "%nodeModulesPath%" (
    call npm i
)

if exist "%webPath%" (
    del /q /s !publicPath!
    mkdir %publicPath%
    xcopy /s /i /y %webPath% %publicPath%
)

call npm run start

:toEnd
echo end
