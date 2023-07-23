import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Jobs from "@models/job.schema";
import Apply from '@models/apply.schema';
import { ObjectId } from 'mongodb';


export default class JobService extends Service {
  private jobModel: any;
  private applyModel: any;
  constructor() {
    super()
    this.jobModel = Jobs;
    this.applyModel = Apply;
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.jobModel.countDocuments()
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.jobModel.find()
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

      const record = await this.jobModel.findById(pid);
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByJob(name: string) {
    try {
      const records = await this.jobModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any) {
    try {
      let jobs = new Jobs()
      jobs.user = data.userId
      jobs.title = data.title
      jobs.company = data.companyId
      jobs.reportToWork = data.reportToWork
      jobs.reportAddress = data.reportAddress
      jobs.jobType = data.jobType
      jobs.schedule = data.schedule
      jobs.isStartPlanned = data.isStartPlanned
      jobs.startDate = data.startDate
      jobs.payRange = data.payRange
      jobs.min = data.min
      jobs.max = data.max
      jobs.perMonth = data.perMonth
      jobs.supplementalPay = data.supplementalPay
      jobs.benefitsOffer = data.benefitsOffer
      jobs.description = data.description
      jobs.isCVRequired = data.isCVRequired
      jobs.isDeadlineApplicable = data.isDeadlineApplicable
      jobs.deadlineDate = data.deadlineDate
      jobs.noOfHiring = data.noOfHiring
      jobs.hiringSlot = data.hiringSlot
      jobs.aboutCompany = data.aboutCompany
      jobs.educationLevel = data.educationLevel
      jobs.yearOfExperience = data.yearOfExperience
      jobs.createdAt = new Date();
      jobs.createdBy = data.createdBy
      jobs.createdFrom = data.ip
      jobs.status=data.status

      const result:any = await jobs.save()
      console.log(result);
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
      const jobs = await this.jobModel.findById(pid);

      if (!jobs) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (data.reportToWork) {
        jobs.reportToWork = data.reportToWork
      }
      if (data.title) {
        jobs.title = data.title
      }
      if (data.reportAddress) {
        jobs.reportAddress = data.reportAddress
      }
      if (data.jobType) {
        jobs.jobType = data.jobType
      }
      if (data.schedule) {
        jobs.schedule = data.schedule
      }
      if (data.isStartPlanned) {
        jobs.isStartPlanned = data.isStartPlanned
      }
      if (data.startDate) {
        jobs.startDate = data.startDate
      }
      if (data.payRange) {
        jobs.payRange = data.payRange
      }
      if (data.min) {
        jobs.min = data.min
      }
      if (data.max) {
        jobs.max = data.max
      }
      if (data.perMonth) {
        jobs.perMonth = data.perMonth
      }
      if (data.supplementalPay) {
        jobs.supplementalPay = data.supplementalPay
      }
      if (data.benefitsOffer) {
        jobs.benefitsOffer = data.benefitsOffer
      }
      if (data.description) {
        jobs.description = data.description
      }
      if (data.isCVRequired) {
        jobs.isCVRequired = data.isCVRequired
      }
      if (data.isDeadlineApplicable) {
        jobs.isDeadlineApplicable = data.isDeadlineApplicable
      }
      if (data.deadlineDate) {
        jobs.deadlineDate = data.deadlineDate
      }
      if (data.noOfHiring) {
        jobs.noOfHiring = data.noOfHiring
      }
      if (data.hiringSlot) {
        jobs.hiringSlot = data.hiringSlot
      }

      if (data.aboutCompany) {
        jobs.aboutCompany = data.aboutCompany
      }
      if (data.educationLevel) {
        jobs.educationLevel = data.educationLevel
      }
      if (data.yearOfExperience) {
        jobs.yearOfExperience = data.yearOfExperience
      }
      if (data.userId) {
        jobs.user = data.userId
      }
      if (data.companyId) {
        jobs.company = data.companyId
      }
      jobs.updatedAt = new Date()
      jobs.updatedBy = data.updatedBy
      jobs.updatedFrom = data.ip
      const result = await jobs.save();

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
      const jobs = await this.jobModel.findById(pid);
      if (!jobs) {
        return new Response<any[]>(true, 404, "Jobs not found", jobs);
      }

      jobs.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      jobs.deleteBy = data.deleteBy;
      jobs.deleteFrom = data.ip;

      const result = await jobs.save(jobs);
      

      return new Response<any[]>(true, 200, "Delete operation successful", jobs);
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
            { title: { $regex: search, $options: 'i' } },
            { recruiterName: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
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
      const totalApplied = await this.applyModel.countDocuments();
      const [activeCount, inactiveCount] = await Promise.all([
        this.jobModel.countDocuments({ status: 1 }),
        this.jobModel.countDocuments({ status: 0 }),
      ]);
      const [records, totalCount] = await Promise.all([
        this.jobModel.aggregate([
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
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'company',
              foreignField: '_id',
              as: 'company',
            },
          },
          {
            $addFields: {
              recruiterName:{
                $concat: [
                  { $arrayElemAt: ['$user.firstName', 0] },
                  ' ',
                  { $arrayElemAt: ['$user.lastName', 0] }
                ]
              },
              companyName:{
                $arrayElemAt: ['$company.name', 0] 
              },
              createdOn:{
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y"
                }
              },
              totalApplied
            }
          },
          {
            $project: {
              _id: 1,
              report_address: 1,
              type: 1,
              title: 1,
              noOfHiring: 1,
              schedule: 1,
              startDate: 1,
              isDeadlineApplicable: 1,
              createdAt: 1,
              companyName: 1,
              recruiterName:1,
              status: 1,
              totalApplied:1,
              deadlineDate:1
            },
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$company',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).exec(),
        this.jobModel.countDocuments(searchQuery),
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
        activeStatus: activeCount,
        inactiveStatus: inactiveCount,
        totalApplicants: totalApplied

      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
}