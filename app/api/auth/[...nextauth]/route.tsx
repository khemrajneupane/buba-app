import dbConnect from "@/backend/config/dbConnect";
import User, { IUser } from "@/backend/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";
type Credentials = {
  email: string;
  password: string;
};

type Token = {
  user: IUser;
};

async function auth(req: NextRequest, res: any) {
  return await NextAuth(req, res, {
    session: {
      strategy: "jwt",
    },
    providers: [
      GoogleProvider({
        //@ts-ignore
        clientId: process.env.GOOGLE_CLIENT_ID,
        //@ts-ignore
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        // this is for credentials based login authentication
        // @ts-ignore
        async authorize(credentials: Credentials) {
          dbConnect();

          const { email, password } = credentials;

          const user = await User.findOne({ email }).select("+password"); // check the IUser model where password is type select is false means you cannot see the password. But with select("+password"), we can access here.

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordMatched) {
            throw new Error("Invalid email or password");
          }

          return user;
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        const jwtToken = token as Token;

        // If logging in for the first time (Google login included)
        if (user && user.email) {
          await dbConnect();

          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            // Create a new user in MongoDB if not found
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              password: user.name, // Leave empty for Google OAuth
              role: "user",
              createdAt: new Date(),
            });
          }

          jwtToken.user = dbUser;
        }

        // Update session when user is updated
        if (req.url?.includes("/api/auth/session?update")) {
          const updatedUser = await User.findById(jwtToken?.user?._id);
          jwtToken.user = updatedUser;
        }

        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user as IUser;
        //@ts-ignore
        delete session?.user?.password;
        return session;
      },
    },

    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export { auth as GET, auth as POST }; //next auth uses both get and post
