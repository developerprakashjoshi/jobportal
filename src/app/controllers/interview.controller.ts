import { Request, Response } from "express";

import InterviewService from '@services/interview.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class InterviewController extends Controller {

  static async count(req: Request, res: Response) {
    let interviewService = new InterviewService();
    const result = await interviewService.count()
    res.json(result)
  }

  static async getInterviews(req: Request, res: Response) {
    let interviewService = new InterviewService();
    const record = await interviewService.list()
    res.json(record);
  }

  static async getInterview(req: Request, res: Response) {
    let id = req.params.id
    let interviewService = new InterviewService();
    const records = await interviewService.retrieve(id)
    res.json(records)
  }

  static async getCompanyName(req: Request, res: Response) {
    let interviewService = new InterviewService();
    const record = await interviewService.listOfCandidate()
    res.status(record.statusCode).json(record);
  }

  static async createInterview(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let interviewService = new InterviewService();
    const result = await interviewService.create(data)
    res.json(result)
  }


  static async updateInterview(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let interviewService = new InterviewService();
    const result = await interviewService.update(id, data)
    res.json(result)
  }
  static async updateInterviewStaus(req: Request, res: Response) {
    const candidateId = req.params.candidateId
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let interviewService = new InterviewService();
    const result = await interviewService.updateApproval(candidateId, data)
    res.json(result)
  }

  static async deleteInterview(req: Request, res: Response) {
    let id = req.params.id
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let interviewService = new InterviewService();
    const result = await interviewService.delete(id, data)
    res.json(result)
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query;
    let interviewService = new InterviewService();
    const records = await interviewService.datatable(data)
    res.json(records)
  }
}
