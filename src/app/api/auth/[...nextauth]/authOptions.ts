import connectDb from "@/lib/connectDb";
import axios from "axios";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email) {
          const { email, password } = credentials
          try {
            const { usersCollection } = await connectDb();
            const user = await usersCollection.findOne({ email });
            if (user) {
              const isPasswordValid = await bcrypt.compare(password, user.password);
              if (isPasswordValid) {
                return user
              }
            } else {
              return null
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
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

      if (account) {
        const { provider } = account;
        const { name, email, image } = user;
        const userInfo = {
          name,
          email,
          provider,
          image,
        }

        try {
          const { usersCollection } = await connectDb();
          const query: any = { email };
          const existingUser = await usersCollection.findOne(query);
          if (!existingUser) {
            await axios.post(`${process.env.NEXTAUTH_URL}/api/register`, userInfo);
          }

        } catch (error) {
          console.log(error);
        }
      }

      return true;
    },

    async jwt({ token }) {
      if (token) {
        const email = token.email;
        try {
          const { usersCollection } = await connectDb();
          const query: any = { email };
          const existingUser = await usersCollection.findOne(query);
          if (!existingUser) {
            token.tokenExpired = true;
          } else {
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.image = existingUser.image;
            token.isVerified = existingUser.isVerified;
          }
        } catch (error) {
          console.log(error)
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          role: token.role as string,
          image: token?.image as string,
          isVerified: token?.isVerified,
          tokenExpired: token?.tokenExpired as boolean || false
        };
      }
      return session;
    },

  },
}