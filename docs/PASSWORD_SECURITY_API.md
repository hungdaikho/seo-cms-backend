# Password Management & Account Security APIs

## 🔑 Password Management

### Change Password

```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

### Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

## ✉️ Email Verification

### Verify Email

```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Response:**

```json
{
  "message": "Email verified successfully"
}
```

### Resend Verification Email

```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If an account with that email exists, a verification email has been sent."
}
```

## 🔒 Session Management

### Get All Sessions

```http
GET /auth/sessions
Authorization: Bearer <token>
```

**Response:**

```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "device": "Chrome on Windows",
      "location": "Vietnam",
      "lastActive": "2025-08-11T10:30:00.000Z",
      "current": true
    }
  ]
}
```

### Revoke Specific Session

```http
DELETE /auth/sessions/{sessionId}
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Session revoked successfully"
}
```

### Revoke All Other Sessions

```http
DELETE /auth/sessions
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "All other sessions revoked successfully"
}
```

## 🗑️ Account Management

### Deactivate Account

```http
POST /users/deactivate
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "CurrentPassword123!",
  "reason": "I no longer need this service"
}
```

**Response:**

```json
{
  "message": "Account deactivated successfully"
}
```

### Delete Account Permanently

```http
DELETE /users/account
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "CurrentPassword123!",
  "confirmation": "DELETE",
  "reason": "Too expensive"
}
```

**Response:**

```json
{
  "message": "Account deletion requested. Data will be permanently removed within 30 days."
}
```

### Export User Data (GDPR Compliance)

```http
POST /users/export-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "dataTypes": ["profile", "projects", "subscriptions", "reports"],
  "format": "json"
}
```

**Response:**

```json
{
  "data": {
    "profile": {
      /* user profile data */
    },
    "projects": [
      /* user projects */
    ],
    "subscriptions": [
      /* subscription history */
    ],
    "reports": [
      /* generated reports */
    ]
  },
  "exportedAt": "2025-08-11T10:30:00.000Z",
  "format": "json",
  "requestedTypes": ["profile", "projects", "subscriptions", "reports"]
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "New password and confirmation do not match",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Security Features

1. **Password Reset Tokens**: 1-hour expiry, single-use
2. **Email Verification Tokens**: 24-hour expiry, single-use
3. **Session Management**: Track and revoke active sessions
4. **Account Deactivation**: Soft delete with data preservation
5. **GDPR Compliance**: Complete data export functionality
6. **Password Validation**: Minimum 6 characters with complexity requirements
