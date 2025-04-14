const mongoose = require("mongoose");

const TempSchema = new mongoose.Schema({
    groupID :{ 
        type : mongoose.Schema.Types.ObjectId,
        ref:"Group"
    },
    senderID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    content:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("temp", TempSchema);