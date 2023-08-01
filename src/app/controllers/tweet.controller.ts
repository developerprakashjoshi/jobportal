import { Request, Response } from "express";
import TweetService from '@services/tweet.service'
import Controller from "@libs/controller";
export default class TweetController extends Controller {

static async  createRoom (req: Request, res: Response) {
    const data = req.body
    let tweetService=new TweetService();
    const result = await tweetService.createRoom(data)
    res.status(result.statusCode).json(result);
}

static async sendMessage(req: Request, res: Response)  {
    const data = req.body
    let tweetService=new TweetService();
    const result = await tweetService.sendMessage(data)
    res.status(result.statusCode).json(result);
}

static async getRooms(req: Request, res: Response) {
    let id = req.params.userId
    let tweetService=new TweetService();
    const result = await tweetService.getRooms(id)
    res.status(result.statusCode).json(result);
}
static async getRoomsByName(req: Request, res: Response) {
    let name = req.params.roomName
    let tweetService=new TweetService();
    const result = await tweetService.getRoomsByName(name)
    res.status(result.statusCode).json(result);
}
static async getUserRooms(req: Request, res: Response) {
    let id = req.params.userId
    let tweetService=new TweetService();
    const result = await tweetService.getUserRooms(id)
    res.status(result.statusCode).json(result);
}
static async getAccountByType(req: Request, res: Response) {
    const data = req.body
    let tweetService=new TweetService();
    const result = await tweetService.accountList(data)
    res.status(result.statusCode).json(result);
}
}
