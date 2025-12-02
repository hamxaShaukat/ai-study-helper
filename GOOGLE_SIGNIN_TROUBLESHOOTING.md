# Google Sign-In Troubleshooting Guide

## Common Issues and Solutions

### 1. **Pop-up Blocked Error**
**Error Message:** "Pop-up was blocked. Please allow pop-ups for this site and try again."

**Solution:**
- Check browser pop-up blocker settings
- Add `http://localhost:5173` to your pop-up allow list
- For production, add your domain to the allow list

### 2. **"Google Sign-In is not supported in this browser"**
**Error Message:** "Google Sign-In is not supported in this browser. Try Chrome, Firefox, or Safari."

**Solution:**
- Use a supported browser (Chrome, Firefox, Safari, Edge)
- Clear browser cache and cookies
- Disable browser extensions that might interfere (especially privacy extensions)
- Try a different browser

### 3. **Network Error**
**Error Message:** "Network error. Please check your internet connection and try again."

**Solution:**
- Check your internet connection
- Verify Firebase credentials in `.env` file
- Check if `.env` file has proper Firebase configuration
- Make sure `VITE_FIREBASE_API_KEY` and other credentials are correct

### 4. **Firebase Console Configuration Missing**
**Issue:** Google Sign-In provider not enabled in Firebase

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project `ai-study-helper-941fa`
3. Go to **Authentication** > **Sign-in method**
4. Enable **Google** provider
5. Make sure you've added an OAuth consent screen

### 5. **OAuth Consent Screen Not Set Up**
**Issue:** Google requires OAuth consent screen

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** > **OAuth consent screen**
3. Select **External** user type
4. Fill in required information:
   - App name: "StudyAI"
   - User support email: Your email
   - Developer contact: Your email
5. Add required scopes (email, profile)
6. Save and continue

### 6. **Redirect URI Mismatch**
**Issue:** The redirect URI doesn't match Firebase configuration

**Solution:**
1. In Firebase Console > **Authentication** > **Sign-in method** > **Google**
2. Make sure "Authorized redirect URIs" includes:
   - `http://localhost:5173/`
   - `https://yourdomain.com/` (for production)

### 7. **CORS Error**
**Error:** CORS error when signing in

**Solution:**
- This is usually handled by Firebase SDK automatically
- Ensure your domain is properly configured in Google Cloud Console
- Clear browser cache

## How to Debug

1. **Check Browser Console:**
   - Press `F12` to open Developer Tools
   - Go to Console tab
   - Look for error messages starting with "auth/"

2. **Enable Logging in AuthContext:**
   The code already has `console.log()` statements. Check:
   - "Google auth error:" messages with the full error code

3. **Common Error Codes:**
   - `auth/popup-closed-by-user` - User cancelled the sign-in
   - `auth/popup-blocked` - Browser blocked the pop-up
   - `auth/operation-not-supported-in-this-environment` - Browser doesn't support
   - `auth/network-request-failed` - Network issues
   - `auth/invalid-api-key` - Invalid Firebase API key

## Testing Google Sign-In Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Sign-In page:**
   - Go to http://localhost:5173/auth
   - Or wait 5 seconds on home page for auto-modal

3. **Click "Continue with Google" button**

4. **Check for errors in console (F12)**

5. **If successful:**
   - You should be redirected to /dashboard
   - User info should appear in sidebar

## Production Deployment

When deploying to production:

1. **Update Firebase Configuration:**
   - Add production domain to Authorized redirect URIs
   - Example: `https://yourdomain.com/`

2. **Update Environment Variables:**
   ```env
   # Production .env
   VITE_FIREBASE_API_KEY=your_api_key
   # ... other variables
   ```

3. **Update Google Cloud Console:**
   - Add production domain to authorized JavaScript origins
   - Add production domain to authorized redirect URIs

4. **Test in Production:**
   - Test Google Sign-In with your production domain
   - Check browser console for errors

## Code Changes Made

1. **AuthContext.tsx:**
   - Added better error handling for Google Sign-In
   - Added custom parameters for account selection
   - Added scope configuration

2. **AuthPage.tsx:**
   - Integrated with useAuth hook
   - Added error state and display
   - Added loading state for buttons
   - Added navigation to /dashboard after successful sign-in

3. **Enhanced Error Messages:**
   - User-friendly error descriptions
   - Specific error codes and solutions
   - Network error detection

## Still Having Issues?

1. Check the browser console for the specific error code
2. Match the error code with the solutions above
3. Verify Firebase credentials in `.env` file
4. Try a different browser
5. Check Firebase Console > Authentication > Sign-in method
6. Verify OAuth consent screen is set up
