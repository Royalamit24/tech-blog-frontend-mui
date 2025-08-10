#!/bin/bash

# Production Deployment Script with Proper Environment Handling
# Usage: ./deploy-production.sh EC2_IP [KEY_FILE]

if [ -z "$1" ]; then
    echo "❌ Error: Please provide EC2 public IP address"
    echo "Usage: ./deploy-production.sh EC2_IP [KEY_FILE]"
    echo "Example: ./deploy-production.sh 54.81.129.233 my-key.pem"
    exit 1
fi

EC2_IP=$1
KEY_FILE=${2:-"your-key.pem"}

echo "🚀 Starting production deployment..."
echo "📍 EC2 IP: $EC2_IP"
echo "🔑 Key file: $KEY_FILE"

# Step 1: Build locally with correct environment
echo "🏗️ Building locally with production environment..."

# Create production environment file
cat > .env.production.local << EOF
REACT_APP_API_URL=http://$EC2_IP:4005
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
REACT_APP_DEBUG=false
EOF

echo "📝 Created environment file:"
cat .env.production.local

# Build with environment
npm install
REACT_APP_API_URL="http://$EC2_IP:4005" npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ Local build completed successfully!"

# Step 2: Prepare EC2
echo "⚙️ Preparing EC2 instance..."
ssh -i $KEY_FILE ubuntu@$EC2_IP << 'EOF'
# Install required packages if not installed
if ! command -v nginx &> /dev/null; then
    sudo apt update
    sudo apt install nginx -y
fi

# Create web directory
sudo mkdir -p /var/www/tech-blog-frontend
sudo chown -R ubuntu:ubuntu /var/www/tech-blog-frontend

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
EOF

# Step 3: Upload build files
echo "📤 Uploading build files to EC2..."
scp -i $KEY_FILE -r build/* ubuntu@$EC2_IP:/var/www/tech-blog-frontend/

# Step 4: Configure nginx
echo "🌐 Configuring Nginx..."
ssh -i $KEY_FILE ubuntu@$EC2_IP << EOF
# Create nginx configuration
sudo tee /etc/nginx/sites-available/tech-blog > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name $EC2_IP;
    
    location / {
        root /var/www/tech-blog-frontend;
        index index.html;
        try_files \\\$uri \\\$uri/ /index.html;
        
        # Cache static assets
        location ~* \\\.(js|css|png|jpg|jpeg|gif|ico|svg)\\\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to backend
    location /v1/ {
        proxy_pass http://localhost:4005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
NGINX_EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/tech-blog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Nginx configured successfully!"
EOF

# Step 5: Verify deployment
echo "🔍 Verifying deployment..."
sleep 2

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$EC2_IP)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: http://$EC2_IP"
else
    echo "⚠️  Deployment may have issues (HTTP $RESPONSE)"
    echo "🌐 Check your app at: http://$EC2_IP"
fi

echo ""
echo "📋 Next steps:"
echo "1. ✅ Frontend deployed and configured"
echo "2. 🔄 Deploy your backend API to port 4005"
echo "3. 🔄 Configure your database (if needed)"
echo "4. 🔄 Set up SSL certificate (recommended for production)"

# Clean up local environment file
rm -f .env.production.local
echo "🧹 Cleaned up local environment file"
