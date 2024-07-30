const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

app.get("/", (req, res) => {
  res.send("MMORPG Server is running");
});

const users = {};

io.on("connection", (socket) => {
  console.log("New client connected");
  // Kullanıcıyı kaydet
  users[socket.id] = { x: 0, y: 0, z: 0 };
  // Oyun ile ilgili mesajları ve olayları burada yönetin
  console.log(users);

  socket.on("playerMove", (data) => {
    // Kullanıcı konumunu güncelle
    users[socket.id] = data;
    console.log("playerMove:", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Kullanıcıyı users nesnesinden sil
    delete users[socket.id];
    console.log(`User ${socket.id} removed`);
    console.log(users); // Silme işleminden sonra kullanıcıları konsola yazdır
  });
});

// Her saniye tüm kullanıcılara konum bilgilerini gönder
setInterval(() => {
  io.emit("updatePositions", users);
}, 20); // 1000 ms = 1 saniye

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
