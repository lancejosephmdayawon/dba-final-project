// src/lib/nextauth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@lib/db"; // MySQL connection

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Call stored procedure to find user
        const [resultSets] = await db.query("CALL searchUser(?)", [credentials.email]);
        const rows = resultSets[0];
        if (!rows.length) throw new Error("Invalid email or password");

        const user = rows[0];

        // Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",           // JWT sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent
  },

  pages: {
    signIn: "/login", // custom login page
  },

  callbacks: {
    async session({ session, token }) {
      // Add user info to session
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
