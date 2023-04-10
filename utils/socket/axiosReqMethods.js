const axios = require('axios');
const {
    profileURLS,
    roomURLS,
    personalChatURLS,
    messageUrls
} = require("./axiosReqURLs");

//set the status of the user to online 
const statusOnlineSetRequest = async ({userId}) => {
    try{
        
        const res = await axios.get(`${profileURLS.setOnline}${userId}`)
        return res.data
    }
    catch(err){
        
        console.log("Inside setonline")
        throw {
            "_message": "Error in setting status to online!",
        }
    }
}

//set the stsus of the user to offline
const statusOfflineLastSeen = async ({userId}) => {
    try{
        const res = await axios.get(`${profileURLS.setOfflineLastSeen}${userId}`)
       
        return res.data
    }
    catch(err){
        console.log(err);
        throw {
            "_message": "Error in setting status to offline and last seen!",
        }
    }
}


//check if user belongs to a room
const checkMemberOfRoom = async ({roomId, userId}) => {
    try{
        const res = await axios.post(`${roomURLS.checkIfMemberOfRoom}`,
            {
                userId,
                roomId,
            }
        )
        return res.data;
    }
    catch(err){
        throw {
            "_message": "Error in checking if member of room!",
        }
    }
}


//check member of personal chat
const checkMemberOfChat = async ({chatId, userId}) => {
    try{
        const result = await axios.post(`${personalChatURLS.checkIfMemberOfChat}`,
            {
                chatId,
                userId,
            }
        )
        console.log(result.data)
        return result.data;
    }
    catch(err){
        console.log(err)
        throw {
            "_message": "Error in checking if member of chat",
        }
    }
}


const sendRoomMessage= async ({message,roomId}) => {
    console.log(message,roomId);
    try{
        
        console.log(message, roomId)
        console.log("1");
        const messageId = await axios.post(`${messageUrls.createMessage}`,{
          ...message
        },
        {
            headers: {
              'Content-Type': 'application/json'
            }}
        )
        console.log(messageId.body);
        // const updatedRoom = await axios.post(`${roomURLS.sendMessage}`,{
        //     messageId,
        //     roomId
        // }, {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }})
        console.log("3");
        console.log(updatedRoom);
    }
    catch(err){
        throw {
            "_message": "Error in sending message",
        }
    }
}

module.exports = {
    statusOnlineSetRequest,
    statusOfflineLastSeen,
    checkMemberOfRoom,
    checkMemberOfChat,
    sendRoomMessage
}