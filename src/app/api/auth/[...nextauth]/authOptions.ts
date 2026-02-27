import connectDb from "@/lib/connectDb";
import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        // ✅ Always return User | null
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        try {
          const { usersCollection } = await connectDb();
          const existingUser = await usersCollection.findOne({ email });

          if (!existingUser) return null;
          if (!existingUser.password) return null; // Google signup user might not have password

          const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (!isPasswordValid) return null;

          // ✅ Return NextAuth User (NOT mongo document)
          return {
            id: existingUser._id.toString(),
            name: existingUser.name ?? null,
            email: existingUser.email ?? null,
            image: existingUser.image ?? null,
            role: existingUser.role ?? "user",
            isVerified: existingUser.isVerified ?? false,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      // Only for OAuth provider sign-in
      if (account?.provider === "google") {
        const { name, email, image } = user;
        if (!email) return false;

        const userInfo = {
          name,
          email,
          provider: "google",
          image,
        };

        try {
          const { usersCollection } = await connectDb();
          const existingUser = await usersCollection.findOne({ email });

          if (!existingUser) {
            await axios.post(
              `${process.env.NEXTAUTH_URL}/api/register`,
              userInfo
            );
          }
        } catch (error) {
          console.log(error);
          // sign in block না করতে চাইলে true
          return true;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // ✅ First time login: user is available
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isVerified = (user as any).isVerified;
        // NextAuth uses `picture` in token
        token.picture = user.image ?? null;
      }

      if (!token.email) return token;

      try {
        const { usersCollection } = await connectDb();
        const existingUser = await usersCollection.findOne({
          email: token.email,
        });

        if (!existingUser) {
          token.tokenExpired = true;
          return token;
        }

        token.tokenExpired = false;
        token.id = existingUser._id.toString();
        token.name = existingUser.name ?? token.name;
        token.email = existingUser.email ?? token.email;
        token.role = existingUser.role ?? "user";
        token.isVerified = existingUser.isVerified ?? false;
        token.picture = existingUser.image ?? token.picture ?? null;
      } catch (error) {
        console.log(error);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = (token.picture as string) ?? session.user.image;

        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.tokenExpired = token.tokenExpired ?? false;
      }

      return session;
    },
  },
};