@echo off
echo Starting all Alumni Network Microservices...

start "Auth Service" cmd /k "cd auth-service && npm run dev"
start "User Service" cmd /k "cd user-service && npm run dev"
start "Connection Service" cmd /k "cd connection-service && npm run dev"
start "Event Service" cmd /k "cd event-service && npm run dev"
start "Chat Service" cmd /k "cd chat-service && npm run dev"
start "Notification Service" cmd /k "cd notification-service && npm run dev"

timeout /t 3 /nobreak > nul

start "API Gateway" cmd /k "cd api-gateway && npm run dev"

timeout /t 3 /nobreak > nul

start "Frontend" cmd /k "cd frontend && npm run dev"

echo All services started!
echo Gateway:  http://localhost:5000
echo Frontend: http://localhost:3000
pause