#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MVN=mvn
if [ -x "/opt/homebrew/bin/mvn" ]; then
  MVN=/opt/homebrew/bin/mvn
fi

echo "=================================================="
echo " Starting KMRL Intelligent Document Management System"
echo "=================================================="

# 1. Start Python FastAPI AI Microservice (Port 8000)
echo "1. Starting Python FastAPI AI Service..."
cd "$DIR/ai-service"
if [ -d "venv" ]; then
    source venv/bin/activate
fi
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
sleep 2

# 2. Start Spring Boot Eureka Service Registry (Port 8761)
echo "2. Starting Service Registry (Eureka :8761)..."
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl service-registry &
sleep 6

# 3. Start Remaining Spring Boot Microservices
echo "3. Starting Spring Boot Microservices..."
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl api-gateway &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl auth-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl document-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl workflow-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl compliance-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl dashboard-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl geospatial-service &

sleep 8

# 4. Start React Frontend (Port 3000)
echo "4. Starting React 19 Frontend (Vite :3000)..."
cd "$DIR/frontend" && npm run dev
