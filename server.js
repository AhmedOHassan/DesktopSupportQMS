require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Queue, Availability } = require("./models");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const users = {
  [process.env.CUSTOMER_USERNAME]: {
    password: process.env.CUSTOMER_PASSWORD,
    role: "customer",
  },
  [process.env.ADMIN_USERNAME]: {
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  },
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    res.status(200).json({ role: user.role });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/customer", async (req, res) => {
  const availability = await Availability.findOne();
  if (availability && !availability.isAvailable) {
    res.sendFile(path.join(__dirname, "public", "out_of_office.html"));
  } else {
    res.sendFile(path.join(__dirname, "public", "customer.html"));
  }
});

app.get("/admin", async (req, res) => {
  const queue = await Queue.findAll({
    order: [['createdAt', 'ASC']]
  });
  const availability = await Availability.findOne();
  res.render("admin", {
    queue,
    isAvailable: availability ? availability.isAvailable : false,
  });
});

app.post("/add-to-queue", async (req, res) => {
  const { name, ticketNumber } = req.body;
  const newCustomer = await Queue.create({ name, serving: false, ticketNumber: ticketNumber });
  io.emit("updateQueue", await Queue.findAll());
  io.emit("customerAdded");
  res.sendStatus(200);
});

app.delete("/remove-from-queue/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const queue = await Queue.findAll({
    order: [['createdAt', 'ASC']]
  });
  if (index >= 0 && index < queue.length) {
    await queue[index].destroy();
    io.emit("updateQueue", await Queue.findAll());
  }
  res.sendStatus(200);
});

app.post("/serve-customer/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const queue = await Queue.findAll({
    order: [['createdAt', 'ASC']]
  });
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
  const queue = await Queue.findAll({
    order: [['createdAt', 'ASC']]
  });
  res.render("display", { queue });
});

app.get("/get-availability", async (req, res) => {
  try {
    const availability = await Availability.findOne();
    res.json({ isAvailable: availability ? availability.isAvailable : false });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

app.post("/set-availability", async (req, res) => {
  const { isAvailable } = req.body;
  try {
    let availability = await Availability.findOne();
    if (!availability) {
      availability = await Availability.create({ isAvailable });
    } else {
      availability.isAvailable = isAvailable;
      await availability.save();
    }
    io.emit("availabilityChanged", isAvailable);
    res.status(200).send("Availability status updated successfully");
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: "Failed to update availability" });
  }
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
