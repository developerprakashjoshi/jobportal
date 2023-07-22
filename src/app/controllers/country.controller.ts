import { Request, Response } from "express";

import CountryService from '@services/country.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class CountryController extends Controller {

  static async count(req: Request, res: Response) {
    let countryService = new CountryService();
    const result = await countryService.count()
    res.status(result.statusCode).json(result)
  }

  static async getCountries(req: Request, res: Response) {
    let countryService = new CountryService();
    const record = await countryService.list()
    res.status(record.statusCode).json(record);
  }

  static async getCountry(req: Request, res: Response) {
    let id = req.params.id
    let countryService = new CountryService();
    const records = await countryService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async createCountry(req: Request, res: Response) {
    const data = req.body
    let countryService = new CountryService();
    data.ip = await Server.remoteAddr(req)
    const result = await countryService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateCountry(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let countryService = new CountryService();
    const result = await countryService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteCountry(req: Request, res: Response) {
    let id = req.params.id
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let countryService = new CountryService();
    const result = await countryService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query
    let countryService = new CountryService();
    const records = await countryService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
