import { Request, Response } from "express";

import MessageService from '@services/message.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class AddressController extends Controller {

  static async count(req: Request, res: Response) {
    let messageService = new MessageService();
    const result = await messageService.count()
    res.status(result.statusCode).json(result);
  }

  static async getMessages(req: Request, res: Response) {
    let senderid = req.params.senderid
    let messageService = new MessageService();
    const record = await messageService.list(senderid)
    res.status(record.statusCode).json(record);
  }

  static async getMessage(req: Request, res: Response) {
    let senderid = req.params.senderid
    let recipientid = req.params.recipientid
    console.log(senderid)
    console.log("recipientid")
    console.log(recipientid)

    let messageService = new MessageService();
    const records = await messageService.retrieve(senderid,recipientid)
    res.status(records.statusCode).json(records);
  }

  static async createMessage(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let messageService = new MessageService();
    const result = await messageService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateMessages(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let messageService = new MessageService();
    const result = await messageService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteMessage(req: Request, res: Response) {
    let id = req.params.id
    let messageService = new MessageService();
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    const result = await messageService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query;
    let messageService = new MessageService();
    const records = await messageService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
