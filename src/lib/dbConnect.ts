import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  // in the nextjs when we make a api call to fetch the data from the database then nextjs make a connection again and again if the database is already connected so avoiding this issue we have to check the databse is already connected or not
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection faild", error);
    process.exit(1);
  }
}

export default dbConnect;
