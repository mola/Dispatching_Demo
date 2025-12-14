# Build Instructions

This document provides detailed instructions for building and deploying the gas network simulation application.

## Quick Build

The easiest way to build the application is to use the provided build script:

```bash
./build.sh
```

This script will:
1. Install Python dependencies
2. Install Node.js dependencies
3. Build the React frontend
4. Set up the example network
5. Create the static directory structure

After running the build script, you can start the application with:

```bash
python3 main.py
```

## Manual Build Process

### Prerequisites

- Python 3.x with pip
- Node.js 16+ with npm
- Git

### Step 1: Backend Setup

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Create database and tables (done automatically on first run)
python3 -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### Step 2: Frontend Build

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Build for production
npm run build

# The build output will be in ../static/
cd ..
```

### Step 3: Setup Example Data

```bash
# Insert example network into database
python3 setup_example.py
```

### Step 4: Run Application

```bash
# Start the server
python3 main.py
```

The application will be available at `http://localhost:8000`

## Development Build

For development with hot reload:

1. **Backend (Terminal 1):**
   ```bash
   python3 main.py
   ```

2. **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:8000`

## Production Deployment

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend and build it
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy application code
WORKDIR /app
COPY . .

# Create static directory and copy built frontend
RUN mkdir -p static && cp -r frontend/dist/* static/

# Expose port
EXPOSE 8000

# Run the application
CMD ["python3", "main.py"]
```

Build and run:

```bash
docker build -t gas-network-sim .
docker run -p 8000:8000 gas-network-sim
```

### Environment Variables

You can configure the application using environment variables:

```bash
export DATABASE_URL="sqlite:///./app.db"
export HOST="0.0.0.0"
export PORT="8000"
python3 main.py
```

## Troubleshooting

### Common Issues

1. **Frontend build fails:**
   - Ensure Node.js is version 16 or higher
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and run `npm install` again

2. **Python dependencies fail:**
   - Use pip3 instead of pip
   - Create virtual environment: `python3 -m venv venv && source venv/bin/activate`

3. **Database errors:**
   - Ensure write permissions in the project directory
   - Delete `app.db` and let it recreate automatically

4. **Port already in use:**
   - Change port in `main.py` or kill the process using the port
   - On Linux/Mac: `lsof -ti:8000 | xargs kill -9`

### Verification

To verify the build was successful:

1. Check that `static/index.html` exists
2. Check that `static/assets/` contains built assets
3. Run `python3 main.py` and visit `http://localhost:8000`
4. Test API endpoints: `curl http://localhost:8000/api/networks`

## File Permissions

Ensure the following files are executable:

```bash
chmod +x build.sh
chmod +x setup_example.py
```

## Performance Optimization

For production deployment:

1. **Enable gzip compression** in your web server
2. **Use a reverse proxy** like Nginx
3. **Database optimization** for large networks
4. **Caching** for frequently accessed networks

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```