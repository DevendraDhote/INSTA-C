const app = require("./src/app.js");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db/db.js");
const chatSocketHandler = require('./src/sockets/chat.js')
const { createServer } = require("http");
const server = createServer(app); // wrap express app
const { Server } = require("socket.io");
const io = new Server(server);

dotenv.config();

chatSocketHandler(io);

connectDB();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
