import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../userService/chat.service';
import { SocketioService } from '../userService/socketio.service';
import { io } from 'socket.io-client';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  onlineStatus = "online"
  receiver: any = []         // to receive data coming from backend
  userName = ""
  msg =
    {
      msg: "",
      sender: localStorage.getItem('user'),
      receiver: ""
    }



  messages: any = []         // array to store messages coming from backend
  newMessage = '';           // variable to store new messages when send button clicked

  socket = io('http://localhost:5000')

  userDetails = {
    sender: localStorage.getItem('user'),
    recipient: ""
  }

  constructor(private activeRoute: ActivatedRoute, private chatService: ChatService, 
    private router: Router, private socketioService: SocketioService,
    private snackBar: MatSnackBar) { }



  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.socket.disconnect()
      let id = params.id
      this.chatService.singleUser(id).subscribe(res => {
        this.receiver = res
        this.receiver = this.receiver[0]
        this.userName = this.receiver.userName
        this.socket = io('http://localhost:5000')
        this.messages = []
    
        this.userDetails.recipient = this.userName
        this.socket.emit('register', this.userDetails);
        this.socket.on('old_message', (oldMsg) => {       
          console.log("from backend ",oldMsg);
          this.messages = oldMsg

        })
        // Listen for messages
        this.socket.on('new_message', (message) => {
          this.openSnackBar()
          this.messages.push(message)
          console.log(this.messages);
        });
      })

    })


  }



  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }



  sendMsg() {
 
    if(this.newMessage != ""){
      this.msg.msg = this.newMessage
      this.msg.receiver = this.userName
      this.socket.emit('send_message', this.msg );
      this.newMessage = '' 
    }
    

  }

  openSnackBar() {
    this.snackBar.open('Cannonball!!', 'Splash', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });console.log("notification");
    
  }

}
