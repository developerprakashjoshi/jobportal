import { Request, Response } from "express";

import NotificationService from '@services/notification.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class NotificationController extends Controller {

  static async count(req: Request, res: Response) {
    let notificationService = new NotificationService();
    const result = await notificationService.count()
    res.status(result.statusCode).json(result);
  }

  static async getNotifications(req: Request, res: Response) {
    let notificationService = new NotificationService();
    const record = await notificationService.list()
    res.status(record.statusCode).json(record);
  }

  static async getNotification(req: Request, res: Response) {
    let id = req.params.id
    let notificationService = new NotificationService();
    const records = await notificationService.retrieve(id)
    res.status(records.statusCode).json(records);
  }
  static async getMyNotification(req: Request, res: Response) {
    let id = req.params.id
    let notificationService = new NotificationService();
    const records = await notificationService.retrieveMyNotification(id)
    res.status(records.statusCode).json(records);
  }

  static async createNotification(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let notificationService = new NotificationService();
    const result = await notificationService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateNotification(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let notificationService = new NotificationService();
    const result = await notificationService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteNotification(req: Request, res: Response) {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let notificationService = new NotificationService();
    const result = await notificationService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async countUnread(req: Request, res: Response) {
    let id = req.params.id;
    let notificationService = new NotificationService();
    const result = await notificationService.countUnread(id)
    res.status(result.statusCode).json(result);
  }
  static async updateUnread(req: Request, res: Response) {
    let id = req.params.id;
    let notificationService = new NotificationService();
    const result = await notificationService.updateUnread(id)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query
    let addressService = new NotificationService();
    const records = await addressService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
