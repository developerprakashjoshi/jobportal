import { Request, Response } from "express";

import CityService from '@services/city.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class CityController extends Controller {

  static async count(req: Request, res: Response) {
    let cityService = new CityService();
    const result = await cityService.count()
    res.status(result.statusCode).json(result);
  }

  static async getCityName(req: Request, res: Response) {

    let cityService = new CityService();
    let name = req.params.cityName;
    const result = await cityService.retrieveByCountry(name)
    res.status(result.statusCode).json(result);
  }

  static async getCities(req: Request, res: Response) {
    let cityService = new CityService();
    const record = await cityService.list()
    res.status(record.statusCode).json(record);
  }

  static async getCity(req: Request, res: Response) {
    let id = req.params.id
    let cityService = new CityService();
    const records = await cityService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async createCity(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let cityService = new CityService();
    const result = await cityService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateCity(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let cityService = new CityService();
    const result = await cityService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteCity(req: Request, res: Response) {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let cityService = new CityService();
    const result = await cityService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query;
    let cityService = new CityService();
    const records = await cityService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
