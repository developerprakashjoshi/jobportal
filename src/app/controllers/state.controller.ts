import { Request, Response } from "express";

import StateService from '@services/state.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class StateController extends Controller {

  static async count(req: Request, res: Response) {
    let stateService = new StateService();
    const result = await stateService.count()
    res.status(result.statusCode).json(result);
  }

  static async getStateName(req: Request, res: Response) {

    let stateService = new StateService();
    let name = req.params.stateName;
    const record = await stateService.retrieveByState(name);
    res.status(record.statusCode).json(record);
  }

  static async getStates(req: Request, res: Response) {
    let stateService = new StateService();
    const record = await stateService.list()
    res.status(record.statusCode).json(record);
  }

  static async getState(req: Request, res: Response) {
    let id = req.params.id
    let stateService = new StateService();
    const records = await stateService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async createState(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let stateService = new StateService();
    const result = await stateService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateState(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let stateService = new StateService();
    const result = await stateService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteState(req: Request, res: Response) {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let stateService = new StateService();
    const result = await stateService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query
    let stateService = new StateService();
    const records = await stateService.datatable(data)
    res.status(records.statusCode).json(records);
  }



}
