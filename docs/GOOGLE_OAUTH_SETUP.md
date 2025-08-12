# Google OAuth Authentication Implementation

## Overview

This implementation adds Google OAuth 2.0 authentication to the SEO CMS backend, allowing users to sign in with their Google accounts.

## Features

- ✅ Google OAuth 2.0 login
- ✅ Automatic user creation for new Google users
- ✅ 14-day trial subscription for new Google users
- ✅ Secure JWT token generation
- ✅ Profile picture integration
- ✅ Email verification (auto-verified for Google users)
- ✅ Integration with existing user system

## API Endpoints

### 1. Initiate Google Authentication

```
GET /auth/google
```

Redirects user to Google OAuth consent screen.

### 2. Handle Google OAuth Callback

```
GET /auth/google/callback
```

Processes Google OAuth callback and redirects to frontend with JWT token.

**Success Response:**
Redirects to: `{FRONTEND_URL}/auth/google/success?token={jwt_token}`

## Environment Variables Required

Add these to your `.env` file:

```bash
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3001/auth/google/callback"

# Frontend URL for redirect after authentication
FRONTEND_URL="http://localhost:3000"
```

## Database Schema Changes

Added new fields to User table:

- `googleId`: Unique Google user identifier
- `profilePicture`: User's Google profile picture URL
- `password`: Now nullable for OAuth users

## Security Features

1. **Existing User Protection**: If a user already exists with the same email, the Google ID is linked to the existing account
2. **OAuth Account Protection**:
   - OAuth users cannot use password-based login
   - OAuth accounts cannot change passwords
   - OAuth accounts cannot be deactivated/deleted via password confirmation
3. **JWT Integration**: Same JWT system used for all authentication methods

## Frontend Integration

After successful Google authentication, users are redirected to:

```
{FRONTEND_URL}/auth/google/success?token={jwt_token}
```

The frontend should:

1. Extract the JWT token from URL parameters
2. Store the token in secure storage (localStorage/sessionStorage)
3. Use the token for subsequent API calls
4. Redirect user to dashboard/home page

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
5. Copy Client ID and Client Secret to `.env` file

## Testing

1. Start the backend server: `npm run start:dev`
2. Navigate to: `http://localhost:3001/auth/google`
3. Complete Google OAuth flow
4. Verify redirect to frontend with token
5. Test JWT token with protected endpoints

## User Flow

### New Google User:

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. User grants permissions
4. New user account created with:
   - Email from Google
   - Name from Google profile
   - Google ID linked
   - Profile picture from Google
   - Email auto-verified
   - 14-day trial subscription activated
5. JWT token generated and user redirected to frontend

### Existing User:

1. User with existing email signs in with Google
2. Google ID is linked to existing account
3. Profile picture updated
4. Email verified status set to true
5. JWT token generated and user redirected to frontend

## Error Handling

- Invalid Google credentials: User redirected to error page
- Email already exists (non-Google): Google ID linked to existing account
- Authentication failure: Error message displayed
- Missing environment variables: Server startup error

## Dependencies Added

```json
{
  "passport-google-oauth20": "^2.0.0",
  "@types/passport-google-oauth20": "^2.0.0"
}
```

## Files Modified/Created

### New Files:

- `src/auth/strategies/google.strategy.ts`
- `src/auth/guards/google-auth.guard.ts`

### Modified Files:

- `src/auth/auth.module.ts` - Added GoogleStrategy
- `src/auth/auth.controller.ts` - Added Google endpoints
- `src/auth/auth.service.ts` - Added googleLogin method
- `src/auth/dto/auth.dto.ts` - Added GoogleUserDto
- `src/users/users.service.ts` - Fixed nullable password handling
- `prisma/schema.prisma` - Added googleId and profilePicture fields
- `.env` - Added Google OAuth configuration

### Database Migration:

- `20250812022432_add_google_oauth_fields` - Added Google OAuth fields to User table
