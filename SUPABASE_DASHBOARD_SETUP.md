# Supabase Dashboard Setup Guide

This guide walks you through everything you need to configure on the Supabase dashboard to enable authentication.

## Step 1: Get Your API Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one if you haven't)
3. Navigate to **Settings** (gear icon) → **API**
4. You'll see three important values:

   **📋 Copy these values:**
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → This is your `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ **Important**: The `service_role` key has admin privileges. Never expose it to client-side code.

5. Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

## Step 2: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** (left sidebar)
2. Click on **Providers** tab
3. Find **Email** in the list of providers
4. **Enable** the Email provider (toggle it ON)
5. Configure the settings (optional but recommended):

   **Email Auth Settings:**
   - ✅ **Enable email confirmations** - Users must verify their email before logging in
   - ✅ **Enable secure email change** - Require confirmation for email changes
   - **Email confirmation link expiry** - Set to 24 hours (default is fine)
   - **Email change link expiry** - Set to 24 hours (default is fine)

   **Note**: If you want users to be able to log in immediately after registration without email confirmation, keep "Enable email confirmations" OFF for now.

## Step 3: Configure Email Templates (Optional)

If you enabled email confirmations, you can customize the email templates:

1. Go to **Authentication** → **Email Templates**
2. You'll see templates for:
   - **Confirm signup** - Sent when user registers
   - **Magic Link** - Sent for passwordless login
   - **Change Email Address** - Sent when email is changed
   - **Reset Password** - Sent for password reset

3. Customize the templates as needed (HTML and plain text versions)

## Step 4: Set Up Site URL (Important!)

This is required for authentication redirects to work:

1. Go to **Settings** → **Authentication**
2. Scroll down to **Site URL**
3. Set it to:
   - **Development**: `http://localhost:3000`
   - **Production**: Your production domain (e.g., `https://yourdomain.com`)

4. Scroll down to **Redirect URLs** section
5. Add your redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production, if you add OAuth later)

## Step 5: Configure Auth Settings (Recommended)

1. Still in **Settings** → **Authentication**
2. Review these settings:

   **Security Settings:**
   - **Enable JWT expiry** - Keep enabled (default: 3600 seconds)
   - **Refresh token rotation** - Enable for better security
   - **Enable refresh token reuse detection** - Enable for security

   **Password Settings:**
   - **Minimum password length** - Set to 8 (matches your app's validation)
   - **Password requirements** - Configure as needed

## Step 6: Enable Additional Providers (Optional)

If you want to add OAuth providers like Google, GitHub, etc.:

1. Go to **Authentication** → **Providers**
2. Click on the provider you want (e.g., **Google**, **GitHub**)
3. Enable it and configure:
   - **Client ID** (from the OAuth provider)
   - **Client Secret** (from the OAuth provider)
   - **Redirect URL** - Supabase will provide this, add it to your OAuth provider settings

## Step 7: Test Your Setup

1. Make sure your `.env.local` file has all the credentials
2. Start your Next.js app:
   ```bash
   pnpm dev
   ```
3. Navigate to `http://localhost:3000/auth/register`
4. Try creating a test account
5. Check your Supabase dashboard:
   - Go to **Authentication** → **Users**
   - You should see the new user appear there

## Quick Checklist

- [ ] Copied API credentials (URL, anon key, service role key) to `.env.local`
- [ ] Enabled Email provider in Authentication → Providers
- [ ] Set Site URL to `http://localhost:3000` (or your production URL)
- [ ] Added redirect URLs if needed
- [ ] Configured password requirements (optional)
- [ ] Tested registration flow

## Common Issues

### "Invalid login credentials"
- Make sure Email provider is enabled
- Check that your Site URL is set correctly
- Verify your API keys in `.env.local` are correct

### "Email not sent" (if email confirmation is enabled)
- Check Supabase dashboard → Settings → Auth → Email
- Verify email templates are configured
- Check Supabase project limits (free tier has email limits)

### "Redirect URL mismatch"
- Make sure your Site URL matches your app URL
- Add any callback URLs to the Redirect URLs list

## Next Steps After Dashboard Setup

1. **Test the authentication flow** - Register and login
2. **Set up Row Level Security (RLS)** - If you have database tables, configure RLS policies
3. **Add password reset** - Implement forgot password functionality
4. **Add OAuth providers** - If you want social login

## Security Best Practices

✅ **DO:**
- Keep your service role key secret (server-side only)
- Enable email confirmations for production
- Use strong password requirements
- Enable refresh token rotation
- Regularly review authentication logs

❌ **DON'T:**
- Expose service role key to client
- Skip email verification in production
- Use weak password requirements
- Share your API keys publicly

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

