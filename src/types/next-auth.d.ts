import "next-auth";
import { DefaultSession } from "next-auth";

// we define interface of User so we can access user properties during authentication

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  //   we define interface for seesion so we can able to access the propertie of the user
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

// this is the alternate way to define the interface
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
