import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Recruiter  from "@models/recruiter.schema";
import { ObjectId } from 'mongodb';

export default class CityService extends Service {
  private recruiteModel: any;
  constructor() {
    super()
    this.recruiteModel = AppDataSource.model('Recruiter');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.recruiteModel.countDocuments({ deleted_at: { $eq: null } })
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.recruiteModel.find()
      
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieve(pid: string) {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);

      const record = await this.recruiteModel.findById(pid);
      if (!record) {
        return new Response<any[]>(true, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByCountry(name: string) {
    try {
      const records = await this.recruiteModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let recruiter = new Recruiter()
      recruiter.firstName = data.firstName
      recruiter.LastName = data.LastName
      recruiter.email = data.email
      recruiter.password = data.password
      recruiter.confirmPassword = data.confirmPassword
      recruiter.phoneNumber = data.phoneNumber
      recruiter.companyName = data.companyName
      recruiter.employeeSize = data.employeeSize
      recruiter.selectIndustry = data.selectIndustry
      recruiter.yourDesignation = data.yourDesignation
      recruiter.isHiringManager = data.isHiringManager
      recruiter.createdAt = new Date();
      recruiter.createdBy = data.createdBy
      recruiter.createdFrom = data.ip
      const result:any = await recruiter.save()
      return new Response<any[]>(true, 201, "Insert operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async update(pid: string, data: any): Promise<Response<any[]>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);

      const recruiter = await this.recruiteModel.findById(pid);

      if (!recruiter) {
        return new Response<any[]>(false, 404, "Record not found");
      }

      if (data.firstName) {
        recruiter.firstName = data.firstName
      }
      if (data.LastName) {
        recruiter.LastName = data.LastName
      }
      if (data.email) {
        recruiter.email = data.email
      }
      if (data.password) {
        recruiter.password = data.password
      }
      if (data.confirmPassword) {
        recruiter.confirmPassword = data.confirmPassword
      }
      if (data.phoneNumber) {
        recruiter.phoneNumber = data.phoneNumber
      }
      if (data.companyName) {
        recruiter.companyName = data.companyName
      }
      if (data.employeeSize) {
        recruiter.employeeSize = data.employeeSize
      }
      if (data.selectIndustry) {
        recruiter.selectIndustry = data.selectIndustry
      }
      if (data.yourDesignation) {
        recruiter.yourDesignation = data.yourDesignation
      }
      if (data.isHiringManager) {
        recruiter.isHiringManager = data.isHiringManager
      }
      recruiter.updatedAt = new Date()
      recruiter.updatedBy = data.updatedBy
      recruiter.updatedFrom = data.ip
      const result = await recruiter.save();
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
      const city = await this.recruiteModel.findById(pid);
      if (!city) {
        return new Response<any[]>(true, 404, "City not found", city);
      }

      city.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      city.deleteBy = data.delete_by;
      city.deleteFrom = data.ip;

      const result = await city.save(city);
      return new Response<any[]>(true, 200, "Delete operation successful", city);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.city);
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
            { firstName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
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
        this.recruiteModel.find()
          .select({ 
            "firstName": 1,
            "LastName":1,
            "email":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.recruiteModel.countDocuments(searchQuery),
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