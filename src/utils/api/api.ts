import axios, { type AxiosInstance, type RawAxiosRequestHeaders } from "axios";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

type CustomSession = Session & {
  user: Session["user"] & {
    strAccess_token?: string;
    strRefresh_token?: string;
    access_token_expiresIn?: string;
    refresh_token_expiresIn?: string;
  };
};

export const apiSetup = async () => {
  const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
  const session = (await getSession()) as CustomSession | null;

  if (session?.user?.strAccess_token) {
    const commonHeaders: RawAxiosRequestHeaders = {
      "X-Frame-Options": "DENY",
      Authorization: `Bearer ${session.user.strAccess_token}`,
    };

    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common = {
        ...api.defaults.headers.common,
        ...commonHeaders,
      };
    }
  }

  return api;
};
