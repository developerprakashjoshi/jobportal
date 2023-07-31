import { Request, Response } from "express";

import ApplyService from '@services/apply.service'
import Controller from "@libs/controller";
import Server from "@libs/server"
export default class ApplyController extends Controller {

static async  count (req: Request, res: Response) {
    let applyService=new ApplyService();
    const result = await applyService.count("64bdd0a124bdfca23c8d9566")
    res.status(result.statusCode).json(result);
}
static async  countByUserId (req: Request, res: Response) {
  let id = req.params.id
  let applyService=new ApplyService();
  const result = await applyService.countByUserId(id)
  res.status(result.statusCode).json(result);
}
static async getApplys(req: Request, res: Response)  {
  let applyService=new ApplyService();
  const record = await applyService.list();
  res.status(record.statusCode).json(record);
}
static async updateCandidateStatus(req: Request, res: Response) {
  const id = req.params.id
  const data = req.body
  data.ip = await Server.remoteAddr(req)
  let jobService = new ApplyService();
  const result = await jobService.updateCandidateStatus(id, data)
  res.status(result.statusCode).json(result);
}
static async getUsersData(req: Request, res: Response) {
  let id = req.params.id
  let applyService =new ApplyService();
  const result = await applyService.getApplyData(id)
  res.status(result.statusCode).json(result);
}

static async getApply(req: Request, res: Response) {
  let id = req.params.id
  let applyService=new ApplyService();
  const records = await applyService.retrieve(id)
  res.status(records.statusCode).json(records);
}

static async createApply(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let applyService=new ApplyService();
    const result = await applyService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateApply(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let applyService=new ApplyService();
    const result = await applyService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteApply(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let applyService=new ApplyService();
    const result = await applyService.delete(id,data)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let applyService=new ApplyService();
    const records = await applyService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let applyService=new ApplyService();
    const results = await applyService.searchApplys(query);
    res.status(results.statusCode).json(results);
     
  }
}
