const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const cors = require("cors");
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');
const { 
    statusOnlineSetRequest, 
    statusOfflineLastSeen,
    checkMemberOfRoom, 
    checkMemberOfChat,
    sendRoomMessage,
    getRoomMessages
} = require('./utils/socket/axiosReqMethods');
const { welcomeMessage } = require('./utils/socket/socketFunctions');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
const botName = "bot";

const PORT = 4000 || process.env.PORT;



io.on('connection', socket => {

    const user = socket.request.headers;
    const userId = user.userid;

    console.log(userId);

    socket.on('test',  (message) => {
       console.log(message);
    })

    //Set status to online
    socket.on('setOnline', async () => {
        try{
            await statusOnlineSetRequest({userId: userId});
        }
        catch(err){
            console.log(err);
        }
    })


    //Join socket of room after validating 
    //if user exists
    socket.on('enterRoom', async ({roomId}) => {

        try{
            // const isMember = await checkMemberOfRoom({userId: userId, roomId});
            // console.log(isMember);
            // if(isMember){
                socket.join(roomId);
                console.log("Joined socket of room")
            //}
        }
        catch(err){
            console.log(err);
        }
    
    })


    //Join socket of personal chat after
    //validating if user exist
    socket.on('startChat', async ({chatId}) => {
        try{
            const isMember = await checkMemberOfChat({userId: userId, chatId});
            console.log(member);
            if(isMember){
                socket.join(chatId);
                console.log("Joined socket of personal chat")
            }
        }
        catch(err){
            console.log(err);
        }
    })


    //Listening to message on particular
    //personal chatId
    socket.on('personalChatMessage', async ({message, chatId}) => {
        console.log(message);
        console.log(chatId);
        io.to(chatId).emit('message', message)
    })


    //Listening to message on particular
    //roomId
    socket.on('sendRoomMessage', async ({message, roomId}) => {
        console.log(message, roomId);
     
        try{
         const updatedRoom = await sendRoomMessage({message, roomId});
            io.to(roomId).emit('message', message)
        }
        catch(err){
            console.log(err);
        }
        
    })


    //Fetch messages from room for user
    socket.on('fetchRoomMessages', async ({roomId}) => {
        
        console.log("inside fetch room messages ", roomId)
        socket.emit('fetchedRoomMessages');
        console.log("emitted");
        
    })


    //When user disconnects set status to 
    //offline and lastseen time
    socket.on('disconnect', async() => {
        console.log("Inside disconnect")
        //Set status to offline and last seen
        statusOfflineLastSeen({userId: userId});
        
        io.emit('message', formatMessage(botName,'A user has left the chat'))
        //end
    });
})


server.listen(PORT, "0.0.0.0", () => console.log(`Listening to socket server port ${PORT}`));