# Supabase Auth Integration Guide

## ✅ What's Already Implemented

Your project already has **complete Supabase authentication integration**! Here's what's in place:

### 1. **Auth Actions** (`src/actions/auth.ts`)
- ✅ `loginAction` - Email/password login
- ✅ `signupAction` - User registration  
- ✅ `logoutAction` - Sign out functionality

### 2. **Auth Pages**
- ✅ **Login Page** (`src/app/auth/login/page.tsx`)
  - Form validation with Zod
  - Error handling with toast notifications
  - Auto-redirect if already logged in
  
- ✅ **Register Page** (`src/app/auth/register/page.tsx`)
  - Password strength requirements
  - Password confirmation matching
  - Auto-redirect if already logged in

### 3. **Supabase Clients**
- ✅ **Browser Client** (`src/lib/supabase/client.ts`)
- ✅ **Server Client** (`src/lib/supabase/server.ts`)
- ✅ **Middleware** (`src/lib/supabase/middleware.ts`) - Auto-refreshes sessions

### 4. **User State Management**
- ✅ `useUser()` hook (`src/hooks/queries/user.ts`)
  - Fetches current user
  - Auto-updates on auth state changes
  - React Query integration for caching

## 🚀 Quick Start

### Step 1: Configure Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="QuickRef"
```

**Where to find these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **API**
3. Copy the values from the API settings page

### Step 2: Enable Email Auth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional)

### Step 3: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to:
   - Login: `http://localhost:3000/auth/login`
   - Register: `http://localhost:3000/auth/register`

3. Try creating an account and logging in!

## 📁 File Structure

```
src/
├── actions/
│   └── auth.ts              # Server actions for login/signup/logout
├── app/
│   └── auth/
│       ├── login/
│       │   └── page.tsx      # Login page component
│       └── register/
│           └── page.tsx      # Registration page component
├── hooks/
│   └── queries/
│       └── user.ts           # useUser() hook for current user
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Supabase client
│   │   └── middleware.ts     # Session refresh middleware
└── schema/
    └── auth.ts               # Zod schemas for validation
```

## 🔧 How It Works

### Login Flow
1. User submits login form
2. `loginAction` server action is called
3. Supabase `signInWithPassword()` authenticates user
4. Session cookie is set automatically
5. Middleware refreshes session on each request
6. User is redirected to home page

### Registration Flow
1. User submits registration form
2. `signupAction` server action is called
3. Supabase `signUp()` creates new user
4. Session cookie is set automatically
5. User is redirected to home page

### Getting Current User
```tsx
import { useUser } from '@/hooks/queries/user';

function MyComponent() {
  const { data: user, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

## 🎯 Next Steps

### Optional Enhancements

1. **Email Confirmation**
   - Configure email templates in Supabase
   - Add email confirmation page
   - Handle unconfirmed users

2. **Password Reset**
   - Add forgot password page
   - Implement password reset flow
   - Add reset password action

3. **OAuth Providers**
   - Enable Google, GitHub, etc. in Supabase
   - Add OAuth buttons to login/register pages

4. **Protected Routes**
   - Use middleware to protect routes
   - Add role-based access control

5. **User Profile**
   - Create profile page
   - Add profile update actions

## 📚 Key Files to Review

- **`src/actions/auth.ts`** - Auth server actions
- **`src/app/auth/login/page.tsx`** - Login UI
- **`src/app/auth/register/page.tsx`** - Registration UI
- **`src/hooks/queries/user.ts`** - User state hook
- **`src/middleware.ts`** - Session management

## 🔍 Troubleshooting

### "Missing environment variables" error
- Make sure `.env.local` exists and has all required variables
- Restart the dev server after changing `.env.local`

### "Invalid credentials" error
- Check your Supabase credentials in `.env.local`
- Verify email auth is enabled in Supabase dashboard

### Session not persisting
- Check middleware is running (see `src/middleware.ts`)
- Verify cookies are being set in browser dev tools

### User not updating after login
- The `useUser()` hook should auto-update via `onAuthStateChange`
- Try calling `router.refresh()` after login

## 📖 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Project Auth Docs](./docs/backend/auth-and-supabase.md)

