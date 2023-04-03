const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { userId, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket =io.connect('http://localhost:3000', {
  query: {
    userId: "63df5afd61cf376cb318c141",
    userName: 'Vicky'
  }
});

//change status
socket.emit('setOnline', {chatId: "63e793833196daef5eea1c93"});

// Join chatroom
//socket.emit('joinRoom', { username, room });
//socket.emit('enterRoom', { roomId:room });
socket.emit('startChat', {chatId: "63e793833196daef5eea1c93"})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log("Trigerred")
  console.log(message);
  //outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
 // let msg = e.target.elements.msg.value;

  //msg = msg.trim();

  let msg = {
    "type": "text",
    "content": "New message2 !",
    "sentBy": "63df5afd61cf376cb318c141",
    "sentTo": "63e0ef189acc26c31313dd90",
    "_id": "63ebc930c5ac3a5941e21bee",
    "replies": [],
    "createdAt": "2023-02-14T17:47:28.582Z",
    "updatedAt": "2023-02-14T17:47:28.582Z",
    "__v": 0
}

  if (!msg) {
    return false;
  }

  //console.log(msg);
  // Emit message to server
  //socket.emit('roomMessage', {message: msg, roomId:room});


  socket.emit('personalChatMessage', {message, chatId: "63e793833196daef5eea1c93"});

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});