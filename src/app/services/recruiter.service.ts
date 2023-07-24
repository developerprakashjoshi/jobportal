import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Recruiter  from "@models/recruiter.schema";
import Apply from '@models/apply.schema';
import Company  from "@models/company.schema";
import Jobs  from "@models/job.schema";

import { ObjectId } from 'mongodb';

export default class RecruiterService extends Service {
  private recruiteModel: any;
  private companyModel: any;
  private jobModel: any;
  private applyModel: any;
  constructor() {
    super()
    this.recruiteModel = AppDataSource.model('Recruiter');
    this.companyModel = AppDataSource.model('Company');
    this.jobModel = AppDataSource.model('Jobs');
    this.applyModel = AppDataSource.model('Apply');
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
      const record = await this.recruiteModel.find({deletedAt: null})
      
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
  
  async listCompanyName(): Promise<Response<any[]>> {
    try {
      // const record = await this.companyModel.find().limit(10).populate({path: 'company', select: 'name'})
      const records:any = await this.companyModel.find().limit(10).select('name');
      // const companyNames = records.map((record:any) => record.name);

      
      return new Response<any[]>(true, 200, "Read operation successful", records);
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
      

      
      const existEmail = await this.recruiteModel.findOne({ email: data.email });

      if(existEmail) {
      return new Response<any[]>(false, 409, "Email name already exists");
      }

      const existPhone = await this.recruiteModel.findOne({ phoneNumber: data.phoneNumber });

      if(existPhone) {
      return new Response<any[]>(false, 409, "Phone number name already exists");
      }

      let recruiter = new Recruiter()
      recruiter.firstName = data.firstName
      recruiter.LastName = data.LastName
      recruiter.email = data.email
      recruiter.password = data.password
      recruiter.phoneNumber = data.phoneNumber
      recruiter.companyName = data.companyName
      recruiter.employeeSize = data.employeeSize
      recruiter.selectIndustry = data.selectIndustry
      recruiter.yourDesignation = data.yourDesignation
      recruiter.termConditions = data.termConditions
      recruiter.companyLocation = data.companyLocation
      recruiter.isHiringManager = data.isHiringManager
      recruiter.status = data.status
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
      if (data.termConditions) {
        recruiter.termConditions = data.termConditions
      }
      if (data.companyLocation) {
        recruiter.companyLocation = data.companyLocation
      }
      if (data.isHiringManager) {
        recruiter.isHiringManager = data.isHiringManager
      }
      if (data.status) {
        recruiter.status = data.status
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
            { companyName: { $regex: search, $options: 'i' } },
            { yourDesignation: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
        };
      }
  
      let sortQuery = {};
      if (sort !== undefined ) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      }else{
        sortQuery = {createdAt:-1}
      }
      console.log("----");
      console.log(sortQuery);
  
      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const totalApplied = await this.applyModel.countDocuments();
      const totalJobPost = await  this.jobModel.countDocuments();
      const [records, totalCount] = await Promise.all([
        this.recruiteModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                { deletedAt: null } // Filter out documents where deletedAt is not null
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              "firstName": 1,
              "LastName":1,
              "email":1,
              "companyName":1,
              "yourDesignation":1,
              'phoneNumber':1,
              'totalJobPosted':1,
              'totalApplied':1,
              'createdAt':1
            },
          },
          {
            $unwind: {
              path: '$company',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).exec(),
        this.recruiteModel.countDocuments(searchQuery),
      ]);
  
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }
  
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const dataCount:any = records.map(async(row:any)=>{
        console.log(row._id);
         return await this.countJob(row._id)
      })
      const userIds = records.map((record:any) => record._id.toString());
        const totalJobPosted = await Promise.all(userIds.map((_id:string) => this.countJob(_id)));
        records.forEach((record:any, index:number) => {
          record.totalJobPost = totalJobPosted[index];
        });

      const jobIds = records.map((record:any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(jobIds.map((_id:string) => this.countApply(_id)));
      records.forEach((record:any, index:number) => {
      record.totalApplied = totalAppliedCounts[index];
      }); 

      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
        totalJobs: totalJobPost,
        totalApplicants: totalApplied,

      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async countJob(userId:string){
    try {
      const result = await this.jobModel.countDocuments({deleteAt:null,user: new ObjectId(userId)})
      return result;
    } catch (error: any) {
      return error.message;
    }
  }

  async countApply(jobId:string) {
    try {
      const result = await this.applyModel.countDocuments({ job: new ObjectId(jobId) });
      return result
    } catch (error: any) {
      return error.message;
    }
  }

}