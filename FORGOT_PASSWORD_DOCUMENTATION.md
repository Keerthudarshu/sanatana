# Forgot Password System Documentation

## Overview
A complete password reset and recovery system that allows users to securely reset their passwords via email or retrieve their forgotten credentials.

---

## Features

### 1. **Password Reset via Email Link**
- User requests password reset
- System generates unique token (UUID) valid for 24 hours
- Email sent with reset link containing the token
- User clicks link and sets new password
- Token automatically invalidated after use

### 2. **Send Forgotten Credentials**
- User provides email address
- System generates temporary password (8 characters)
- Sends username and temporary password via email
- User must change password on first login

### 3. **Security Features**
- Tokens expire after 24 hours
- Tokens can only be used once
- Only one valid token per email at a time
- Passwords are encrypted using bcrypt
- All operations logged

---

## Backend Implementation

### Database Setup
**New Table**: `password_reset_tokens`
```sql
CREATE TABLE password_reset_tokens (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(500) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  expiry_time DATETIME NOT NULL,
  is_used BOOLEAN DEFAULT FALSE
);
```

### Backend Files Created

#### 1. **Entity** - `PasswordResetToken.java`
- Stores reset tokens in database
- Validates token expiry and usage

#### 2. **Repository** - `PasswordResetTokenRepository.java`
- CRUD operations for tokens
- Queries: `findByToken()`, `findByEmail()`, `findByEmailAndIsUsedFalse()`

#### 3. **Service** - `PasswordResetService.java`
- Core business logic
- Methods:
  - `generatePasswordResetToken(email)` - Creates token and sends email
  - `validateResetToken(token)` - Checks if token is valid
  - `resetPassword(token, newPassword)` - Updates password
  - `sendForgottenCredentials(email)` - Sends temporary credentials

#### 4. **Service** - `EmailService.java`
- Sends password reset emails
- Sends credential recovery emails
- Methods:
  - `sendPasswordResetEmail(email, username, resetLink)`
  - `sendCredentialsEmail(email, username, password)`

#### 5. **Controller** - `PasswordResetController.java`
- REST API endpoints
- Endpoint mapping below

---

## API Endpoints

### 1. Request Password Reset
```
POST /api/password/forgot
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "Password reset link has been sent to your email",
  "email": "user@example.com"
}

Response (Error):
{
  "success": false,
  "message": "Email not found in our system"
}
```

### 2. Send Forgotten Credentials
```
POST /api/password/send-credentials
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "Your username and temporary password have been sent to your email",
  "email": "user@example.com"
}

Response (Error):
{
  "success": false,
  "message": "Email not found in our system"
}
```

### 3. Validate Reset Token
```
POST /api/password/validate-token
Content-Type: application/json

Request Body:
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}

Response (Valid):
{
  "valid": true,
  "message": "Token is valid. You can proceed to reset your password."
}

Response (Invalid):
{
  "valid": false,
  "message": "Token is invalid or expired. Please request a new reset link."
}
```

### 4. Reset Password with Token
```
POST /api/password/reset
Content-Type: application/json

Request Body:
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "newPassword": "NewPassword123"
}

Response (Success):
{
  "success": true,
  "message": "Password has been successfully reset. You can now login with your new password."
}

Response (Error):
{
  "success": false,
  "message": "Failed to reset password. Token may be invalid or expired."
}
```

---

## Email Configuration

### Gmail SMTP Setup

**In `application-dev.properties`:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

### Gmail Setup Steps
1. Enable 2-factor authentication on Gmail account
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Set environment variables:
   ```bash
   export MAIL_USERNAME="your-email@gmail.com"
   export MAIL_PASSWORD="your-app-password"
   ```

---

## Frontend Implementation

### Files Created

#### 1. **Page** - `ForgotPassword.jsx`
- Two-step process or direct reset
- Two methods:
  - Send reset link to email
  - Send temporary credentials

#### 2. **Style** - `ForgotPassword.css`
- Responsive design
- Mobile-friendly layout
- Gradient background, smooth animations

### Features
- Method selection (Reset Link vs Send Credentials)
- Token validation from URL
- Form validation
- Success/error messages
- Auto-redirect after successful reset

---

## User Workflow

### Method 1: Reset Password via Link

1. User clicks "Forgot Password" on login page
2. Selects "Send Reset Link to Email"
3. Enters email address
4. Backend generates token and sends email
5. User receives email with reset link
6. User clicks link: `http://localhost:3000/reset-password?token=xyz`
7. Frontend validates token
8. User enters new password
9. Password updated, user redirected to login

### Method 2: Send Credentials

1. User clicks "Forgot Password" on login page
2. Selects "Send Username & Temporary Password"
3. Enters email address
4. Backend sends temporary password
5. User receives email with username and temporary password
6. User logs in with temporary password
7. User should change password after login

---

## Password Requirements

- Minimum length: 6 characters
- Recommended: Mix of uppercase, lowercase, numbers, special characters
- Passwords are bcrypt encrypted before storage

---

## Token Expiration

- **Validity Period**: 24 hours
- **Status**: Automatically invalidated after:
  - 24 hours from creation
  - Successful password reset
  - New reset request for same email (previous token invalidated)

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Email not found" | User doesn't exist | Check email spelling or register new account |
| "Token is invalid" | Token expired or used | Request new reset link |
| "Token is expired" | 24 hours passed | Request new reset link |
| "Passwords do not match" | Confirmation doesn't match | Re-enter passwords carefully |
| "Email sending failed" | SMTP config issue | Check email credentials in properties file |

---

## Database Maintenance

### Cleanup Old Tokens (Optional)
```java
// Called periodically to clean expired tokens
tokenRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
```

---

## Security Considerations

✅ Tokens are unique (UUID)
✅ Tokens expire automatically
✅ Tokens are single-use
✅ Passwords are bcrypted
✅ Email verification required
✅ User existence validated before token generation
✅ All operations logged
✅ HTTPS recommended for production

---

## Testing

### Test Password Reset
```bash
# 1. Request reset
curl -X POST http://localhost:8080/api/password/forgot \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2. Check email for token

# 3. Reset password
curl -X POST http://localhost:8080/api/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token":"550e8400-e29b-41d4-a716-446655440000",
    "newPassword":"NewPassword123"
  }'

# 4. Login with new password
```

---

## Production Deployment

1. **Update Email Configuration**
   - Use production email service (SendGrid, AWS SES, etc.)
   - Update SMTP credentials in environment variables

2. **Update Reset Link URL**
   - Change `http://localhost:3000` to production domain
   - Update in `PasswordResetService.buildResetLink()`

3. **HTTPS Required**
   - All password reset links must be HTTPS
   - Email links should use HTTPS

4. **Email Template**
   - Customize email template with branding
   - Add footer with support contact

---

## Support

For issues with password reset:
1. Check email logs in backend console
2. Verify email configuration in properties file
3. Check browser console for frontend errors
4. Review database for token records

