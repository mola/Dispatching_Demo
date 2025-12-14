#!/bin/bash

# Simple build script for gas network simulation app
# This script builds frontend and sets up example

echo "Building Gas Network Simulation App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Go back to root directory
cd ..

# Create static directory if it doesn't exist
mkdir -p static

echo "Build completed successfully!"
echo ""
echo "Note: Python 3.13 is not yet compatible with current pydantic/fastapi versions."
echo "Please use Python 3.11 or earlier, or wait for updated packages."
echo ""
echo "To run the application with system Python (if compatible):"
echo "  python main.py"
echo ""
echo "Then open your browser to: http://localhost:8000"