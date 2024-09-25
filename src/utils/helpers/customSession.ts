import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

type CustomUser = Session["user"] & {
  name?: string;
  email?: string;
  enroll?: string;
  role?: string;
  employeeId?: string;
  org?: string;
  access_token?: string;
  refresh_token?: string;
  access_token_expiresIn?: string;
  refresh_token_expiresIn?: string;
};

type CustomSession = Omit<Session, "user"> & {
  user: CustomUser;
};

export const useCustomSession = () => {
  const {
    data: session,
    status,
    update,
  } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
    update: (data?: Partial<CustomSession>) => Promise<CustomSession | null>;
  };

  return {
    session,
    status,
    update,
  };
};
