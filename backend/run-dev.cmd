@echo off
REM Development startup script with proper JVM heap settings
REM This prevents OutOfMemoryError during heavy operations

echo Starting Sanatana Parampara Backend with 512MB heap...

REM Set Maven options for JVM heap size
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=./logs

REM Clean and start the application
.\mvnw.cmd spring-boot:run

pause
