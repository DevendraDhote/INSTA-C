const User = require("../models/userModel/user.models.js");
const Chat = require("../models/chatModel/chat.modal.js");
const GroupMessage = require("../models/chatModel/group_messages.model.js");
const { default: mongoose } = require("mongoose");
const Temp = require("../../src/models/chatModel/temp.js");
// module.exports = (io) => {
//   // console.log("hello", io);
//   io.on("connection", (socket) => {
//     console.log(`User connectedddd: ${socket.id}`);

//     socket.on("register", async (userId) => {
//       console.log(userId, "pata chale");
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $addToSet: { sockets: socket.id } },
//         { new: true }
//       );
//       console.log("lol->", updatedUser);
//     });

//     socket.on("sendMessage", async (data) => {
//       console.log("fofofo", data);
//       const message = await Chat.create({
//         sender_id: data.senderId,
//         receiver_id: data.receiverId,
//         content: data.content,
//       });

//       console.log("rooooo->", message);

//       const receiver = await User.findById(data.receiverId);
//       console.log("reveiver- -->", receiver);
//       receiver?.sockets?.forEach((sockId) => {
//         io.to(sockId).emit("receiveMessage", message);
//       });

//       // Send to all sender devices
//       const sender = await User.findById(data.senderId);
//       console.log("sender-->", sender);
//       sender?.sockets?.forEach((sockId) => {
//         console.log("lolololololo-------------------->", sockId)
//         if (sockId !== socket.id) {
//           io.to(sockId).emit("messageSent", message);
//         }
//       });
//     });

//     socket.on("disconnect", async () => {
//       console.log(`Disconnected: ${socket.id}`);
//       await User.updateMany({}, { $pull: { sockets: socket.id } });
//     });
//   });
// };

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`user connected : ${socket.id}`);

    socket.on("register", async (userId) => {
      socket.join(userId);
      console.log(`this socket ${socket.id} joined this ${userId} room`);
    });

    socket.on("sendMessage", async (data) => {
      const msg = await Chat.create({
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        content: data.content,
      });

      console.log("new message saved to db :", msg);

      io.to(data.receiverId).emit("receiveMessage", msg);
      console.log(`msg received : ${msg}`);

      io.to(data.senderId).emit("messageSent", msg);
      console.log(`msg sent : ${msg}`);
    });

    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on("sendGroupMessage", async (data) => {
      console.log("sabbbbb----------->==========================", data);

      const groupMessage = new GroupMessage({
        group_Id: data?.groupId,
        sender_Id: data.senderId,
        content: data.content,
      });
      await groupMessage.save();

      io.to(data.groupId).emit("receiveGroupMessage", groupMessage);
      console.log(`Group ${data.groupId} →`, groupMessage);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected : ${socket.id}`);
    });
  });
};
