import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

const connectToDB = () => {
  mongoose
    .connect(databaseURL)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

app.use(
  cors({
    origin: [process.env.ORIGIN, "http://localhost:5173", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running" });
});

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);


const startServer = async () => {
  connectToDB();
  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  setupSocket(server);
};

startServer();

// const server = app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

// setupSocket(server);

// mongoose
//   .connect(databaseURL)
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
