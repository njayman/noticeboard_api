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
console.log(mongoUri);
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => console.log(error));

// mongoose
// .connect(
//   `mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )
// .catch((error) => console.log(error));

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
