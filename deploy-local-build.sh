#!/bin/bash

# Local Build and Deploy Script
# This script builds locally and deploys to EC2

if [ -z "$1" ]; then
    echo "❌ Error: Please provide EC2 public IP address"
    echo "Usage: ./deploy-local-build.sh YOUR_EC2_IP [path-to-key.pem]"
    exit 1
fi

EC2_IP=$1
KEY_FILE=${2:-"your-key.pem"}

echo "🚀 Starting local build and EC2 deployment..."
echo "📍 EC2 IP: $EC2_IP"
echo "🔑 Key file: $KEY_FILE"

# Step 1: Build locally
echo "🏗️ Building project locally..."
npm install
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ Local build completed successfully!"

# Step 2: Create environment file for production
echo "📝 Creating production environment..."
cat > build/.env.production.local << EOF
REACT_APP_API_URL=http://$EC2_IP:4005
REACT_APP_ENV=production
EOF

# Step 3: Prepare EC2
echo "⚙️ Preparing EC2 instance..."
ssh -i $KEY_FILE ubuntu@$EC2_IP << 'EOF'
# Install required packages
sudo apt update
sudo apt install nginx -y

# Create web directory
sudo mkdir -p /var/www/tech-blog-frontend
sudo chown -R ubuntu:ubuntu /var/www/tech-blog-frontend

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
EOF

# Step 4: Upload build files
echo "📤 Uploading build files to EC2..."
scp -i $KEY_FILE -r build/* ubuntu@$EC2_IP:/var/www/tech-blog-frontend/

# Step 5: Upload and configure nginx
echo "🌐 Configuring Nginx..."
scp -i $KEY_FILE nginx.conf ubuntu@$EC2_IP:~/

ssh -i $KEY_FILE ubuntu@$EC2_IP << EOF
# Get public IP and update nginx config
PUBLIC_IP=\$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sed -i "s/YOUR_EC2_PUBLIC_IP/\$PUBLIC_IP/g" ~/nginx.conf

# Configure nginx
sudo cp ~/nginx.conf /etc/nginx/sites-available/tech-blog
sudo ln -sf /etc/nginx/sites-available/tech-blog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Nginx configured successfully!"
echo "🌐 Your app is accessible at: http://\$PUBLIC_IP"
EOF

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Your React app is now live at: http://$EC2_IP"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your backend API is running on port 4005"
echo "2. Check security groups allow ports 80 and 4005"
echo "3. Access your app at: http://$EC2_IP"
