import { z } from "zod";

// zod is the npm package which is use for validation in typeScript. Specialy schema validation

// we use this when we check validation individualy
export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 charecters")
  .max(20, "Username must be no more than 20 charecters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special charecter");

// We use this when we check multiple validation on once
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 charecters"),
});
