require("./database/db");
const express = require("express");
const app = express();
const path = require("path");
const Instructor = require("./routes/Instructor");
const Student = require("./routes/Student")
const Admin = require("./routes/Admin")

const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Course } = require("./database/Course");

app.use(cookieParser());
app.use(
  session({
    name: "session",
    secret: "dgjdjdfjfjhhytjhd",
    duration: 30 * 60 * 1000,
    activeDuration: 50 * 60 * 1000,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
    resave: true
  })
);

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.11:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);



app.use("/admin", Admin);
app.use("/instructor", Instructor);
app.use("/", Student);

require("dotenv").config();

const server = app.listen(5000, function () {
  console.log("Server is running on port 5000 ");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    // origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected");

  socket.on("addUser", (data) => {
    addUser(data.userId, socket.id);


  });

  socket.on("send-message", ({ userId, message, sender }) => {
    const messageData = {
      senderId: userId,
      sender,
      message,
    };

    io.emit("getMessage", messageData);
  });

  // //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});