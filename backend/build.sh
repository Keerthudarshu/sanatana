#!/bin/bash

# Backend Build Script for Render.com
echo "Starting backend build process..."

# Set execute permissions for Maven wrapper
chmod +x ./mvnw

# Clean and build the project
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "JAR file location: target/sanathana-parampara-0.0.1-SNAPSHOT.jar"
else
    echo "❌ Build failed!"
    exit 1
fi