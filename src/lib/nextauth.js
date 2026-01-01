import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const [resultSets] = await db.query("CALL searchUser(?)", [credentials.email]);
        const user = resultSets[0][0];
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return user info + rememberMe
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          rememberMe: credentials.rememberMe, // pass it along
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.rememberMe = user.rememberMe;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    },
  },

  // 🔑 Conditional cookie configuration
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "development",
        // If rememberMe is true → persistent 30 days, else session cookie
        maxAge: undefined, // will be overridden dynamically
      },
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Dynamically set cookie maxAge after signIn
      if (!user.rememberMe) {
        // Session-only: remove maxAge
        authOptions.cookies.sessionToken.options.maxAge = undefined;
      } else {
        // Persistent: 30 days
        authOptions.cookies.sessionToken.options.maxAge = 30 * 24 * 60 * 60;
      }
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
