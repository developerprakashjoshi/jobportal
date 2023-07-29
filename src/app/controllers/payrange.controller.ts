import { Request, Response } from "express";

import PayRangeService from '@services/payrange.service'
import Controller from "@libs/controller";
import Server from "@libs/server"
export default class PayRangeController extends Controller {

static async  count (req: Request, res: Response) {
    let payrangeService=new PayRangeService();
    const result = await payrangeService.count()
    res.status(result.statusCode).json(result);
}

static async getPayRanges(req: Request, res: Response)  {
  let payrangeService=new PayRangeService();
  const record = await payrangeService.list();
  res.status(record.statusCode).json(record);
}

static async getPayRange(req: Request, res: Response) {
  let id = req.params.id
  let payrangeService=new PayRangeService();
  const records = await payrangeService.retrieve(id)
  res.status(records.statusCode).json(records);
}

static async createPayRange(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let payrangeService=new PayRangeService();
    const result = await payrangeService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updatePayRange(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let payrangeService=new PayRangeService();
    const result = await payrangeService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deletePayRange(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let payrangeService=new PayRangeService();
    const result = await payrangeService.delete(id,data)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let payrangeService=new PayRangeService();
    const records = await payrangeService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let payrangeService=new PayRangeService();
    const results = await payrangeService.searchPayRanges(query);
    res.status(results.statusCode).json(results);
     
  }
}
