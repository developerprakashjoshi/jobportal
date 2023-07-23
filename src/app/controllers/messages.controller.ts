import { Request, Response } from "express";

import MessagesService from '@services/messages.service'
import Controller from "@libs/controller";
import Server from "@libs/server"
export default class MessagesController extends Controller {

static async  count (req: Request, res: Response) {
    let messagesService=new MessagesService();
    const result = await messagesService.count()
    res.status(result.statusCode).json(result);
}

static async getMessage(req: Request, res: Response)  {
  let messagesService=new MessagesService();
  const record = await messagesService.list();
  res.status(record.statusCode).json(record);
}

static async getMessages(req: Request, res: Response) {
  let chatId = req.params.chatId
  let messagesService=new MessagesService();
  const records = await messagesService.retrieve(chatId)
  res.status(records.statusCode).json(records);
}

static async createMessages(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let messagesService=new MessagesService();
    const result = await messagesService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateMessages(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let messagesService=new MessagesService();
    const result = await messagesService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteMessages(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let messagesService=new MessagesService();
    const result = await messagesService.delete(id,data)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let messagesService=new MessagesService();
    const records = await messagesService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let messagesService=new MessagesService();
    const results = await messagesService.searchMessagess(query);
    res.status(results.statusCode).json(results);
     
  }
}
