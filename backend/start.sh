#!/bin/bash

# Startup script for Neenu Natural Backend on Render
echo "🚀 Starting Neenu Natural Backend..."

# Set environment variables for production
export SPRING_PROFILES_ACTIVE=prod

# Create necessary directories
mkdir -p /tmp/uploads

# Set proper permissions for uploads directory
chmod 755 /tmp/uploads

# Get the JAR file name
JAR_FILE="target/sanathana-parampara-0.0.1-SNAPSHOT.jar"

# Check if JAR file exists
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ JAR file not found: $JAR_FILE"
    echo "Available files in target directory:"
    ls -la target/
    exit 1
fi

# Start the application
echo "📦 Starting Spring Boot application..."
echo "🔧 Using profile: $SPRING_PROFILES_ACTIVE"
echo "🌐 Server will start on port: ${PORT:-8080}"

# Start the application with proper memory settings for free tier
java -Xmx512m -Xms256m \
     -Dserver.port=${PORT:-8080} \
     -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} \
     -jar $JAR_FILE