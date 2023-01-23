const express = require('express');
const cors = require('cors');
const logger = require('morgan');


const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200']
    }
  });

const PORT = process.env.PORT || 5000;

require('./middlewares/mongoDB')
const messageModel = require('./models/message')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))


var room1 = ""
var room2 = ""
var room = ""
var data
async function findRoom(user1, user2){
  console.log(user1, "-----", user2);
  room1 = `${user1}-${user2}`;
  room2 = `${user2}-${user1}`;
  data =await messageModel.findOne({ $or: [ {room : room2}, { room: room1 } ] })
  console.log("db data ",data);
  if(data == null){
    console.log("empty");
    newRoom = new messageModel({room : room1, messages:[]});
    savedRoom =await newRoom.save();
    console.log("new  "  ,savedRoom.room);
    room = savedRoom
    data = savedRoom
    console.log(room);
  }else{
    room = data
    console.log("not empty" , room);
  }
}

io.on('connection', (socket)=>{
    console.log('A user connected',socket.id);
    socket.on('register',async (userDetails) => {
     
      // Create a unique room name
      console.log(userDetails);
      await findRoom(userDetails.sender, userDetails.recipient)
      // roomName = room
      // console.log("room name" , roomName);
      // const room = `${userDetails.sender}-${userDetails.recipient}`;

      // Join the room
      socket.join(room.room);
      console.log("room from old msg ",room);
      await io.to(room.room).emit('old_message',data.messages)
      console.log("re sending msg ", data.messages);
  }); 

  socket.on('send_message',async (msg) => {
      console.log("incoming message=> ",msg);

      // Create a unique room name
      // const room = `${msg.sender}-${msg.receiver}`;

      // Emit the message to the specific room
      console.log("send msg ", room.room);
      await io.to(room.room).emit('new_message', msg);
  });

    // socket.on('message',(data)=>{
    //   console.log(data)
    //   socket.emit('new',data)
    // })



  // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected'); 
    });
})




// redirect routes according to the url

const loginApi = require('./routes/loginApi')
app.use('/login', loginApi)

const signupApi = require('./routes/signupApi')
app.use('/signup', signupApi)

const chatApi = require('./routes/chatApi');
const { Socket } = require('dgram');
app.use('/user', chatApi)

http.listen(PORT, ()=>{
    console.log("Server is running on PORT",PORT);
})  
