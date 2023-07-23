import { Request, Response } from "express";

import ChatService from '@services/chat.service'
import Controller from "@libs/controller";
import Server from "@libs/server"
export default class ChatController extends Controller {

static async  count (req: Request, res: Response) {
    let chatService=new ChatService();
    const result = await chatService.count()
    res.status(result.statusCode).json(result);
}

static async getChats(req: Request, res: Response)  {
  let userId = req.params.userId
  let chatService=new ChatService();
  const record = await chatService.list(userId);
  res.status(record.statusCode).json(record);
}

static async getChat(req: Request, res: Response) {
  let firstId = req.params.firstId
  let secondId = req.params.secondId
  let chatService=new ChatService();
  const records = await chatService.retrieve(firstId,secondId)
  res.status(records.statusCode).json(records);
}

static async createChat(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let chatService=new ChatService();
    const result = await chatService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateChat(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let chatService=new ChatService();
    const result = await chatService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteChat(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let chatService=new ChatService();
    const result = await chatService.delete(id,data)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let chatService=new ChatService();
    const records = await chatService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let chatService=new ChatService();
    const results = await chatService.searchChats(query);
    res.status(results.statusCode).json(results);
     
  }
}
