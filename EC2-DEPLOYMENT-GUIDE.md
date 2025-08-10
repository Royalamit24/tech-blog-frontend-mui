# Complete EC2 Deployment Guide for React Tech Blog

## Prerequisites
- AWS Account with EC2 access
- GitHub repository with your React project
- SSH key pair (.pem file)
- Local machine with Node.js and npm installed

---

## STEP 1: LAUNCH EC2 INSTANCE

### 1.1 AWS Console Setup
1. Go to **AWS Console** → **EC2 Dashboard**
2. Click **"Launch Instance"**

### 1.2 Instance Configuration
```
Name: tech-blog-frontend
AMI: Ubuntu Server 22.04 LTS (64-bit x86)
Instance Type: t3.small (Recommended) or t2.micro (Free tier)
vCPUs: 2 (t3.small) or 1 (t2.micro)
Memory: 2 GB (t3.small) or 1 GB (t2.micro)
```

### 1.3 Key Pair
- **Create new key pair** or **select existing**
- **Download .pem file** and save securely
- **Set permissions**: `chmod 400 your-key.pem`

### 1.4 Network Settings
```
VPC: Default VPC
Subnet: Default subnet
Auto-assign Public IP: ENABLE
```

### 1.5 Security Group Rules
```
Type        Protocol    Port    Source          Description
SSH         TCP         22      Your IP         SSH access
HTTP        TCP         80      0.0.0.0/0       Web traffic
HTTPS       TCP         443     0.0.0.0/0       SSL traffic (future)
Custom TCP  TCP         4005    0.0.0.0/0       Backend API
```

### 1.6 Storage
```
Volume Type: GP3 SSD
Size: 20 GB (minimum 15 GB)
Delete on Termination: Yes
Encrypted: Yes (recommended)
```

### 1.7 Launch Instance
- Click **"Launch Instance"**
- Wait for instance to be **"Running"**
- **Copy the Public IPv4 address** (e.g., 54.81.129.233)

---

## STEP 2: PREPARE LOCAL PROJECT

### 2.1 Commit Latest Changes
```bash
# In your local project directory
git add .
git commit -m "Production deployment ready"
git push origin main
```

### 2.2 Make Deployment Script Executable
```bash
chmod +x deploy-production.sh
```

---

## STEP 3: DEPLOY USING AUTOMATED SCRIPT (RECOMMENDED)

### 3.1 Run Production Deployment Script
```bash
# Replace with your actual values
./deploy-production.sh 54.81.129.233 your-key.pem
```

**This script will:**
- ✅ Build your React app locally with correct environment
- ✅ Upload build files to EC2
- ✅ Install and configure Nginx
- ✅ Set up proper API URL configuration
- ✅ Verify deployment

### 3.2 Access Your App
```
http://54.81.129.233
```

---

## STEP 4: MANUAL DEPLOYMENT (ALTERNATIVE)

### 4.1 Connect to EC2
```bash
ssh -i your-key.pem ubuntu@54.81.129.233
```

### 4.2 Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git nginx nodejs npm

# Install latest Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 4.3 Clone Your Repository
```bash
git clone https://github.com/YOUR_USERNAME/tech-blog-frontend-mui.git
cd tech-blog-frontend-mui
```

### 4.4 Create Environment Configuration
```bash
# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create production environment file
cat > .env.production.local << EOF
REACT_APP_API_URL=http://$PUBLIC_IP:4005
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
REACT_APP_DEBUG=false
EOF
```

### 4.5 Build React Application
```bash
# Install dependencies
npm install

# Build with environment variables
REACT_APP_API_URL="http://$PUBLIC_IP:4005" NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 4.6 Set Up Web Directory
```bash
# Create web directory
sudo mkdir -p /var/www/tech-blog-frontend
sudo chown -R ubuntu:ubuntu /var/www/tech-blog-frontend

# Copy build files
cp -r build/* /var/www/tech-blog-frontend/

# Verify files copied
ls -la /var/www/tech-blog-frontend/
```

### 4.7 Configure Nginx
```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/tech-blog > /dev/null << EOF
server {
    listen 80;
    server_name $PUBLIC_IP;
    
    location / {
        root /var/www/tech-blog-frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /v1/ {
        proxy_pass http://localhost:4005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/tech-blog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and start Nginx
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

### 4.8 Verify Deployment
```bash
# Test from command line
curl http://$PUBLIC_IP

# Check Nginx status
sudo systemctl status nginx
```

---

## STEP 5: DEPLOY BACKEND API

### 5.1 Upload Backend Code
```bash
# From local machine
scp -i your-key.pem -r your-backend-project ubuntu@54.81.129.233:~/backend/
```

### 5.2 Set Up Backend on EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@54.81.129.233

# Navigate to backend
cd ~/backend

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name "tech-blog-api"
pm2 startup
pm2 save

# Verify API is running
curl http://localhost:4005/v1/health
```

---

## STEP 6: VERIFICATION AND TESTING

### 6.1 Test Frontend
```
Browser: http://54.81.129.233
Expected: Your React application loads
```

### 6.2 Test API Connection
```
Browser Console: Check for API calls to http://54.81.129.233:4005
Expected: No CORS or connection errors
```

### 6.3 Check Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 logs (backend)
pm2 logs tech-blog-api
```

---

## STEP 7: FUTURE UPDATES

### 7.1 Update Frontend
```bash
# Local machine - after making changes
git add .
git commit -m "Updated features"
git push origin main

# Deploy updates
./deploy-production.sh 54.81.129.233 your-key.pem
```

### 7.2 Update Backend
```bash
# Upload new backend code
scp -i your-key.pem -r backend/* ubuntu@54.81.129.233:~/backend/

# Restart backend
ssh -i your-key.pem ubuntu@54.81.129.233
cd ~/backend
npm install
pm2 restart tech-blog-api
```

---

## TROUBLESHOOTING

### Common Issues and Solutions

#### 1. "Connection Refused" Error
```bash
# Check security groups allow port 80
# Check Nginx is running
sudo systemctl status nginx
sudo systemctl restart nginx
```

#### 2. API URL Issues
```bash
# Check environment file
cat .env.production.local

# Rebuild with correct environment
REACT_APP_API_URL="http://YOUR_IP:4005" npm run build
cp -r build/* /var/www/tech-blog-frontend/
```

#### 3. Build Memory Issues
```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Build with memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 4. Nginx Configuration Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

## IMPORTANT NOTES

1. **Replace placeholders** with your actual values:
   - `54.81.129.233` → Your EC2 public IP
   - `your-key.pem` → Your actual key file
   - `YOUR_USERNAME` → Your GitHub username

2. **Security considerations**:
   - Keep your .pem file secure
   - Consider setting up SSL/HTTPS for production
   - Regularly update your EC2 instance

3. **Cost optimization**:
   - Stop EC2 instance when not needed
   - Use t2.micro for development (free tier)
   - Use t3.small for production (better performance)

4. **Backup strategy**:
   - Regular code commits to GitHub
   - Consider EBS snapshots for data backup

---

## QUICK REFERENCE COMMANDS

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Deploy (automated)
./deploy-production.sh YOUR_EC2_IP your-key.pem

# Check services
sudo systemctl status nginx
pm2 status

# View logs
sudo tail -f /var/log/nginx/error.log
pm2 logs

# Restart services
sudo systemctl restart nginx
pm2 restart tech-blog-api
```

---

**Your React Tech Blog is now production-ready on AWS EC2!** 🎉
