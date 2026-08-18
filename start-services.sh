#!/bin/bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
MVN=/opt/homebrew/bin/mvn
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting KMRL Microservices Cluster..."

$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl service-registry -o &
sleep 6

$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl api-gateway -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl auth-service -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl document-service -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl workflow-service -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl compliance-service -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl dashboard-service -o &
$MVN spring-boot:run -f "$DIR/backend/pom.xml" -pl geospatial-service -o &

sleep 8

echo "Starting Node Web Server..."
cd "$DIR" && node server.js
