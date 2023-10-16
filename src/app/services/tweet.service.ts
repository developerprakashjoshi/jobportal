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
      console.log("Room") 
      console.log(room);
      // Save the tweet as a Tweet document
      const tweet = new Tweet({
        content,
        sender,
        room: roomId,
        read:false,
      });
      
      // Save the tweet in the database
      const savedTweet: any = await tweet.save();
      console.log("savedTweet")
      console.log(savedTweet)

      let recipientId;
      // Check if sender matches any participant and select the other element
      if (room.participants[0].equals(sender)) {
        recipientId = room.participants[1];
      } else if (room.participants[1].equals(sender)) {
        recipientId = room.participants[0];
      } else {
        return new Response<any[]>(true, 201, "Sender is not in the participants array.",[] );
      }

      let recipientName;
      // Check if sender matches any participant and select the other element
      if (room.participants[0].equals(sender)) {
        recipientName = room.participantsName[1];
      } else if (room.participants[1].equals(sender)) {
        recipientName = room.participantsName[0];
      } else {
        return new Response<any[]>(true, 201, "Sender is not in the participants array.",[] );
      }

      let notification = new Notification()
      notification.sender = sender
      notification.recipient = recipientId
      notification.commonUser=recipientId
      notification.content = `${recipientName}: ${content} at ${new Date()}`
      notification.type = "Message"
      notification.createdAt = new Date();
      notification.createdBy =sender
      notification.createdFrom = '127.0.0.1'
      const result:any = await notification.save()
      // Push the tweet's _id to the Room's messages array
      room.messages.push(savedTweet._id);
      await room.save();
      const recruiterReceiver = await this.recruiterModel.findById(recipientId);
      const userReceiver = await this.userModel.findById(recipientId);

      const recruiterSender = await this.recruiterModel.findById(sender);
      const userSender = await this.userModel.findById(sender);
    
      const firstNameSender= userSender!==null ? userSender.firstName:recruiterSender.firstName
      const lastNameSender= userSender!==null ? userSender.lastName:recruiterSender.LastName

      const emailReceiver=userReceiver!==null ? userReceiver.email:recruiterReceiver.email
      const firstNameReceiver= userReceiver!==null ? userReceiver.firstName:recruiterReceiver.firstName
      const lastNameReceiver= userReceiver!==null ? userReceiver.lastName:recruiterReceiver.LastName
      let from=process.env.EMAIL_FROM
      let to=emailReceiver
      let subject="New Message"
      let text=`Hi ${firstNameReceiver} ${lastNameReceiver},

      You've received a new message from a ${firstNameSender}. Check your inbox to continue the conversation.
      
      Regards,
      Simandhar Education
      `
 // ${firstNameSender} ${lastNameSender}
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
  async messageReadCount(pid:string):Promise<Response<any[]>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id=new ObjectId(pid);
      const rooms:any = await Room.find({'participants.0':pid}).populate('messages');
      
      let totalUnreadMessages = 0;
      for (const room of rooms) {
        // Check if the first participant's ID matches one of the room's participants
        if (room.participants[0]?.equals(pid)) {
          for (const message of room.messages) {
            if (message.read === false) {
              totalUnreadMessages++;
            }
          }
        }
        if (room.participants[1]?.equals(pid)) {
          for (const message of room.messages) {
            if (message.read === false) {
              totalUnreadMessages++;
            }
          }
        }
      }
      console.log(totalUnreadMessages);
      const output=[{count: totalUnreadMessages}]
      return new Response<any[]>(true, 200, "Messages read successfully", output);
    } catch (error:any) {
      console.error('Error fetching user rooms:', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };

  async messageReadUpdate(pid:string):Promise<Response<any[]>> {
      try {
        const isValidObjectId = ObjectId.isValid(pid);
        if (!isValidObjectId) {
          return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
        }
    
        let id = new ObjectId(pid);
        const rooms: any = await Room.find({ 'participants.0': pid }).populate('messages');
    
        let totalUnreadMessages = 0;
    
        for (const room of rooms) {
          // Check if the first participant's ID matches one of the room's participants
          if (room.participants[0]?.equals(pid)) {
            for (const message of room.messages) {
              if (message.read === false) {
                totalUnreadMessages++;
    
                // Update the message's read status to true
                await Tweet.updateOne({ _id: message._id }, { $set: { read: true } });
              }
            }
          }
          if (room.participants[1]?.equals(pid)) {
            for (const message of room.messages) {
              if (message.read === false) {
                totalUnreadMessages++;
    
                // Update the message's read status to true
                await Tweet.updateOne({ _id: message._id }, { $set: { read: true } });
              }
            }
          }
        }
        
        console.log(totalUnreadMessages);
        const output = [{ count: totalUnreadMessages }];
        return new Response<any[]>(true, 200, "Messages read successfully", output);
      } catch (error: any) {
        console.error('Error updating messages and fetching user rooms:', error);
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