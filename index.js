require("dotenv").config();
//imports and declarations
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("./firebase-admin/admin");
const redis = require("socket.io-redis");

const {
  PORT,
  DBNAME,
  DBUSER,
  DBPASSWORD,
  LOCALDBUSER,
  LOCALDBPASSWORD,
  DBSOURCE,
} = process.env;
const app = express();
app.use(express.json());
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  transports: ["websocket"],
  upgrade: false,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.adapter(redis({ host: "localhost", port: 6379 }));

//socket handler
io.on("connect", (socket) => {
  socket.on("join", (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });
  console.log(`a user connected with ${socket.id}`);
  socket.on("connected", (boardId) => {
    console.log(boardId);
    // io.emit("update", boardId);
    io.to(boardId.id).emit("update");
  });
  socket.on("updatedata", (data) => {
    console.log(data);
    io.to(data.id).emit("update");
  });
});

//mongodb connection

let mongoUri = DBSOURCE
  ? `mongodb://${LOCALDBUSER}:${LOCALDBPASSWORD}@localhost:27017/${DBNAME}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`
  : `mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;

const connectMongose = () => {
  try {
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

connectMongose();
// console.log(mongoUri);

// mongoose
// .connect(
//   `mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )
// .catch((error) => console.log(error));

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("connected to database");
// });

//route management
const masterRoute = require("./routes/masterRoute");
const noticeboardRoute = require("./routes/noticeboardRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

app.use("/", noticeboardRoute);
app.use("/admin", adminRoute);
app.use("/master", masterRoute);
app.use("/user", userRoute);

//listener
server.listen(PORT, () => {
  console.log("Server is up!");
});
