# TruAi HTML Server - Quick Setup Guide

## Installation

### Step 1: Verify Requirements

```bash
# Check PHP version (requires 8.0+)
php --version

# Check SQLite extension
php -m | grep sqlite3
```

### Step 2: Navigate to TruAi Directory

```bash
cd /home/runner/work/Tru.ai/Tru.ai/TruAi
```

### Step 3: Set Permissions

```bash
# Create necessary directories
mkdir -p database logs

# Set permissions
chmod 755 database logs
```

### Step 4: Start the Server

```bash
# Start PHP built-in server
php -S localhost:8080 index.php
```

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Security Note:** Change these credentials immediately after first login!

## Features

### 🔒 Encrypted Login (Phantom.ai Style)
- AES-256-GCM client-side encryption
- SHA-256 password hashing before transmission
- RSA-2048 key exchange
- No plaintext passwords transmitted

### 🎨 Cursor-Style Interface
- 3-column layout (Review | Workspace | Output)
- Familiar development workflow
- Real-time AI interaction

### 🛡️ Security Features
- Localhost-only access (configurable)
- CSRF protection
- Session management
- Comprehensive audit logging
- Encrypted session data

### 🤖 TruAi Core Integration
- Automatic risk evaluation
- Multi-tier AI routing (Cheap/Mid/High)
- Production-by-default deployment
- Manual approval for high-risk tasks

## Testing the Installation

### Test 1: Check Server Status
```bash
curl http://localhost:8080/api/v1/auth/publickey
```

Expected: JSON response with public key

### Test 2: Test Login API
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected: JSON response with success=true

### Test 3: Access Dashboard
Open `http://localhost:8080` in your browser and verify:
- [ ] Login page loads with TruAi logo
- [ ] Legal notices are displayed
- [ ] Login with encrypted credentials works
- [ ] Dashboard shows 3-column layout
- [ ] Can submit a task prompt

## Troubleshooting

### Problem: PHP version too old
```bash
# Solution: Install PHP 8.0+
# Ubuntu/Debian:
sudo apt install php8.2 php8.2-sqlite3

# macOS (Homebrew):
brew install php@8.2
```

### Problem: SQLite extension not found
```bash
# Ubuntu/Debian:
sudo apt install php8.2-sqlite3

# Enable in php.ini:
extension=sqlite3
```

### Problem: Permission denied on database directory
```bash
chmod 755 database
chmod 755 logs
```

### Problem: Port 8080 already in use
```bash
# Use a different port
php -S localhost:8081 index.php
```

### Problem: Encryption not working
- Check browser console for errors
- Verify Web Crypto API support (modern browsers only)
- Fallback to standard login will occur automatically

## Directory Structure

```
TruAi/
├── index.php                 # Main entry point
├── backend/                  # PHP backend
│   ├── config.php           # Configuration
│   ├── database.php         # Database layer
│   ├── auth.php             # Authentication
│   ├── encryption.php       # Encryption service
│   ├── router.php           # API router
│   ├── truai_service.php    # TruAi Core logic
│   └── chat_service.php     # Chat functionality
├── assets/
│   ├── css/main.css         # Styles
│   ├── js/
│   │   ├── crypto.js        # Encryption utilities
│   │   ├── api.js           # API client
│   │   ├── login.js         # Login page
│   │   └── dashboard.js     # Dashboard
│   └── images/              # TruAi logos
├── database/                 # SQLite database (auto-created)
└── logs/                     # Application logs (auto-created)
```

## Production Deployment

1. **Change Default Credentials**
   - Access database: `sqlite3 database/truai.db`
   - Update password: `UPDATE users SET password_hash = ? WHERE username = 'admin';`

2. **Set Environment Variables**
   ```bash
   export APP_ENV=production
   export TRUAI_API_KEY="your-key"
   export OPENAI_API_KEY="your-key"
   export ANTHROPIC_API_KEY="your-key"
   ```

3. **Use Production Web Server**
   - Configure Apache/Nginx
   - Enable HTTPS/TLS
   - Set appropriate PHP-FPM settings

4. **Security Checklist**
   - [ ] Changed default credentials
   - [ ] HTTPS enabled
   - [ ] Firewall configured
   - [ ] File permissions set correctly
   - [ ] Error logging enabled
   - [ ] Regular backups configured

## Support

For issues or questions:
- Check logs: `tail -f logs/error.log`
- Review README.md
- Contact: DemeWebsolutions.com

---

**TruAi HTML Server Version**  
Copyright My Deme, LLC © 2026
