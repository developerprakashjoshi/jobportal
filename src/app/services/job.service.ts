import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Jobs from "@models/job.schema";
import User from "@models/user.schema";
import Apply from '@models/apply.schema';
import Recruiter from '@models/recruiter.schema';
import Company from "@models/company.schema";
import { ObjectId } from 'mongodb';

export default class JobService extends Service {
  private jobModel: any;
  private applyModel: any;
  private userModel: any;
  private recruiterModel: any;
  private companyModel: any;
  constructor() {
    super()
    this.jobModel = Jobs;
    this.applyModel = Apply;
    this.userModel = User;
    this.recruiterModel = Recruiter;
    this.companyModel = Company;
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.jobModel.countDocuments({ deletedAt: null })
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any>> {
    try {
      const records = await this.jobModel.find({ deletedAt: null }).populate('company', 'logo name');
      
      const totalApplied = await this.applyModel.countDocuments();
      
      const output = {
        totalApplicants: totalApplied,
        records: records, 
      };
      
      const response = new Response<any>(true, 200, 'Read operation successful', output);
      return response;
    } catch (error: any) {
      return new Response<any>(false, 400, error.message);
    }
  }
  

    async retrieve(pid: string): Promise<Response<any[]>> {
      try {
        const isValidObjectId = ObjectId.isValid(pid);
        if (!isValidObjectId) {
          return new Response<any[]>(false, 400, "Invalid ObjectId");
        }
    
        const record = await this.jobModel.findById(pid);
        if (!record) {
          return new Response<any[]>(false, 404, "Record not found");
        }
    
        const totalAppliedCount = await this.countApply(pid);
        let output = record.toObject()
        output.totalAppliedCount = totalAppliedCount
        return new Response<any[]>(true, 200, "Read operation successful", output);
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
      console.log(data);
      let jobs = new Jobs()
      jobs.recruiter = data.userId
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
      jobs.status = data.status,
        jobs.approveAdmin = false

      const result: any = await jobs.save()
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
        jobs.recruiter = data.userId
      }
      if (data.companyId) {
        jobs.company = data.companyId
      }
      if (data.status) {
        jobs.status = data.status
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

  async updateApproval(pid: string, data: any) {
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

      if (typeof data.approveAdmin === "boolean") {
        jobs.approveAdmin = data.approveAdmin
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

  async updateJob(pid: string, data: any) {
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

      if (data.status) {
        jobs.status = data.status
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

  async search(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort ,jobType,datePosted, payRange,salaryEstimates } = data;
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


      let searchQuery:any = {};
      if (search !== undefined) {
        //For getting recruiterName from user 
        const matchingUsers = await this.recruiterModel.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { LastName: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        const matchingUserIds = matchingUsers.map((recruiter: any) => recruiter._id);
        //For getting companyName from company
        const matchingCompany = await this.companyModel.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        const companyIds:any = matchingCompany.map((company: any) => company._id);
        //end
        if (jobType !== undefined) {
          searchQuery.$and= [
            { jobType: { $regex: jobType, $options: 'i' } },
            {
              $or: [
                { recruiter: { $in: matchingUserIds } },
                { company: { $in: companyIds } },
                { title: { $regex: search, $options: 'i' } },
                { reportAddress: { $regex: search, $options: 'i' } },
                { schedule: { $regex: search, $options: 'i' } },
                { startDate: { $regex: search, $options: 'i' } },
                { payRange: { $regex: search, $options: 'i' } },
                { min: { $regex: search, $options: 'i' } },
                { max: { $regex: search, $options: 'i' } },
                { perMonth: { $regex: search, $options: 'i' } },
                { supplementalPay: { $regex: search, $options: 'i' } },
                { benefitsOffer: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { isCVRequired: { $regex: search, $options: 'i' } },
                { isDeadlineApplicable: { $regex: search, $options: 'i' } },
                { deadlineDate: { $regex: search, $options: 'i' } },
                { noOfHiring: { $regex: search, $options: 'i' } },
                { hiringSlot: { $regex: search, $options: 'i' } },
                { aboutCompany: { $regex: search, $options: 'i' } },
                { educationLevel: { $regex: search, $options: 'i' } },
                { yearOfExperience: { $regex: search, $options: 'i' } },
                { createdAt: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } },
                { createdFrom: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { approveAdmin: { $regex: search, $options: 'i' } },
                { updatedAt: { $regex: search, $options: 'i' } },
              ],
            }
          ]
          if (datePosted === 'Today') {
            console.log("date")
            const today = new Date();
            const startOfToday = new Date(today);
            startOfToday.setHours(0, 0, 0, 0);
            searchQuery.$and.push({
              createdAt: {
                $gte: startOfToday,
                $lt: today,
              }
            });
          }
          //this week
          if (datePosted === 'This Week') {
            console.log("This Week");
            const today = new Date();
            const startOfThisWeek = new Date(today);
            startOfThisWeek.setDate(today.getDate() - today.getDay()); // Go back to the first day of the week (Sunday).
            startOfThisWeek.setHours(0, 0, 0, 0);
            const endOfThisWeek = new Date(startOfThisWeek);
            endOfThisWeek.setDate(startOfThisWeek.getDate() + 7); // Go forward to the last day of the week (Saturday).
            searchQuery.$and.push({
              createdAt: {
                $gte: startOfThisWeek,
                $lt: today,
              }
            });
          }
          
          if (datePosted === 'This Month') {
            console.log("This Month");
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            searchQuery.$and.push({
              createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              }
            });
          }

          if (datePosted === 'This Year') {
            console.log("This Year");
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date(today.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);

            searchQuery.$and.push({
              createdAt: {
                $gte: startOfYear,
                $lt: endOfYear,
              }
            });
          }
          if (payRange !== undefined ) {
            console.log("Pay Range");
            // searchQuery.$and.push({ payRange: { $regex: payRange, $options: 'i' } });
            searchQuery.$and=[{ payRange: { $regex: payRange, $options: 'i' } }];
          }
         
        }else{
          searchQuery = {
            $or: [
              { recruiter: { $in: matchingUserIds } },
              { company: { $in: companyIds } },
              { title: { $regex: search, $options: 'i' } },
              { reportAddress: { $regex: search, $options: 'i' } },
              { schedule: { $regex: search, $options: 'i' } },
              { startDate: { $regex: search, $options: 'i' } },
              { min: { $regex: search, $options: 'i' } },
              { max: { $regex: search, $options: 'i' } },
              { perMonth: { $regex: search, $options: 'i' } },
              { supplementalPay: { $regex: search, $options: 'i' } },
              { benefitsOffer: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { isCVRequired: { $regex: search, $options: 'i' } },
              { isDeadlineApplicable: { $regex: search, $options: 'i' } },
              { deadlineDate: { $regex: search, $options: 'i' } },
              { noOfHiring: { $regex: search, $options: 'i' } },
              { hiringSlot: { $regex: search, $options: 'i' } },
              { aboutCompany: { $regex: search, $options: 'i' } },
              { educationLevel: { $regex: search, $options: 'i' } },
              { yearOfExperience: { $regex: search, $options: 'i' } },
              { createdAt: { $regex: search, $options: 'i' } },
              { createdBy: { $regex: search, $options: 'i' } },
              { createdFrom: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { approveAdmin: { $regex: search, $options: 'i' } },
              { updatedAt: { $regex: search, $options: 'i' } },
            ],
          };
          if (datePosted === 'Today') {
            console.log("date")
            const today = new Date();
            const startOfToday = new Date(today);
            startOfToday.setHours(0, 0, 0, 0);
            searchQuery.$and=[{
              createdAt: {
                $gte: startOfToday,
                $lt: today,
              }
            }];
          }
          //This week
          if (datePosted === 'This Week') {
            console.log("This Week");
            const today = new Date();
            const startOfThisWeek = new Date(today);
            startOfThisWeek.setDate(today.getDate() - today.getDay()); // Go back to the first day of the week (Sunday).
            startOfThisWeek.setHours(0, 0, 0, 0);
            const endOfThisWeek = new Date(startOfThisWeek);
            endOfThisWeek.setDate(startOfThisWeek.getDate() + 7); // Go forward to the last day of the week (Saturday).

            searchQuery.$and=[{
              createdAt: {
                $gte: startOfThisWeek,
                $lt: today,
              }
            }];
          }

          if (datePosted === 'This Month') {
            console.log("This Month");
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            searchQuery.$and=[{
              createdAt: {
                $gte: startOfMonth,
                $lt: today,
              }
            }];
          }

          if (datePosted === 'This Year') {
            console.log("This Year");
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date(today.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);
            
            searchQuery.$and=[{
              createdAt: {
                $gte: startOfYear,
                $lt: today,
              }
            }];
          }
          if (payRange !== undefined ) {
            console.log("Pay Range");
            // searchQuery.$and.push({ payRange: { $regex: payRange, $options: 'i' } });
            searchQuery.$and=[{ payRange: { $regex: payRange, $options: 'i' } }];
          }


        }
        
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      } else {
        sortQuery = { createdAt: -1 }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const totalApplied = await this.applyModel.countDocuments();
      const [activeCount, inactiveCount] = await Promise.all([
        this.jobModel.countDocuments({ status: "Active" }),
        this.jobModel.countDocuments({ status: "Inactive" }),
      ]);
      const [records, totalCount] = await Promise.all([
        this.jobModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                {
                  deletedAt: { $exists: false },
                  $or: [

                    { approveAdmin: { $ne: null } },
                    { approveAdmin: true },
                  ],
                }
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'recruiters',
              localField: 'recruiter',
              foreignField: '_id',
              as: 'recruiter',
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
              recruiterName: {
                $concat: [
                  { $arrayElemAt: ['$recruiter.firstName', 0] },
                  ' ',
                  { $arrayElemAt: ['$recruiter.LastName', 0] }
                ]
              },
              companyName: {
                $arrayElemAt: ['$company.name', 0]
              },
              companyLogo: {
                $arrayElemAt: ['$company.logo', 0]
              },
              createdOn: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y"
                }
              },
              totalApplied: 500

            }
          },
          {
            $project: {
              _id: 1,
              reportToWork: 1,
              isStartPlanned: 1,
              user: 1,
              title: 1,
              reportAddress: 1,
              jobType: 1,
              schedule: 1,
              startDate: 1,
              payRange: 1,
              min: 1,
              max: 1,
              perMonth: 1,
              supplementalPay: 1,
              benefitsOffer: 1,
              description: 1,
              isCVRequired: 1,
              isDeadlineApplicable: 1,
              deadlineDate: 1,
              noOfHiring: 1,
              hiringSlot: 1,
              aboutCompany: 1,
              educationLevel: 1,
              yearOfExperience: 1,
              createdAt: 1,
              createdBy: 1,
              createdFrom: 1,
              status: 1,
              approveAdmin: 1,
              updatedAt: 1,
              companyName: 1,
              recruiterName: 1,
              companyLogo:1,
            },
          },
          {
            $unwind: {
              path: '$recruiter',
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
        this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);

      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const jobIds = records.map((record: any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(jobIds.map((_id: string) => this.countApply(_id)));
      records.forEach((record: any, index: number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

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
        totalApplicants: totalApplied,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,token } = data;
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
        //For getting recruiterName from user 
        const matchingUsers = await this.recruiterModel.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { LastName: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        console.log(matchingUsers)
        const matchingUserIds = matchingUsers.map((recruiter: any) => recruiter._id);
        
        //end

        //For getting companyName from company
        const matchingCompany = await this.companyModel.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        const companyIds = matchingCompany.map((company: any) => company._id);
        //end

        searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { recruiter: { $in: matchingUserIds } },
            { company: { $in: companyIds } },
            { reportAddress: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
          // deletedAt: { $exists: false },
          // approveAdmin: { $exists: true, $eq: true },
          // createdBy: token,
        };
      }
      if (token !== undefined) {
        searchQuery = {
          ...searchQuery,
          createdBy: token, // Assuming token represents the createdBy value
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      } else {
        sortQuery = { createdAt: -1 }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const totalApplied = await this.applyModel.countDocuments();
      const [activeCount, inactiveCount] = await Promise.all([
        this.jobModel.countDocuments({ status: "Active", deletedAt: null, createdBy:token }),
        this.jobModel.countDocuments({ status: "Inactive", deletedAt: null, createdBy:token }),
      ]);
      const [records, totalCount] = await Promise.all([
        this.jobModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                { deletedAt: { $exists: false } },
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'recruiters',
              localField: 'recruiter',
              foreignField: '_id',
              as: 'recruiter',
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
              recruiterName: {
                $concat: [
                  { $arrayElemAt: ['$recruiter.firstName', 0] },
                  ' ',
                  { $arrayElemAt: ['$recruiter.LastName', 0] }
                ]
              },
              companyName: {
                $arrayElemAt: ['$company.name', 0]
              },
              companyLogo: {
                $arrayElemAt: ['$company.logo', 0]
              },
              createdOn: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y"
                }
              },
              totalApplied: 500

            }
          },
          {
            $project: {
              _id: 1,
              reportToWork: 1,
              isStartPlanned: 1,
              user: 1,
              title: 1,
              reportAddress: 1,
              jobType: 1,
              schedule: 1,
              startDate: 1,
              payRange: 1,
              min: 1,
              max: 1,
              perMonth: 1,
              supplementalPay: 1,
              benefitsOffer: 1,
              description: 1,
              isCVRequired: 1,
              isDeadlineApplicable: 1,
              deadlineDate: 1,
              noOfHiring: 1,
              hiringSlot: 1,
              aboutCompany: 1,
              educationLevel: 1,
              yearOfExperience: 1,
              createdAt: 1,
              createdBy: 1,
              createdFrom: 1,
              status: 1,
              approveAdmin: 1,
              updatedAt: 1,
              companyName: 1,
              recruiterName: 1,
              companyLogo:1,
            },
          },
          {
            $unwind: {
              path: '$recruiter',
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
        (token !== undefined) ?
        this.jobModel.countDocuments({
          $and: [
            searchQuery,
            { deletedAt: { $exists: false } },
            { createdBy: token },
          ],
        }) :
        this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
        // this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);

      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const jobIds = records.map((record: any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(jobIds.map((_id: string) => this.countApply(_id)));
      records.forEach((record: any, index: number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

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
        totalApplicants: totalApplied,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  
  // async datatableAdmin(data: any): Promise<Response<any>> {
  //   try {
  //     let { page, limit, search, sort } = data;
  //     let errorMessage = '';

  //     if (page !== undefined && limit !== undefined) {
  //       if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
  //         errorMessage = "Both 'page' and 'limit' must be integers.";
  //       }
  //     } else if (page !== undefined) {
  //       if (isNaN(page) || !Number.isInteger(Number(page))) {
  //         errorMessage = "'page' must be an integer.";
  //       }
  //     } else if (limit !== undefined) {
  //       if (isNaN(limit) || !Number.isInteger(Number(limit))) {
  //         errorMessage = "'limit' must be an integer.";
  //       }
  //     }

  //     if (errorMessage) {
  //       return new Response<any>(false, 400, errorMessage);
  //     }

  //     let searchQuery = {};
  //     if (search !== undefined) {

  //       //For getting recruiterName from user 
  //       const matchingUsers = await this.recruiterModel.find({
  //         $or: [
  //           { firstName: { $regex: search, $options: 'i' } },
  //           { LastName: { $regex: search, $options: 'i' } },
  //         ],
  //       }).select('_id');
  //       console.log(matchingUsers)
  //       const matchingUserIds = matchingUsers.map((recruiter: any) => recruiter._id);
  //       console.log(matchingUserIds)
  //       //end

  //       //For getting companyName from company
  //       const matchingCompany = await this.companyModel.find({
  //         $or: [
  //           { name: { $regex: search, $options: 'i' } },
  //         ],
  //       }).select('_id');
  //       const companyIds = matchingCompany.map((company: any) => company._id);
  //       console.log(companyIds)
  //       //end

  //       searchQuery = {
  //         $or: [
  //           { title: { $regex: search, $options: 'i' } },
  //           { recruiter: { $in: matchingUserIds } },
  //           { company: { $in: companyIds } },
  //           { reportAddress: { $regex: search, $options: 'i' } },
  //           { status: { $regex: search, $options: 'i' } },
  //         ],
  //       };
  //     }

  //     let sortQuery = {};
  //     if (sort !== undefined) {
  //       const sortParams = sort.split(':');
  //       if (sortParams.length === 2) {
  //         const [column, order] = sortParams;
  //         sortQuery = { [column]: order === 'desc' ? -1 : 1 };
  //       }
  //     } else {
  //       sortQuery = { createdAt: -1 }
  //     }

  //     page = page === undefined ? 1 : parseInt(page);
  //     limit = limit === undefined ? 10 : parseInt(limit);
  //     const skip = (page - 1) * limit;
  //     const totalApplied = await this.applyModel.countDocuments();
  //     const [activeCount, inactiveCount] = await Promise.all([
  //       this.jobModel.countDocuments({ status: "Active", deletedAt: null }),
  //       this.jobModel.countDocuments({ status: "Inactive", deletedAt: null }),
  //     ]);
  //     const [records, totalCount] = await Promise.all([
  //       this.jobModel.aggregate([
  //         {
  //           $match: {
  //             $and: [
  //               searchQuery,
  //               {
  //                 deletedAt: null
  //               }
  //             ]
  //           }
  //         },
  //         ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
  //         { $skip: skip },
  //         { $limit: limit },
  //         {
  //           $lookup: {
  //             from: 'users',
  //             localField: 'user',
  //             foreignField: '_id',
  //             as: 'user',
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'companies',
  //             localField: 'company',
  //             foreignField: '_id',
  //             as: 'company',
  //           },
  //         },
  //         {
  //           $addFields: {
  //             recruiterName: {
  //               $concat: [
  //                 { $arrayElemAt: ['$recruiter.firstName', 0] },
  //                 ' ',
  //                 { $arrayElemAt: ['$recruiter.LastName', 0] }
  //               ]
  //             },
  //             companyName: {
  //               $arrayElemAt: ['$company.name', 0]
  //             },
  //             companyLogo: {
  //               $arrayElemAt: ['$company.logo', 0]
  //             },
  //             createdOn: {
  //               $dateToString: {
  //                 date: "$createdAt",
  //                 format: "%d-%m-%Y"
  //               }
  //             },
  //             totalApplied: 500

  //           }
  //         },
  //         {
  //           $project: {
  //             _id: 1,
  //             reportToWork: 1,
  //             isStartPlanned: 1,
  //             user: 1,
  //             title: 1,
  //             reportAddress: 1,
  //             jobType: 1,
  //             schedule: 1,
  //             startDate: 1,
  //             payRange: 1,
  //             min: 1,
  //             max: 1,
  //             perMonth: 1,
  //             supplementalPay: 1,
  //             benefitsOffer: 1,
  //             description: 1,
  //             isCVRequired: 1,
  //             isDeadlineApplicable: 1,
  //             deadlineDate: 1,
  //             noOfHiring: 1,
  //             hiringSlot: 1,
  //             aboutCompany: 1,
  //             educationLevel: 1,
  //             yearOfExperience: 1,
  //             createdAt: 1,
  //             createdBy: 1,
  //             createdFrom: 1,
  //             status: 1,
  //             approveAdmin: 1,
  //             updatedAt: 1,
  //             companyName: 1,
  //             recruiterName: 1,
  //             companyLogo:1,
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: '$user',
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: '$company',
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //       ]).exec(),
  //       this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
  //     ]);

  //     if (records.length === 0) {
  //       return new Response<any>(true, 200, 'No records available', {});
  //     }

  //     const jobIds = records.map((record: any) => record._id.toString());
  //     const totalAppliedCounts = await Promise.all(jobIds.map((_id: string) => this.countApply(_id)));
  //     records.forEach((record: any, index: number) => {
  //       record.totalApplied = totalAppliedCounts[index];
  //     });

  //     const totalPages = Math.ceil(totalCount / limit);
  //     const currentPage = page;
  //     const output = {
  //       records: records,
  //       totalPages: totalPages !== null ? totalPages : 0,
  //       currentPage: currentPage !== null ? currentPage : 0,
  //       filterCount: records.length,
  //       totalCount: totalCount,
  //       activeStatus: activeCount,
  //       inactiveStatus: inactiveCount,
  //       totalApplicants: totalApplied,
  //     };
  //     return new Response<any>(true, 200, 'Read operation successful', output);
  //   } catch (error: any) {
  //     return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
  //   }
  // }
  async datatableAdmin(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,token } = data;
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
        //For getting recruiterName from user 
        const matchingUsers = await this.recruiterModel.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { LastName: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        console.log(matchingUsers)
        const matchingUserIds = matchingUsers.map((recruiter: any) => recruiter._id);
        
        //end

        //For getting companyName from company
        const matchingCompany = await this.companyModel.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        }).select('_id');
        console.log(matchingCompany)
        const companyIds = matchingCompany.map((company: any) => company._id);
        //end

        searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { recruiter: { $in: matchingUserIds } },
            { company: { $in: companyIds } },
            { reportAddress: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
          // deletedAt: { $exists: false },
          // approveAdmin: { $exists: true, $eq: true },
          // createdBy: token,
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      } else {
        sortQuery = { createdAt: -1 }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const totalApplied = await this.applyModel.countDocuments();
      const [activeCount, inactiveCount] = await Promise.all([
        this.jobModel.countDocuments({ status: "Active", deletedAt: null, createdBy:token }),
        this.jobModel.countDocuments({ status: "Inactive", deletedAt: null, createdBy:token }),
      ]);
      const [records, totalCount] = await Promise.all([
        this.jobModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'recruiters',
              localField: 'recruiter',
              foreignField: '_id',
              as: 'recruiter',
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
              recruiterName: {
                $concat: [
                  { $arrayElemAt: ['$recruiter.firstName', 0] },
                  ' ',
                  { $arrayElemAt: ['$recruiter.LastName', 0] }
                ]
              },
              companyName: {
                $arrayElemAt: ['$company.name', 0]
              },
              companyLogo: {
                $arrayElemAt: ['$company.logo', 0]
              },
              createdOn: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y"
                }
              },
              totalApplied: 500

            }
          },
          {
            $project: {
              _id: 1,
              reportToWork: 1,
              isStartPlanned: 1,
              user: 1,
              title: 1,
              reportAddress: 1,
              jobType: 1,
              schedule: 1,
              startDate: 1,
              payRange: 1,
              min: 1,
              max: 1,
              perMonth: 1,
              supplementalPay: 1,
              benefitsOffer: 1,
              description: 1,
              isCVRequired: 1,
              isDeadlineApplicable: 1,
              deadlineDate: 1,
              noOfHiring: 1,
              hiringSlot: 1,
              aboutCompany: 1,
              educationLevel: 1,
              yearOfExperience: 1,
              createdAt: 1,
              createdBy: 1,
              createdFrom: 1,
              status: 1,
              approveAdmin: 1,
              updatedAt: 1,
              companyName: 1,
              recruiterName: 1,
              companyLogo:1,
            },
          },
          {
            $unwind: {
              path: '$recruiter',
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
        this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);

      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const jobIds = records.map((record: any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(jobIds.map((_id: string) => this.countApply(_id)));
      records.forEach((record: any, index: number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

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
        totalApplicants: totalApplied,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async datatableResume(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,token } = data;
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
            { description: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { reportAddress: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
        };
      }
      if (token !== undefined) {
        searchQuery = {
          ...searchQuery,
          createdBy: token, // Assuming token represents the createdBy value
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      } else {
        sortQuery = { createdAt: -1 }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const totalApplied = await this.applyModel.countDocuments();
      const [activeCount, inactiveCount] = await Promise.all([
        this.jobModel.countDocuments({ status: "Active", deletedAt: null }),
        this.jobModel.countDocuments({ status: "Inactive", deletedAt: null }),
      ]);
      const [records, totalCount] = await Promise.all([
        this.jobModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                {
                  deletedAt: null
                }
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
              recruiterName: {
                $concat: [
                  { $arrayElemAt: ['$user.firstName', 0] },
                  ' ',
                  { $arrayElemAt: ['$user.lastName', 0] }
                ]
              },
              companyName: {
                $arrayElemAt: ['$company.name', 0]
              },
              createdOn: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y"
                }
              },
              totalApplied: 500,
              resume: "https://codegify.s3.ap-south-1.amazonaws.com/document/award_shubhamQ1_23-24.jpg"

            }
          },
          {
            $project: {
              _id: 1,
              report_address: 1,
              type: 1,
              title: 1,
              description:1,
              noOfHiring: 1,
              schedule: 1,
              startDate: 1,
              isDeadlineApplicable: 1,
              createdAt: 1,
              companyName: 1,
              recruiterName: 1,
              reportAddress: 1,
              status: 1,
              approveAdmin: 1,
              totalApplied: 1,
              deadlineDate: 1,
              createdBy:1,
              resume:1
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
        (token !== undefined) ?
        this.jobModel.countDocuments({
          $and: [
            searchQuery,
            { deletedAt: { $exists: false } },
            { createdBy: token },
          ],
        }) :
        this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
        // this.jobModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);

      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const jobIds = records.map((record: any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(jobIds.map((_id: string) => this.countApply(_id)));
      records.forEach((record: any, index: number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

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
        totalApplicants: totalApplied,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async countApply(jobId: string) {
    try {
      const result = await this.applyModel.countDocuments({ job: new ObjectId(jobId) });
      return result
    } catch (error: any) {
      return error.message;
    }
  }
}