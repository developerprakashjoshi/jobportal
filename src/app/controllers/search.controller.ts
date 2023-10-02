import { Request, Response } from "express";

import SearchService from '@services/search.service'
import Controller from "@libs/controller";
export default class SearchController extends Controller {

static async  count (req: Request, res: Response) {
    let searchService=new SearchService();
    const result = await searchService.count()
    res.status(result.statusCode).json(result);
}

static async getSearchs(req: Request, res: Response)  {
  let searchService=new SearchService();
  const record = await searchService.list();
  res.status(record.statusCode).json(record);
}

static async getSearch(req: Request, res: Response) {
  let id = req.params.id
  let searchService=new SearchService();
  const records = await searchService.retrieve(id)
  res.status(records.statusCode).json(records);
}

static async createSearch(req: Request, res: Response) {
    const data=req.body
    let searchService=new SearchService();
    const result = await searchService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateSearch(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    let searchService=new SearchService();
    const result = await searchService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteSearch(req: Request, res: Response)  {
    let id = req.params.id;
    let searchService=new SearchService();
    const result = await searchService.delete(id)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let searchService=new SearchService();
    const records = await searchService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let searchService=new SearchService();
    const results = await searchService.searchSearchs(query);
    res.status(results.statusCode).json(results);
     
  }
}
