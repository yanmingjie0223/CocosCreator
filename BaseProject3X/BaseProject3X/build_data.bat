@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set WORKSPACE=.\

set curPath=%~dp0
set LUBAN_DLL=%WORKSPACE%..\Tools\Luban\Luban.dll
set CONF_ROOT=%WORKSPACE%..\Design\Datas
set BYTES_PATH=%curPath%assets\dynamic\temp_lubandata
set BIN_PATH=%curPath%assets\dynamic\data

dotnet %LUBAN_DLL% ^
    -t server ^
    -c typescript-bin ^
    -d bin  ^
    --conf %CONF_ROOT%\__zconfig__.conf ^
    -x outputCodeDir=%WORKSPACE%assets\script\luban\code ^
    -x outputDataDir=%BYTES_PATH%

if not exist "%BIN_PATH%" (
	mkdir %BIN_PATH%
)

if exist "%BYTES_PATH%" (
	cd "%BYTES_PATH%"
	for %%i in (*.bytes) do (
		set name=%%i
		set bytesName=!name:~0,-6!
		copy "%BYTES_PATH%\!bytesName!.bytes" "%BIN_PATH%\!bytesName!.bin"
	)

	cd ..
	rd /s /q !BYTES_PATH!
)

pause