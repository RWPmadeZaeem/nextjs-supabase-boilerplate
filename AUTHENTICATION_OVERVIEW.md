# Authentication & Supabase Integration Overview

This document explains how authentication is implemented in your Snippy application using Supabase.

## Architecture Overview

Your app uses a **hybrid authentication approach** with:
- **Server Actions** for authentication operations (login, signup, logout)
- **Middleware** for session management and token refresh
- **React Query** for client-side user state management
- **Supabase SSR** for seamless session handling across server and client

---

## Components Breakdown

### 1. **Supabase Clients** (`src/lib/supabase/`)

#### Browser Client (`client.ts`)
```typescript
// Creates a Supabase client for client-side operations
export const supabase = createSupabaseBrowserClient();
```
- Used in React components and hooks
- Handles client-side auth operations
- Uses `@supabase/ssr` for session management

#### Server Client (`server.ts`)
```typescript
// Creates a Supabase client for server-side operations
export async function createSupabaseServerClient()
```
- Used in Server Actions and API routes
- Reads/writes cookies for session management
- Handles cookie storage automatically

#### Middleware Client (`middleware.ts`)
```typescript
// Refreshes auth tokens on each request
export async function updateSession(request: NextRequest)
```
- Runs on every request (except static files)
- Refreshes expired tokens automatically
- Updates session cookies

---

### 2. **Authentication Actions** (`src/actions/auth.ts`)

All auth operations are **Server Actions** that:

#### Login Action
```typescript
loginAction = safeActionClient
  .schema(loginSchema)  // Validates input with Zod
  .action(async ({ parsedInput }) => {
    // 1. Create server Supabase client
    // 2. Call signInWithPassword()
    // 3. Revalidate cache
    // 4. Return success + user data
  })
```

**Flow:**
1. User submits login form
2. Form validation (Zod schema)
3. Server action calls `supabase.auth.signInWithPassword()`
4. Supabase sets session cookies automatically
5. Cache is revalidated
6. User is redirected to home page

#### Signup Action
```typescript
signupAction = safeActionClient
  .schema(signupSchema)  // Includes password strength validation
  .action(async ({ parsedInput }) => {
    // 1. Create server Supabase client
    // 2. Call signUp()
    // 3. Revalidate cache
    // 4. Return success + user data
  })
```

**Flow:**
1. User submits registration form
2. Password validation (8+ chars, uppercase, lowercase, number, special char)
3. Password confirmation matching
4. Server action calls `supabase.auth.signUp()`
5. User account created in Supabase
6. Session cookies set automatically
7. User redirected to home page

#### Logout Action
```typescript
logoutAction = safeActionClient.action(async () => {
  // 1. Create server Supabase client
  // 2. Call signOut()
  // 3. Revalidate cache
  // 4. Redirect to login page
})
```

---

### 3. **Session Management** (`src/middleware.ts`)

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

**What it does:**
- Runs on **every request** (except static files/images)
- Calls `updateSession()` which:
  - Reads current session cookies
  - Calls `supabase.auth.getUser()` to validate/refresh token
  - Updates cookies if token was refreshed
  - Returns response with updated cookies

**Why this matters:**
- Prevents expired sessions
- Automatically refreshes tokens
- Keeps user logged in across page navigations
- No manual token refresh needed

---

### 4. **Client-Side User State** (`src/hooks/queries/user.ts`)

```typescript
export const useUser = () => {
  // Uses React Query for caching
  const queryData = useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Infinity,  // Never refetches unless invalidated
  });

  // Listens to auth state changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData([QueryKeys.USER], session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return queryData;
};
```

**How it works:**
1. **Initial fetch**: Gets current user from Supabase
2. **Caching**: React Query caches the user data
3. **Real-time updates**: `onAuthStateChange` listener updates cache when:
   - User logs in
   - User logs out
   - Token is refreshed
   - Session expires

**Usage in components:**
```typescript
const { data: user, isLoading } = useUser();
// user is null if not logged in
// user is User object if logged in
```

---

## Complete Authentication Flow

### Login Flow

```
1. User fills login form
   ↓
2. Form submission triggers loginAction (Server Action)
   ↓
3. Server Action creates Supabase server client
   ↓
4. Calls supabase.auth.signInWithPassword()
   ↓
5. Supabase validates credentials
   ↓
6. Supabase sets session cookies (access_token, refresh_token)
   ↓
7. Server Action revalidates cache
   ↓
8. Client receives success response
   ↓
9. Router redirects to home page
   ↓
10. Middleware refreshes token on next request
   ↓
11. useUser() hook fetches user data
   ↓
12. User is authenticated and logged in
```

### Registration Flow

```
1. User fills registration form
   ↓
2. Form validation (Zod schema):
   - Email format
   - Password strength (8+ chars, uppercase, lowercase, number, special)
   - Password confirmation match
   ↓
3. Form submission triggers signupAction (Server Action)
   ↓
4. Server Action creates Supabase server client
   ↓
5. Calls supabase.auth.signUp()
   ↓
6. Supabase creates user account
   ↓
7. Supabase sets session cookies
   ↓
8. Server Action revalidates cache
   ↓
9. User is automatically logged in
   ↓
10. Router redirects to home page
```

### Logout Flow

```
1. User clicks logout button
   ↓
2. Triggers logoutAction (Server Action)
   ↓
3. Server Action calls supabase.auth.signOut()
   ↓
4. Supabase clears session cookies
   ↓
5. Server Action revalidates cache
   ↓
6. Server Action redirects to /auth/login
   ↓
7. useUser() hook detects auth state change
   ↓
8. User state is cleared (set to null)
```

---

## Session Persistence

### How Sessions Are Stored

1. **Cookies**: Supabase stores session tokens in HTTP-only cookies
   - `sb-<project-id>-auth-token`: Access token
   - Additional cookies for refresh tokens

2. **Cookie Management**:
   - **Server**: `createSupabaseServerClient()` reads/writes cookies via Next.js `cookies()`
   - **Middleware**: `updateSession()` manages cookies in middleware context
   - **Browser**: `createSupabaseBrowserClient()` reads cookies automatically

3. **Automatic Refresh**:
   - Middleware checks token validity on every request
   - If expired, automatically refreshes using refresh token
   - Updates cookies with new tokens
   - User stays logged in seamlessly

---

## Security Features

### Input Validation
- **Zod schemas** validate all form inputs
- Password requirements enforced
- Email format validation

### Server-Side Actions
- All auth operations run on server
- Credentials never exposed to client
- Uses Supabase's secure authentication

### Session Management
- HTTP-only cookies (not accessible via JavaScript)
- Automatic token refresh
- Secure cookie settings

### Error Handling
- Errors caught and displayed via toast notifications
- User-friendly error messages
- No sensitive information leaked

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/actions/auth.ts` | Server actions for login/signup/logout |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/middleware.ts` | Session refresh logic |
| `src/middleware.ts` | Next.js middleware entry point |
| `src/hooks/queries/user.ts` | React hook for current user |
| `src/app/auth/login/page.tsx` | Login page UI |
| `src/app/auth/register/page.tsx` | Registration page UI |
| `src/schema/auth.ts` | Zod validation schemas |

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Best Practices Implemented

✅ **Server Actions** for all auth operations  
✅ **Type-safe** with TypeScript and Zod  
✅ **Automatic session refresh** via middleware  
✅ **Real-time auth state** with React Query  
✅ **Form validation** before submission  
✅ **Error handling** with user feedback  
✅ **Protected routes** (redirects if not logged in)  
✅ **Secure cookie handling** via Supabase SSR  

---

## Extending Authentication

### Adding OAuth Providers

1. Enable provider in Supabase Dashboard (Auth → Providers)
2. Add OAuth button to login/register pages
3. Create new action: `oauthSignInAction(provider: 'google' | 'github')`
4. Call `supabase.auth.signInWithOAuth({ provider })`

### Adding Password Reset

1. Create forgot password page
2. Add action: `resetPasswordAction(email)`
3. Call `supabase.auth.resetPasswordForEmail(email)`
4. Handle email confirmation flow

### Adding Email Confirmation

1. Enable email confirmation in Supabase Dashboard
2. Update signup flow to handle unconfirmed users
3. Add email confirmation page
4. Call `supabase.auth.resend()` if needed

---

## Troubleshooting

### Session not persisting
- Check middleware is running (see `src/middleware.ts`)
- Verify cookies are being set (browser DevTools → Application → Cookies)
- Ensure `updateSession()` is called on each request

### User state not updating
- `useUser()` hook should auto-update via `onAuthStateChange`
- Try calling `router.refresh()` after login
- Check React Query cache is not stale

### "Unauthorized" errors
- Verify Supabase credentials in `.env.local`
- Check Row Level Security (RLS) policies in Supabase
- Ensure tokens are being refreshed by middleware

