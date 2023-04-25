import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

import PermissionService from '../Services/PermissionService'
import Controller from "../../libs/Controller";

export default class PermissionController extends Controller {

static async  count (req: Request, res: Response) {
    let permissionService=new PermissionService();
    const result = await permissionService.count()
    res.json(result)
}

static async getUsers(req: Request, res: Response)  {
  let permissionService=new PermissionService();
  const record = await permissionService.list()
  res.json(record);
}

static async getUser(req: Request, res: Response) {
  let id = parseInt(req.params.id)
  let permissionService=new PermissionService();
  const records = await permissionService.retrieve(id)
  res.json(records)
}

static async createUser(req: Request, res: Response) {
    const data=req.body
    let permissionService=new PermissionService();
    const result = await permissionService.create(data)
    res.json(result)
}

static async deleteUser(req: Request, res: Response)  {
    let id = parseInt(req.params.id);
    let permissionService=new PermissionService();
    const result = await permissionService.delete(id)
    res.json(result)
}

static  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data=req.body
    let permissionService=new PermissionService();
    const result = await permissionService.update(id,data)
    res.json(result)
  }

static  async datatable(req: Request, res: Response) {
    let permissionService=new PermissionService();
    const records = await permissionService.datatable()
    res.json(records)
  }
}
