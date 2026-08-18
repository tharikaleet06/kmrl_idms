#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MVN=mvn
if [ -x "/opt/homebrew/bin/mvn" ]; then
  MVN=/opt/homebrew/bin/mvn
fi

echo "================================================================="
echo "   KMRL INTELLIGENT DOCUMENT MANAGEMENT SYSTEM (KMRL-IDMS)       "
echo "================================================================="
echo "Starting Full Stack: MySQL + MongoDB + Python AI + Spring Boot + React"
echo ""

# Step 1. Check Databases
echo "-----------------------------------------------------------------"
echo "[1/4] Checking Database Connections..."
echo "-----------------------------------------------------------------"
if command -v mysql > /dev/null 2>&1; then
    mysql -h localhost -u root -e "CREATE DATABASE IF NOT EXISTS kmrl_idms;" 2>/dev/null && echo "✅ MySQL Database 'kmrl_idms' verified." || echo "⚠️  Note: Make sure MySQL is running on port 3306."
else
    echo "⚠️  Ensure MySQL 8.0 is running on localhost:3306 (DB: kmrl_idms)."
fi

if command -v mongosh > /dev/null 2>&1 || command -v mongo > /dev/null 2>&1; then
    echo "✅ MongoDB checked for 'kmrl_documents'."
else
    echo "⚠️  Ensure MongoDB is running on localhost:27017 (DB: kmrl_documents)."
fi
echo ""

# Step 2. Start Python FastAPI AI Microservice (Port 8000)
echo "-----------------------------------------------------------------"
echo "[2/4] Starting Python FastAPI AI Microservice (Port 8000)..."
echo "-----------------------------------------------------------------"
cd "$DIR/ai-service"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
PYTHON_PID=$!
echo "✅ Python AI Service launched on http://localhost:8000 (PID: $PYTHON_PID)"
sleep 3
echo ""

# Step 3. Start Spring Boot Microservices Cluster
echo "-----------------------------------------------------------------"
echo "[3/4] Starting Spring Boot Microservices (Port 8080 Gateway)..."
echo "-----------------------------------------------------------------"
cd "$DIR"

echo "  -> Launching Service Registry (Eureka :8761)..."
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl service-registry &
sleep 7

echo "  -> Launching API Gateway & 7 Microservices..."
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl api-gateway &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl auth-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl document-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl workflow-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl compliance-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl dashboard-service &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl geospatial-service &

sleep 8
echo "✅ Spring Boot Microservices cluster running on http://localhost:8080"
echo ""

# Step 4. Start React 19 Frontend (Port 3000)
echo "-----------------------------------------------------------------"
echo "[4/4] Starting React 19 Frontend (Vite :3000)..."
echo "-----------------------------------------------------------------"
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "🚀 Opening KMRL-IDMS Web Application at http://localhost:3000..."
npm run dev
