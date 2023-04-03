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
} = require('./utils/socket/axiosReqMethods');
const { welcomeMessage } = require('./utils/socket/socketFunctions');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
const botName = "bot";

const PORT = 3000 || process.env.PORT;



io.on('connection', socket => {

    const user = socket.handshake.query;

    //Set status to online
    socket.on('setOnline', async () => {
        try{
            const updatedData = await statusOnlineSetRequest({userId: user.userId});
        }
        catch(err){
            console.log(err);
        }
    })


    //Join socket of room after validating 
    //if user exists
    socket.on('enterRoom', async ({roomId}) => {

        try{
            const isMember = await checkMemberOfRoom({userId: user.userId, roomId});
            console.log(isMember);
            if(isMember){
                socket.join(roomId);
                console.log("Joined socket of room")
            }
        }
        catch(err){
            console.log(err);
        }
    
    })


    //Join socket of personal chat after
    //validating if user exist
    socket.on('startChat', async ({chatId}) => {
        try{
            const isMember = await checkMemberOfChat({userId: user.userId, chatId});
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
    socket.on('roomMessage', ({message, roomId}) => {
        console.log(message);
        console.log(roomId);
        io.to(roomId).emit('message', message)
    })


    //When user disconnects set status to 
    //offline and lastseen time
    socket.on('disconnect', async() => {
        //Set status to offline and last seen
        const updatedData = statusOfflineLastSeen({userId: user.userId});
        console.log(updatedData);
        io.emit('message', formatMessage(botName,'A user has left the chat'))
        //end
    });
})


server.listen(PORT, "0.0.0.0", () => console.log(`Listening to socket server port ${PORT}`));