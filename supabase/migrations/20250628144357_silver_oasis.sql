/*
  # Fix Users Table RLS Policies

  This migration fixes the Row Level Security policies for the users table
  to allow proper user authentication and profile management.

  ## Changes Made
  1. Enable RLS on users table
  2. Add policy for users to read their own profile
  3. Add policy for users to insert their own profile (crucial for new users)
  4. Add policy for users to update their own profile

  ## Security
  - Users can only access their own data (id = auth.uid())
  - Prevents unauthorized access to other users' profiles
  - Allows new user registration and profile updates
*/

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Policy for SELECT: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for INSERT: Users can create their own profile (essential for new users)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);