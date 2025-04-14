const Chat = require('../../models/chatModel/chat.modal.js');
// const io = require('../../../index.js')

// io.on("connection", (socket) => {
//   socket.on("chat-message", (msg) => {
//     console.log("message ->", msg);
//   });
// });


const saveMessage = async ({ senderId, receiverId, content }) => {
    try {
      const message = new Chat({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      });
  
      await message.save();
  
      return message;
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  };

module.exports = {saveMessage};