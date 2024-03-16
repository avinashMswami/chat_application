import Conversation from "../models/conversation.model.js";
import Message from "../models/message.mode.js";
// import User from "../models/user.model.js";
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
      // console.log("This is the id of the newMessage that is created: ", newMessage._id);

      // if (newMessage){
        conversation.messages.push(newMessage._id)
      // } 
      // await conversation.save();

      await Promise.all([conversation.save(),newMessage.save()]);

      // await conversation.save();
      

      res.status(201).json({newMessage});
    } catch (error) {
        console.log("Error in sendMessage Controller: ",error);
        res.status.json({message:"Internal server error"})
    }
}

export const getMessage = async(req,res)=>{
    try {
      const {id:userToChat} = req.params;
      const {_id:senderId} = req.user;
      
      const conversation = await Conversation.findOne({
        participants:{$all: [senderId,userToChat]}}).populate("messages");
        // The actual messages array in the Conversation collection contains the message ids and 
        // not the exact messaage. So this populate function returns the entire message document/data
        // in place of the message id.
        // console.log(conversation);

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessage Controller: ",error);
        res.status.json({message:"Internal server error"})
    }

}

