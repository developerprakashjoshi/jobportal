import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import  Interview  from "@models/interview.schema";
import { ObjectId } from 'mongodb';

export default class InterviewService extends Service {
  private interviewModel: any;
  constructor() {
    super()
    this.interviewModel = AppDataSource.model('Interview');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.interviewModel.countDocuments()
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.interviewModel.find()
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieve(pid: string): Promise<Response<any[]>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const record = await this.interviewModel.findById(pid);
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByinterview(name: string) {
    try {
      const records = await this.interviewModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let interview = new Interview()

      interview.candidateName = data.candidateName
      interview.interviewDate = data.interviewDate
      interview.interviewTime = data.interviewTime
      interview.interviewLink = data.interviewLink
      interview.description = data.description
      interview.createdAt = new Date();
      interview.createdBy = data.createdBy
      interview.createdFrom = data.ip
      const result:any = await interview.save()
      return new Response<any[]>(true, 201, "Insert operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async update(pid: string, data: any) {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const interview = await this.interviewModel.findById(pid);

      if (!interview) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (data.candidateName) {
        interview.candidateName = data.candidateName
      }
      if (data.interviewDate) {
        interview.interviewDate = data.interviewDate
      }
      if (data.interviewTime) {
        interview.interviewTime = data.interviewTime
      }
      if (data.interviewLink) {
        interview.interviewLink = data.interviewLink
      }
      if (data.description) {
        interview.description = data.description
      }

      interview.updatedAt = new Date()
      interview.updatedBy = data.updatedBy
      interview.updatedFrom = data.ip
      const result = await interview.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async delete(pid: string, data: any) {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const interview = await this.interviewModel.findById(pid);
      if (!interview) {
        return new Response<any[]>(true, 404, "Interview not found", interview);
      }

      interview.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      interview.deleteBy = data.deleteBy;
      interview.deleteFrom = data.ip

      await interview.save(interview);

      return new Response<any[]>(true, 200, "Delete operation successful", interview);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort } = data;
      let errorMessage = '';

      if (page !== undefined && limit !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "Both 'page' and 'limit' must be integers.";
        }
      } else if (page !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page))) {
          errorMessage = "'page' must be an integer.";
        }
      } else if (limit !== undefined) {
        if (isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "'limit' must be an integer.";
        }
      }

      if (errorMessage) {
        return new Response<any>(false, 400, errorMessage);
      }

      let searchQuery = {};
      if (search !== undefined) {
        searchQuery = {
          $or: [
            { candidateName:  { $regex: search, $options: 'i' } },
            { interviewDate: { $regex: search, $options: 'i' } },
          ],
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.interviewModel.find()
          .select({ 
            "candidateName": 1,
            "interviewDate":1,
            "interviewTime":1,
            "interviewLink":1,
            "description":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.interviewModel.countDocuments(searchQuery),
      ]);
      
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
}