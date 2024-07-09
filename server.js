const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Queue } = require("./models");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const users = {
  customer: { password: "customerpass", role: "customer" },
  admin: { password: "adminpass", role: "admin" },
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    if (user.role === "customer") {
      res.redirect("/customer");
    } else if (user.role === "admin") {
      res.redirect("/admin");
    }
  }
});

app.get("/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer.html"));
});

app.get("/admin", async (req, res) => {
  const queue = await Queue.findAll();
  res.render("admin", { queue });
});

app.post("/add-to-queue", async (req, res) => {
  const { name } = req.body;
  const queueLength = await Queue.count();
  const newCustomer = await Queue.create({ name, serving: queueLength === 0 });
  io.emit("updateQueue", await Queue.findAll());
  io.emit("customerAdded");
  res.sendStatus(200);
});

app.delete("/remove-from-queue/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const queue = await Queue.findAll();
  if (index >= 0 && index < queue.length) {
    const isCurrentlyServing = queue[index].serving;
    await queue[index].destroy();
    const updatedQueue = await Queue.findAll();
    if (isCurrentlyServing && updatedQueue.length > 0) {
      const firstInQueue = updatedQueue[0];
      firstInQueue.serving = true;
      await firstInQueue.save();
      io.emit("customerIsBeingServed");
    }
    io.emit("updateQueue", await Queue.findAll());
  }
  res.sendStatus(200);
});

app.post("/serve-customer/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const queue = await Queue.findAll();
  if (index >= 0 && index < queue.length) {
    const ticket = queue[index];
    ticket.serving = true;
    await ticket.save();
    io.emit("updateQueue", await Queue.findAll());
    io.emit("customerIsBeingServed");
  }
  res.sendStatus(200);
});

app.get("/display", async (req, res) => {
  const queue = await Queue.findAll();
  res.render("display", { queue });
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
