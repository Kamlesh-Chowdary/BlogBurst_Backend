import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";

dotenv.config({ path: "./.env" });

const app = express();
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App connection failed", error);
    });

    app.listen(process.env.PORT, () => {
      console.log("App is listening at port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection FAILED :", error);
  });
