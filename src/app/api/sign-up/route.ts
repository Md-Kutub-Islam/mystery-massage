import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const exitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerifyed: true,
    });

    if (exitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const exitingUserVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (exitingUserVerifiedByEmail) {
      if (exitingUserVerifiedByEmail.isVerifyed) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        exitingUserVerifiedByEmail.password = hasedPassword;
        exitingUserVerifiedByEmail.verifyCode = verifyCode;
        exitingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await exitingUserVerifiedByEmail.save();
      }
    } else {
      // Bcrypt password
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      // setting the expiring date 1 houre
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerifyed: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
      console.log("newUser: ", newUser);
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
