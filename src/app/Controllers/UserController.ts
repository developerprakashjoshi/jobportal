import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

import UserService from '../Services/UserService'
import Controller from "../../libs/Controller";

export default class UserController extends Controller {

static async  count (req: Request, res: Response) {
    let userService=new UserService();
    const result = await userService.count()
    res.json(result)
}

static async getUsers(req: Request, res: Response)  {
  let userService=new UserService();
  const record = await userService.list()
  res.json(record);
}

static async getUser(req: Request, res: Response) {
  let id = parseInt(req.params.id)
  let userService=new UserService();
  const records = await userService.retrieve(id)
  res.json(records)
}

static async createUser(req: Request, res: Response) {
    const data=req.body
    let userService=new UserService();
    const result = await userService.create(data)
    res.json(result)
}

static async deleteUser(req: Request, res: Response)  {
    let id = parseInt(req.params.id);
    let userService=new UserService();
    const result = await userService.delete(id)
    res.json(result)
}

static  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data=req.body
    let userService=new UserService();
    const result = await userService.update(id,data)
    res.json(result)
  }

static  async datatable(req: Request, res: Response) {
    let userService=new UserService();
    const records = await userService.datatable()
    res.json(records)
  }
}
