import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Server connection failed", error);
    });

    app.listen(process.env.PORT, () => {
      console.log("Server is listening at port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection FAILED :", error);
  });
