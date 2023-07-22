import { Request, Response } from "express";

import RecruiterService from '@services/recruiter.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class RecruiterController extends Controller {

  static async count(req: Request, res: Response) {
    let recruiterService = new RecruiterService();
    const result = await recruiterService.count()
    res.status(result.statusCode).json(result);
  }

  static async getRecruiters(req: Request, res: Response) {
    let recruiterService = new RecruiterService();
    const record = await recruiterService.list()
    res.status(record.statusCode).json(record);
  }

  static async getRecruiter(req: Request, res: Response) {
    let id = req.params.id
    let recruiterService = new RecruiterService();
    const records = await recruiterService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async createRecruiter(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let recruiterService = new RecruiterService();
    const result = await recruiterService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateRecruiter(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let recruiterService = new RecruiterService();
    const result = await recruiterService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteRecruiter(req: Request, res: Response) {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let recruiterService = new RecruiterService();
    const result = await recruiterService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query;
    let recruiterService = new RecruiterService();
    const records = await recruiterService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
