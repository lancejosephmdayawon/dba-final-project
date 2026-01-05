// src/lib/nextauth.js

/* 
    BIG PICTURE SUMMARY
    When a user logs in:
      1. User enters email & password
      2. authorize() runs
      3. MySQL is checked
      4. Password is verified
      5. JWT is created
      6. Session is stored
      7. User stays logged in for 30 days
*/

import NextAuth from "next-auth"; // main authentication engine
import CredentialsProvider from "next-auth/providers/credentials"; // allow users log in using email + password (not Google, Facebook, etc.)
import bcrypt from "bcryptjs"; // for password hashing
import { db } from "@lib/db"; // MySQL connection

// NextAuth configuration (the object passed to NextAuth function)
export const authOptions = {
  providers: [
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        // Login form fields
        email: { label: "Email", type: "email" }, // Field for email
        password: { label: "Password", type: "password" }, // Field for password
      },

      async authorize(credentials) {
        // This function runs when the user clicks the Login button. It receives the credentials from the login form.

        // Step 1: Check if email & password exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Step 2:Call stored procedure to find user
        const [resultSets] = await db.query("CALL searchUser(?)", [
          credentials.email,
        ]);

        // Step 3: Get rows from result set
        const rows = resultSets[0];
        if (!rows.length) throw new Error("Invalid email or password"); // if no user found, throw error

        // Step 4: Get user from first row
        const user = rows[0];
        // Example data:
        // {
        //   id: 1,
        //   username: "lance",
        //   email: "lance@email.com",
        //   password: "$2a$10$hashedpassword..."
        //   etc...
        // }

        // Step 5: Compare password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid email or password"); // if password doesn't match, throw error

        // Step 6: Return user object (without password). NextAuth will store this object in a JWT.
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // JWT sessions - stored in cookies
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent. No need to login everytime.
  },

  pages: {
    signIn: "/login", // Instead of NextAuth’s default login page: It uses our custom /login page
  },

  callbacks: {
  // Callbacks are asynchronous functions that we can use to control what happens when an action is performed.

    async session({ session, token }) {
      // Add user info to session. This makes user data available everywhere: in API routes, server-side rendering, and client-side.
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    },

    async jwt({ token, user }) {
      // This stores user info inside the JWT. It runs when the JWT is created (i.e., at login) or updated.
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
  },

  // Secret for encrypting JWT, should be set in environment variables
  secret: process.env.NEXTAUTH_SECRET,
};

// Export NextAuth handler
const handler = NextAuth.default(authOptions);
export { handler as GET, handler as POST };
