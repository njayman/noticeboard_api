//imports and declarations
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("./firebase-admin/admin")

const { PORT, DBNAME, DBUSER, DBPASSWORD } = process.env;
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

//socket handler
io.on("connect", (socket) => {
  console.log(`a user connected with ${socket.id}`);
  socket.on("connected", (boardId) => {
    console.log(boardId);
    io.emit("update", boardId);
  });
  socket.on("updatedata", (data) => {
    io.emit("update");
  });
});

//mongodb connection
mongoose
  .connect(
    `mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch((error) => console.log(error));

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
