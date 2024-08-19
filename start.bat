@echo off

start node main_server.js

timeout /t 10 /nobreak

start new_form.html
