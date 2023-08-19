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
  static async forgotPassword(req: Request, res: Response) {
    const {email,redirectUrl}=req.body
    let recruiterService=new RecruiterService();
    const result = await recruiterService.forgotPassword(email,redirectUrl)
    res.status(result.statusCode).json(result);
  }

  static async emailOTP(req: Request, res: Response) {
    const {email}=req.body
    let recruiterService=new RecruiterService();
    const result = await recruiterService.sendEmailOTP(email)
    res.status(result.statusCode).json(result);
  }

  static async getRecruiters(req: Request, res: Response) {
    let recruiterService = new RecruiterService();
    const record = await recruiterService.list()
    res.status(record.statusCode).json(record);
  }

  static async getCompanyName(req: Request, res: Response) {
    let recruiterService = new RecruiterService();
    const record = await recruiterService.listCompanyName()
    res.status(record.statusCode).json(record);
  }

  static async getRecruiter(req: Request, res: Response) {
    let id = req.params.id
    let recruiterService = new RecruiterService();
    const records = await recruiterService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async getChatUser(req: Request, res: Response) {
    let id = req.params.id
    let recruiterService = new RecruiterService();
    const records = await recruiterService.listUsersByJobUser(id)
    res.status(records.statusCode).json(records);
  }

  
  static async createRecruiter(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let recruiterService = new RecruiterService();
    const result = await recruiterService.create(data)
    res.status(result.statusCode).json(result);
  }

  static async login(req: Request, res: Response) {
    const {email,password}=req.body
    let recruiterService = new RecruiterService();
    const result = await recruiterService.retrieveRecruiterByEmailandPassword(email,password)
    res.status(result.statusCode).json(result);
  }

  static async updatePassword(req: Request, res: Response) {
    const {id,password}=req.body
    let userService=new RecruiterService();
    const result = await userService.updatePassword(password,id)
    res.status(result.statusCode).json(result);
  }

  static async updatePhoneVerify(req: Request, res: Response) {
    const {id,isPasswordVerify}=req.body
    let userService=new RecruiterService();
    const result = await userService.updatePhoneVerify(isPasswordVerify,id)
    res.status(result.statusCode).json(result);
  }
  static async updateEmailVerify(req: Request, res: Response) {
    const {id,isEmailVerify}=req.body
    let userService=new RecruiterService();
    const result = await userService.updatePhoneVerify(isEmailVerify,id)
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
