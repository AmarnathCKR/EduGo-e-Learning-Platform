require("./database/db");
const express = require("express");
const app = express();
const path = require("path");
const Instructor1 = require("./routes/Instructor");
const Instructor = require("./database/Instructor")
const Student = require("./routes/Student")
const Admin = require("./routes/Admin")

const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Course } = require("./database/Course");
const Conversation = require("./database/Conversation");
const { addUser, getUser, deleteUser, getUsers } = require('./users')

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
    origin: ["http://localhost:5000", "http://edugo.website","https://edugo.website"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);



app.use("/admin", Admin);
app.use("/instructor", Instructor1);
app.use("/", Student);

require("dotenv").config();

const server = app.listen(5000, function () {
  console.log("Server is running on port 5000 ");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    // origin: "http://localhost:3000",
  },
});




io.on('connection', async (socket) => {
  socket.on('login', ({ name, room }, callback) => {
    const { user, error } = addUser(socket.id, name, room)
    if (error) return callback(error)
    socket.join(user.room)
    socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
    io.in(room).emit('users', getUsers(room))
    callback()
})

socket.on('sendMessage', message => {
    const user = getUser(socket.id)
    io.in(user.room).emit('message', { user: user.name, text: message });
})

socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id)
    if (user) {
        io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
        io.in(user.room).emit('users', getUsers(user.room))
    }
})

});



io.to('room1').emit('an event', { some: 'data' });
