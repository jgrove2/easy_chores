import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from './database';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Type-safe profile access
        const profileData = profile as Record<string, unknown> | undefined;
        const profileName = profileData?.name as string | undefined;
        const profilePicture = profileData?.picture as string | undefined;
        const profileAvatar = profileData?.avatar_url as string | undefined;

        if (!existingUser) {
          // Create new user
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || profileName || '',
              image: user.image || profilePicture || profileAvatar || '',
            },
          });
        } else {
          // Update existing user with latest info from provider
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name || profileName || existingUser.name,
              image: user.image || profilePicture || profileAvatar || existingUser.image,
            },
          });
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session }) {
      // Add user ID to session
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (user) {
          (session.user as { id: string }).id = user.id;
        }
      }
      return session;
    },
    async jwt() {
      // Add custom JWT properties here
      return {};
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};