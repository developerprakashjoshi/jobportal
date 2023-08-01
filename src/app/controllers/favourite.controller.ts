import { Request, Response } from "express";

import FavouriteService from '@services/favourite.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
export default class FavouriteController extends Controller {

static async  count (req: Request, res: Response) {
    const userId = req.params.userId;
    if(!userId){
      return res.status(400).json({ error: 'userId parameter is missing in the search.' });
    }
    let favouriteService=new FavouriteService();
    const result = await favouriteService.count(userId)
    res.status(result.statusCode).json(result);
}
static async getUsersData(req: Request, res: Response) {
  let userId = req.params.userId
  let favouriteService=new FavouriteService();
  const result = await favouriteService.getUserFav(userId)
  res.status(result.statusCode).json(result);
}
static async getFavourites(req: Request, res: Response)  {
  let favouriteService=new FavouriteService();
  const record = await favouriteService.list();
  res.status(record.statusCode).json(record);
}

static async getFavourite(req: Request, res: Response) {
  let id = req.params.id
  let favouriteService=new FavouriteService();
  const records = await favouriteService.retrieve(id)
  res.status(records.statusCode).json(records);
}

static async createFavourite(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let favouriteService=new FavouriteService();
    const result = await favouriteService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateFavourite(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let favouriteService=new FavouriteService();
    const result = await favouriteService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteFavourite(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let favouriteService=new FavouriteService();
    const result = await favouriteService.delete(id,true)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let favouriteService=new FavouriteService();
    const records = await favouriteService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let favouriteService=new FavouriteService();
    const results = await favouriteService.searchFavourites(query);
    res.status(results.statusCode).json(results);
     
  }
}
