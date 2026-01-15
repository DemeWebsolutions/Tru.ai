# TruAi HTML Server - Quick Setup Guide

## Installation

### Step 1: Verify Requirements

```bash
# Check PHP version (requires 8.0+)
php --version

# Check SQLite extension
php -m | grep sqlite3

# Check cURL extension (required for AI APIs)
php -m | grep curl
```

### Step 2: Configure AI API Keys

**Required for full AI functionality:**

```bash
# OpenAI (recommended - supports GPT-3.5, GPT-4)
export OPENAI_API_KEY="sk-your-openai-key-here"

# Anthropic (optional - supports Claude models)
export ANTHROPIC_API_KEY="sk-ant-your-anthropic-key-here"
```

You can get API keys from:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

### Step 3: Navigate to TruAi Directory

```bash
cd /home/runner/work/Tru.ai/Tru.ai/TruAi
```

### Step 4: Set Permissions

```bash
# Create necessary directories
mkdir -p database logs

# Set permissions
chmod 755 database logs
```

### Step 5: Start the Server

```bash
# Start PHP built-in server from inside the TruAi directory
cd TruAi
php -S localhost:8080 router.php
```

**Important:** 
- Always run the server from inside the `TruAi` directory
- Use `router.php` (not `index.php`) to ensure proper routing

### Step 6: Test AI Connection (Optional but Recommended)

```bash
# Test AI API connectivity
curl http://localhost:8080/api/v1/ai/test
```

Expected response:
```json
{
  "success": true,
  "results": {
    "openai": {
      "status": "success",
      "message": "OpenAI API connected successfully"
    },
    "anthropic": {
      "status": "success",
      "message": "Anthropic API connected successfully"
    }
  }
}
```

### Step 7: Access the Application

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

### Problem: "Invalid credentials" error on login
**Symptoms:** Login fails with "Invalid credentials" even with correct username/password.

**Solutions:**

1. **Verify database was initialized:**
   ```bash
   ls -la database/truai.db
   ```
   If file doesn't exist, the database hasn't been initialized. Start the server once to auto-create it:
   ```bash
   cd TruAi
   php -S localhost:8080 router.php
   ```

2. **Check default credentials:**
   - Username: `admin`
   - Password: `admin123`
   - These are case-sensitive!

3. **Test database directly:**
   ```bash
   # Check if admin user exists
   sqlite3 database/truai.db "SELECT username, role FROM users;"
   ```
   Expected output: `admin|SUPER_ADMIN`

4. **Reset database (if corrupted):**
   ```bash
   # Backup first!
   cp database/truai.db database/truai.db.backup
   
   # Delete and restart server to recreate
   rm database/truai.db
   php -S localhost:8080 router.php
   ```

5. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Verify API calls are reaching the server
   - Check if encrypted login is failing (will fallback to standard)

6. **Verify server is running with router.php:**
   ```bash
   # CORRECT:
   php -S localhost:8080 router.php
   
   # INCORRECT:
   php -S localhost:8080 index.php  # Won't route API calls properly!
   ```

### Problem: Port 8080 already in use
```bash
# Use a different port
php -S localhost:8081 router.php
```

### Problem: Encryption not working
- Check browser console for errors
- Verify Web Crypto API support (modern browsers only)
- Fallback to standard login will occur automatically

### Problem: AI not responding or returning errors
```bash
# Check if API keys are set
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# Test AI connection
curl http://localhost:8080/api/v1/ai/test

# Verify cURL extension is enabled
php -m | grep curl

# Check PHP error logs
tail -f logs/error.log
```

**Common AI API errors:**
- "API key not configured" - Set environment variables before starting server
- "API request failed" - Check internet connectivity and API key validity
- "Invalid response" - API may be temporarily unavailable, try again

### Problem: cURL extension not found
```bash
# Ubuntu/Debian:
sudo apt install php8.2-curl

# macOS (Homebrew):
brew install php@8.2

# Verify installation
php -m | grep curl
```

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
