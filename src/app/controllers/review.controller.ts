import { Request, Response } from "express";

import ReviewService from '@services/review.service'
import Controller from "@libs/controller";
import Server from "@libs/server";
import { ObjectId } from 'mongodb';

export default class ReviewController extends Controller {

  static async count(req: Request, res: Response) {
    let reviewService = new ReviewService();
    const result = await reviewService.count()
    res.status(result.statusCode).json(result);
  }

  static async getReviews(req: Request, res: Response) {
    let reviewService = new ReviewService();
    const record = await reviewService.list()
    res.status(record.statusCode).json(record);
  }

  static async getReview(req: Request, res: Response) {
    let id = req.params.id
    let reviewService = new ReviewService();
    const records = await reviewService.retrieve(id)
    res.status(records.statusCode).json(records);
  }

  static async createReview(req: Request, res: Response) {
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let reviewService = new ReviewService();
    const result = await reviewService.create(data)
    res.status(result.statusCode).json(result);
  }


  static async updateReview(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data.ip = await Server.remoteAddr(req)
    let reviewService = new ReviewService();
    const result = await reviewService.update(id, data)
    res.status(result.statusCode).json(result);
  }

  static async deleteReview(req: Request, res: Response) {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let reviewService = new ReviewService();
    const result = await reviewService.delete(id, data)
    res.status(result.statusCode).json(result);
  }

  static async datatable(req: Request, res: Response) {
    const data = req.query;
    let reviewService = new ReviewService();
    const records = await reviewService.datatable(data)
    res.status(records.statusCode).json(records);
  }
}
