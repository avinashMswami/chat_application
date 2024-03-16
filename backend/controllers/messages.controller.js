import Conversation from "../models/conversation.model.js";
import Message from "../models/message.mode.js";
export const sendMessage = async(req,res)=>{
    // console.log("Hi from the sendMessage");
    const {message} = req.body;
    const {id:receiverId} = req.params;
    const {_id:senderId} = req.user;
    // console.log("This is the senderId that I got: ",senderId);
    
    try {
      let conversation = await  Conversation.findOne({
        participants:{$all: [senderId,receiverId] }
      });
      if (!conversation){
        conversation = await Conversation.create({participants:[senderId,receiverId]});
      }
      const newMessage = new Message({
        senderId,
        receiverId,
        message
      })
      // await newMessage.save();
      console.log("This is the id of the newMessage that is created: ", newMessage._id);

      // if (newMessage){
        conversation.messages.push(newMessage._id)
      // } 
      // await conversation.save();

      await Promise.all([conversation.save(),newMessage.save()]);
      // await conversation.save();
      

      res.status(201).json({newMessage});
    } catch (error) {
        console.log(error);
        res.status.json({message:"Internal server error"})
    }
}


