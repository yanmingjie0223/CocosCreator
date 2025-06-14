@echo off
setlocal enabledelayedexpansion
set CUR_PATH=%~dp0
set PROTOC=..\Tools\protoc\bin\protoc.exe
set PLUGIN=.\node_modules\.bin\protoc-gen-ts_proto.cmd
set OUT_DIR=.\assets\script\protocol
set OUT_DIR_INDEX=.\assets\script\protocol\index.ts
set PROTO_DIR=..\Protocol

if not exist "%CUR_PATH%node_modules" (
    echo "{npm install} please use node 16.*.*"
	npm install
)

if not exist "%OUT_DIR%" (
	mkdir "%OUT_DIR%"
)

REM 执行编译
"%PROTOC%" ^
    --plugin=protoc-gen-ts_proto="%PLUGIN%" ^
    --ts_proto_out="%OUT_DIR%" ^
    --ts_proto_opt=outputServices=grpc-js,snakeToCamel=false,env=node,esModuleInterop=true ^
    --proto_path="%PROTO_DIR%" ^
    "%PROTO_DIR%\*.proto"

if exist "%OUT_DIR%" (
    cd "%OUT_DIR%"
	for %%i in (*.ts) do (
		set name=%%i
		set tsName=!name:~0,-3!
		if not "!tsName!"=="index" (
			if not exist "%CUR_PATH%%PROTO_DIR%\!tsName!.proto" (
				del /q /s "%CUR_PATH%%OUT_DIR%\!tsName!.ts"
			)
		)
	)

	for %%i in (*.meta) do (
		set name=%%i
		set tsName=!name:~0,-5!
		if not exist "%CUR_PATH%%OUT_DIR%\!tsName!" (
			del /q /s !name!
		)
	)

	del /q /s %CUR_PATH%%OUT_DIR_INDEX%
	for %%i in (*.ts) do (
		set name=%%i
		set tsName=!name:~0,-3!
		set str=export * as !tsName! from './!tsName!';
		echo !str!>>%CUR_PATH%%OUT_DIR_INDEX%
	)
)

echo end
pause
