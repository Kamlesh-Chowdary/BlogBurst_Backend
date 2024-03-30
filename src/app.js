import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// morgan.token("body", (request) => JSON.stringify(request.body));
// app.use(
//   morgan(":method :url  :status :res[content-length] - :response-time ms :body")
// );

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//importing routes

import { userRouter } from "./routes/user.routes.js";
import { postRouter } from "./routes/post.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

// Serve 'index.html' for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
export { app };
