import { Request, Response } from "express";
import Server from "@libs/server";
import CourseService from '@services/course.service'
import Controller from "@libs/controller";
export default class CourseController extends Controller {

static async  count (req: Request, res: Response) {
    let courseService=new CourseService();
    const result = await courseService.count()
    res.status(result.statusCode).json(result);
}

static async getCourses(req: Request, res: Response)  {
  let courseService=new CourseService();
  const record = await courseService.list();
  res.status(record.statusCode).json(record);
}

static async getCourse(req: Request, res: Response) {
  let id = req.params.id
  let courseService=new CourseService();
  const records = await courseService.retrieve(id)
  res.status(records.statusCode).json(records);
}

static async createCourse(req: Request, res: Response) {
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let courseService=new CourseService();
    const result = await courseService.create(data)
    res.status(result.statusCode).json(result);
}


static  async updateCourse(req: Request, res: Response) {
    const id =req.params.id;
    const data=req.body
    data.ip = await Server.remoteAddr(req)
    let courseService=new CourseService();
    const result = await courseService.update(id,data)
    res.status(result.statusCode).json(result);
  }

static async deleteCourse(req: Request, res: Response)  {
    let id = req.params.id;
    const data = req.body;
    data.ip = await Server.remoteAddr(req)
    let courseService=new CourseService();
    const result = await courseService.delete(id,data)
    res.status(result.statusCode).json(result);
}

static  async datatable(req: Request, res: Response) {
    const data = req.query;
    let courseService=new CourseService();
    const records = await courseService.datatable(data)
    res.status(records.statusCode).json(records);
  }

    static async search(req: Request, res: Response) {
    const query = req.query.q;
    let courseService=new CourseService();
    const results = await courseService.searchCourses(query);
    res.status(results.statusCode).json(results);
     
  }
}
