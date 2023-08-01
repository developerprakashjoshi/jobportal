import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Room from '@models/room.schema';
import Account from '@models/account.schema';
import Tweet,{ITweet} from '@models/tweet.schema';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export default class TweetService extends Service {
  private roomModel: any;
  constructor() {
    super()
    this.roomModel = AppDataSource.model('Room');
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
        const existingRoom = await Room.findOne({ name: roomName });
        if (existingRoom) {
        return new Response<any[]>(false, 409, "Room name already exists", undefined);
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
  
      // Push the tweet's _id to the Room's messages array
      room.messages.push(savedTweet._id);
      await room.save();
  
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