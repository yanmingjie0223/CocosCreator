@echo off
set currPath=%~dp0
xcopy /s /i /y %currPath%reload %currPath%build\web-mobile