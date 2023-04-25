import { Request, Response } from "express";

import RoleService from '../Services/RoleService'
import Controller from "../../libs/Controller";

export default class RoleController extends Controller {

static async  count (req: Request, res: Response) {
    let roleService=new RoleService();
    const result = await roleService.count()
    res.json(result)
}

static async getUsers(req: Request, res: Response)  {
  let roleService=new RoleService();
  const record = await roleService.list()
  res.json(record);
}

static async getUser(req: Request, res: Response) {
  let id = parseInt(req.params.id)
  let roleService=new RoleService();
  const records = await roleService.retrieve(id)
  res.json(records)
}

static async createUser(req: Request, res: Response) {
    const data=req.body
    let roleService=new RoleService();
    const result = await roleService.create(data)
    res.json(result)
}

static async deleteUser(req: Request, res: Response)  {
    let id = parseInt(req.params.id);
    let roleService=new RoleService();
    const result = await roleService.delete(id)
    res.json(result)
}

static  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data=req.body
    let roleService=new RoleService();
    const result = await roleService.update(id,data)
    res.json(result)
  }

static  async datatable(req: Request, res: Response) {
    let roleService=new RoleService();
    const records = await roleService.datatable()
    res.json(records)
  }
}
