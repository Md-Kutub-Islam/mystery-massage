// getServerSession is use for get the user session
import { getServerSession } from "next-auth";
// accessing some credential we authOptions
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  // geting current logeding user and getServerSession is take authoptions otherwise it not work
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session) {
    console.log("world");

    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  // if the user id type is string so some time it create a problem specialy when we write a aggregarate pipeline because it accept the object. so first we have to convet the type of string to object
  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", message: { $push: "$message" } } },
    ]);

    if (!user || !user.length) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpected error occured:", error);
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 500 }
    );
  }
}
