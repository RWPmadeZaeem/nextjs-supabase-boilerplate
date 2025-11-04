# Supabase Connection Setup Guide

This guide will help you connect your Supabase project to this Next.js application.

## Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- A Supabase project created
- Supabase CLI installed (optional, for type generation)

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **API**
4. You'll find the following credentials:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

⚠️ **Important**: The `service_role` key has admin privileges. Never expose it to the client-side code.

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in the root of this project
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key"

# App Configuration (adjust as needed)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="QuickRef"
```

### Where to find each value:

- **NEXT_PUBLIC_SUPABASE_URL**: Found in Project Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Found in Project Settings → API → Project API keys → `anon` `public`
- **SUPABASE_SERVICE_ROLE_KEY**: Found in Project Settings → API → Project API keys → `service_role` `secret`

## Step 3: Generate TypeScript Types (Recommended)

To get type safety for your Supabase database schema, generate TypeScript types:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Generate types:
   ```bash
   supabase gen types typescript --linked > src/types/supabase.ts
   ```

### Option B: Using the npm script

Update the `supa:types` script in `package.json` with your project ID, then run:

```bash
pnpm supa:types
```

Or manually from the Supabase dashboard:

1. Go to Project Settings → API
2. Scroll to "Project API keys" section
3. Find your `project_id` (it's in the URL: `https://app.supabase.com/project/<project-id>`)
4. Update the script in `package.json`:
   ```json
   "supa:types": "supabase gen types --lang=typescript --project-id 'YOUR-PROJECT-ID' --schema public > ./src/types/supabase.ts"
   ```
5. Run: `pnpm supa:types`

## Step 4: Verify the Connection

1. Make sure your `.env.local` file is properly configured
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. The app should start without environment variable errors
4. Test the connection by checking the browser console or network tab

## Step 5: Test Authentication (Optional)

If you want to test authentication:

1. Enable authentication in your Supabase project
2. Go to Authentication → Providers in the Supabase dashboard
3. Enable the providers you want to use (Email, OAuth, etc.)
4. Test authentication flows in your app

## Project Structure

This project uses the following Supabase client setup:

- **Browser Client** (`src/lib/supabase/client.ts`): For client-side operations
- **Server Client** (`src/lib/supabase/server.ts`): For server-side operations
- **Middleware** (`src/lib/supabase/middleware.ts`): For session refresh on each request

## Troubleshooting

### Error: "Missing environment variables"

- Make sure `.env.local` exists in the root directory
- Verify all required variables are set (check `src/env.ts` for requirements)
- Restart your development server after changing `.env.local`

### Error: "Invalid Supabase URL or key"

- Double-check your credentials in `.env.local`
- Ensure there are no extra spaces or quotes around the values
- Verify the credentials in your Supabase dashboard

### Types not updating

- Regenerate types after making schema changes in Supabase
- Make sure you're using the correct project ID
- Check that `src/types/supabase.ts` is writable

## Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore` (already configured)
- Use the `anon` key for client-side operations
- Use the `service_role` key only on the server side
- Enable Row Level Security (RLS) in Supabase

❌ **DON'T:**
- Commit `.env.local` to version control
- Expose the `service_role` key to the client
- Share your Supabase credentials publicly

## Next Steps

- Set up database tables in Supabase
- Configure Row Level Security (RLS) policies
- Set up authentication providers
- Review the documentation in `/docs/backend/auth-and-supabase.md`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

