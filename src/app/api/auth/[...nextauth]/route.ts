import NextAuth from "next-auth";
import { authOptions } from "./options";

const handlle = NextAuth(authOptions);

export { handlle as GET, handlle as POST };
