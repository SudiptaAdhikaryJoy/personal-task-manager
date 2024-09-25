import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import axios from "axios";
import { endPoints } from "@/utils/api/route";
import { OAuthConfig } from "next-auth/providers/oauth";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  picture?: string | null;
  strPhone?: string | null;
  intId?: number | null;
  strEmail?: string | null;
  intRoleId?: number | null;
  isAllBranch?: boolean | null;
  isOrderFullAccess?: boolean | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresIn?: string | null;
  refreshTokenExpiresIn?: string | null;
}

interface CustomSession extends Session {
  user: User;
}

// Define a custom type for session configuration
interface CustomSessionOptions {
  jwt: boolean;
  maxAge: number;
  // Add other session properties as needed
}

// Define the session configuration explicitly with the correct type
const sessionConfig: Partial<CustomSessionOptions> = {
  jwt: true,
  maxAge: 30 * 24 * 60 * 60,
};

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: `${process.env.DISCORD_CLIENT_ID}`,
      clientSecret: `${process.env.DISCORD_CLIENT_SECRET}`,
    }),
    GithubProvider({
      clientId: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
    }),
    FacebookProvider({
      clientId: `${process.env.FACEBOOK_ID}`,
      clientSecret: `${process.env.FACEBOOK_SECRET}`,
    }),
    AzureADProvider({
      clientId: `${process.env.AZURE_AD_CLIENT_ID}`,
      clientSecret: `${process.env.AZURE_AD_CLIENT_SECRET}`,
      tenantId: `${process.env.AZURE_AD_TENANT_ID}`,
    }),
    GoogleProvider({
      clientId: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
    }),

    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const user = {
          ...credentials,
        } as User;
        if (user) {
          return user;
        } else {
          console.log("check your credentials");
          return null;
        }
      },
    }),
  ] as OAuthConfig<User>[],

  session: sessionConfig,

  callbacks: {
    async signIn(params) {
      const { user, account } = params;
      if (
        (user && account && account.provider === "azure-ad") ||
        (account && account.provider === "google")
      ) {
        const { id, name, email, image } = user;
        console.log(name, email, image, id);
        const postData = {
          strUserName: name,
          strFirstName: name,
          strEmail: email,
          strPhone: email,
          strPassword: id,
        };

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}${endPoints.auth.register}`,
            postData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (response?.data?.statusCode === 200) {
            console.log("Provider login response:", response?.data?.data);
          } else {
            console.error(
              "Error sending data to endpoint:",
              response.statusText,
            );
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          console.log("User and account found, setting tokens.");
          token = {
            ...token,
            ...user,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            accessTokenExpires: user.accessTokenExpiresIn,
            refreshTokenExpires: user.refreshTokenExpiresIn,
          };
        }

        if (trigger === "update" && session?.user) {
          console.log("Trigger is update, merging session user with token.");
          token = { ...token, ...session.user };
        }

        // if (Date.now() < ((token.accessTokenExpires * 1000) as number)) {
        //   console.log("Access token is still valid, returning token.");

        //   return token;
        // }
        if (new Date(token.accessTokenExpires) > new Date()) {
          console.log("Access token is still valid, returning token.");

          return token;
        }

        console.log("Access token has expired, attempting to refresh.");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${endPoints.auth.validaterefreshtoken}`,
          {
            refreshToken: token.refreshToken,
          },
        );

        if (response.data) {
          console.log("Token refresh successful, updating tokens.");
          token.accessToken = response.data.accessToken;
          token.refreshToken = response.data.refreshToken;
          token.accessTokenExpires = response.data.accessTokenExpires;
          token.refreshTokenExpires = response.data.refreshTokenExpires;
        } else {
          console.error("Failed to refresh token: Invalid response data");
          return null;
        }

        return token;
      } catch (error) {
        console.error(
          "Error refreshing token:",
          error.response?.data || error.message,
        );
        return null;
      }

      return { ...token, ...user };
    },

    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: Partial<User>;
    }) {
      session.user = token as User;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
