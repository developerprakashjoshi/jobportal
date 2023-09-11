import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Room from '@models/room.schema';
import Account from '@models/account.schema';
import  Notification  from "@models/notification.schema";
import Tweet,{ITweet} from '@models/tweet.schema';
import User from "@models/user.schema";
import Recruiter from '@models/recruiter.schema';
import {Transporter} from "@config/mail";
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export default class TweetService extends Service {
  private roomModel: any;
  private notificationModel: any;
  private userModel: any;
  private recruiterModel: any;
  constructor() {
    super()
    this.roomModel = AppDataSource.model('Room');
    this.notificationModel = AppDataSource.model('Notification');
    this.userModel = User;
    this.recruiterModel = Recruiter;
  }

  async accountList(data:any):Promise<Response<any[]>> {
    const {type} = data;
    try {
        const account = await Account.find({ type });
        if (account) {
            return new Response<any[]>(false, 409, "Account not exisits", undefined);
        }
      return new Response<any[]>(true, 200, "Room created successfully", account);
    } catch (error:any) {
      console.error('Error creating room:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };
  async createRoom(data:any):Promise<Response<any[]>> {
    const { roomName, participants,participantsName,createdBy } = data;
    try {
        const existingRoom:any = await Room.findOne({ name: roomName }).populate('messages');
        if (existingRoom) {
        return new Response<any[]>(true, 200, "Room name already exists", existingRoom);
        }
        // const uniqueRoomName = `${uuidv4()}-${roomName}`;
        const room = new Room({
            name: roomName,
            participants,
            participantsName,
            createdBy,
        });
      const result:any = await room.save()
      return new Response<any[]>(true, 200, "Room created successfully", result);
      
    } catch (error:any) {
      console.error('Error creating room:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

  async sendMessage(data: any): Promise<Response<any[]>> {
    const { roomId, content, sender } = data;
  
    try {
      const room = await Room.findById(roomId);
  
      if (!room) {
        return new Response<any[]>(true, 200, "Room not found", undefined);
      }
  
      // Save the tweet as a Tweet document
      const tweet = new Tweet({
        content,
        sender,
        room: roomId,
      });
  
      // Save the tweet in the database
      const savedTweet: any = await tweet.save();
   
      let notification = new Notification()
      notification.sender = sender
      notification.recipient = room.participants[1]
      notification.commonUser=room.participants[1]
      notification.content = `${room.participantsName[1]}: ${content} at ${new Date()}`
      notification.type = "Message"
      notification.createdAt = new Date();
      notification.createdBy =sender
      notification.createdFrom = '127.0.0.1'
      const result:any = await notification.save()
      // Push the tweet's _id to the Room's messages array
      room.messages.push(savedTweet._id);
      await room.save();
      const recruiter = await this.recruiterModel.findById(sender);
      const user = await this.userModel.findById(sender);

      const email=user!==null ? user.email:recruiter.email
      const firstName= user!==null ? user.firstName:recruiter.firstName
      const lastName= user!==null ? user.lastName:recruiter.LastName
      let from=process.env.EMAIL_FROM
      let to=email
      let subject="New Message"
      let text=`Hi ${firstName} ${lastName},

      You've received a new message from a ${room.participantsName[1]}. Check your inbox to continue the conversation.
      
      Regards,
      ${firstName} ${lastName}
      `

      const message = {from,to,subject,text};
      const resultEmail = await Transporter.sendMail(message);

      // io.to(roomId).emit('message', message); // Emit the message to all connected clients in the room.
  
      return new Response<any[]>(true, 201, "Message sent successfully", savedTweet);
    } catch (error: any) {
      console.error('Error sending message:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

  async getRooms(pid:string):Promise<Response<any[]>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id=new ObjectId(pid);
      const rooms:any = await Room.findById(id).populate('messages');
      return new Response<any[]>(true, 200, "Messages read successfully", rooms);
    } catch (error:any) {
      console.error('Error fetching user rooms:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

  async getRoomsByName(name:string):Promise<Response<any[]>> {
    try {
      const regex = new RegExp(name, 'i');
      const rooms:any = await Room.find({ name: regex }).populate('messages');
      return new Response<any[]>(true, 200, "Messages read successfully", rooms);
    } catch (error:any) {
      console.error('Error fetching user rooms:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

  async getUserRooms(pid:string):Promise<Response<any[]>> {
    try {
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id=new ObjectId(pid);
      const rooms = await Room.find({ createdBy: id }).populate('participants', 'username');
      return new Response<any[]>(true, 200, "Messages read successfully", rooms);
    } catch (error:any) {
      console.error('Error fetching user rooms:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

}