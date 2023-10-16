import AppDataSource from '@config/mongoose';
import Service from '@libs/service';
import Response from '@libs/response';
import Apply from '@models/apply.schema';
import User from "@models/user.schema";
import Account from "@models/account.schema";
import Jobs from "@models/job.schema";
import  Notification  from "@models/notification.schema";
import SearchEngine from '@libs/meili.search';
import Recruiter from '@models/recruiter.schema';
import Interview from "@models/interview.schema";
import {Transporter} from "@config/mail";
import { ObjectId } from 'mongodb';
import moment from 'moment';

export default class ApplyService extends Service {
  private applyModel: any;
  private userModel: any;
  private postModel: any;
  private accountModel: any;
  private searchEngine: any;
  private recruiterModel: any;
  private jobModel: any;
  private notificationModel: any;
  private interviewModel: any;
  constructor() {
    super();
    this.searchEngine = new SearchEngine()
    this.applyModel = Apply;
    this.userModel = User;
    this.accountModel = Account;
    this.recruiterModel = Recruiter;
    this.jobModel = Jobs;
    this.notificationModel = AppDataSource.model('Notification');
    this.interviewModel = AppDataSource.model("Interview");
    // this.postModel = Post;
  }

  async count(jobId:string): Promise<Response<any>> {
    try {
      const result = await this.applyModel.countDocuments({ job: jobId });
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Count operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async countByUserId(userId:string): Promise<Response<any>> {
    try {
      const result = await this.applyModel.countDocuments({ user: userId });
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Count operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async getApplyList(recruiterId: string): Promise<Response<any>> {
    try {
      const result = await this.applyModel.find({ "job.recruiter": recruiterId }).populate("job").populate("user");
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Count operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async list(): Promise<Response<any>> {
    try {
      const result = await this.applyModel.find({deletedAt: null}).populate('job').populate('user');
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Read operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async retrieve(pid: string): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const record = await this.applyModel.findById(pid);
      if (!record) {
        return new Response<any>(true, 200, 'Record not available', record);
      }
      return new Response<any>(true, 200, 'Read operation successful', record);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async retrieveByApply(name: string): Promise<any> {
    try {
      const records = await this.applyModel.findOne({ name: name });
      return records;
    } catch (error: any) {
      return error;
    }
  }

  async getApplyData(userId:string):Promise<Response<any[]>> {
    try {
      // const records:any = await this.applyModel.find({ user: userId }).populate('user').populate('job').populate('job');
      // const records:any = await this.applyModel.find({ user: userId }).populate('job').populate('user');
      // const interviewRecords = await this.interviewModel
      // .find({ user: records.user._id, job: records.job._id })
      // const combinedData:any = {
      //   records,
      //   interview: interviewRecords,
      // };

      const records:any = await this.applyModel.aggregate([
        {
          $match: {
            user: new ObjectId(userId) // Convert the userId to ObjectId
          }
        },
        {
          $lookup: {
            from: "jobs", // Name of the jobs collection
            localField: "job",
            foreignField: "_id",
            as: "job"
          }
        },
        {
          $unwind: "$job" // Unwind the job array (since $lookup returns an array)
        },
        {
          $lookup: {
            from: "users", // Name of the jobs collection
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user" // Unwind the job array (since $lookup returns an array)
        },
        // {
        //   $lookup: {
        //     from: "interviews", // Name of the jobs collection
        //     localField: "job._id",
        //     foreignField: "job",
        //     as: "interview"
        //   }
        // },
        // {
        //   $unwind: "$interview" // Unwind the job array (since $lookup returns an array)
        // }
      ])
      const dataSet= await Promise.all(records.map(async(record:any) =>{
        console.log(record.job._id)
        console.log(record.user._id)
        const records = await this.interviewModel.find({user:record.user._id,job:record.job._id});
        return {...record,interview:records}
      }))
      // 

      return new Response<any[]>(true, 200, "Retrive successfully", dataSet);
    } catch (error:any) {
      console.error('Error fetching :', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };


  async create(data: any): Promise<Response<any>> {
    try {
      const existingApplication = await this.applyModel.findOne({ job: data.jobId, user: data.userId });

      if (existingApplication) {
        return new Response<any>(false, 409, "User already applied for this job");
      }
      
      const apply = new Apply();
      apply.job = data.jobId;
      apply.user =data.userId;
      apply.status =data.status;
      apply.applyAt= data.applyAt;
      apply.createdAt = new Date();
      apply.createdBy = data.createdBy
      apply.createdFrom = data.ip
      const result = await apply.save();
      console.log(result)
      if(result){
        const recordJob = await this.jobModel.findById(data.jobId);
        const recordUser = await this.userModel.findById(data.userId);
        let notification = new Notification()
        notification.sender = data.userId
        notification.recipient = recordJob.createdBy
        notification.commonUser=recordJob.createdBy
        notification.content = `${recordUser.firstName} ${recordUser.lastName} applied for the ${recordJob.title} position at ${new Date()}`
        notification.type = "Job Apply"
        notification.createdAt = new Date();
        notification.createdBy = data.createdBy
        notification.createdFrom = data.ip
        const resultNotification:any = await notification.save()

      let ajobId = result.job.toString();
      let applyJobId = await this.jobModel.findById(ajobId);
      const recuriterId = applyJobId.recruiter.toString();
      const recruiter = await this.recruiterModel.findById(recuriterId);
      // console.log(recruiter)
       
      let from=process.env.EMAIL_FROM
      let to=recruiter.email
      let subject="Job apply"
      let text=`Hello ${recruiter.firstName} ${recruiter.LastName},

      You have a new job application! A candidate has applied for the ${recordJob.title} position. Please review their profile at your earliest convenience.
      
      Regards,
      Simandhar Education
      `

      const message = {from,to,subject,text};
      const resultEmail = await Transporter.sendMail(message);
      }
      return new Response<any>(true, 201, 'Insert operation successful',result);
      
    } catch (error:any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async update(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const apply = await this.applyModel.findById(pid);
      if (!apply) {
        return new Response<any>(true, 200, 'Record not available', apply);
      }
      if (data.jobId) {
        apply.job = data.jobId;
      }
      if (data.userId) {
        apply.user = data.userId;
      }
      if (data.applyAt) {
        apply.applyAt = data.applyAt;
      }
      if (data.status) {
        apply.status = data.status;
      }
     
      apply.applyAt = new Date();
      
      // await this.searchEngine.updateIndex('apply', apply);
      const result = await apply.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updateCandidateStatus(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const apply = await this.applyModel.findById(pid);
      if (!apply) {
        return new Response<any>(true, 200, 'Record not available', apply);
      }
      if (data.status) {
        apply.status = data.status;
      }
      apply.updatedAt = new Date()
      apply.updatedBy = data.updatedBy
      apply.updatedFrom = data.ip 
      // await this.searchEngine.updateIndex('apply', apply);
      const result = await apply.save();
      
      const jobId = result.job.toString();
      const job = await this.jobModel.findById(jobId)
      const recuriterId = job.recruiter.toString()
      const recruiters = await this.recruiterModel.findById(recuriterId)
      const userId = result.user.toString();
      const candidate = await this.userModel.findById(userId)
      // console.log(job,'',candidate)

      if (result.status === 'Accepted') {

        let notification = new Notification()
        notification.sender = recruiters._id
        notification.content = job.title
        notification.content = `Great news! Your profile has been shortlisted for the ${job.title} position. Expect further communication from us soon.`
        notification.createdAt = new Date();
        notification.createdBy = recruiters._id
        notification.type = "The approval has been done!."
        notification.createdFrom = data.ip
        const resultNotification :any = await notification.save()



        let from = process.env.EMAIL_FROM;
        let to = candidate.email;
        let subject = "The approval has been done!";
        let text = `Hello ${candidate.firstName} ${candidate.lastName},
          Great news! Your profile has been shortlisted for the ${job.title} position. Expect further communication from us soon.
          
          Regards,
          Simandhar Education
        
        `
        const message = { from, to, subject, text };
  
        const resultEmail = await Transporter.sendMail(message);
      }else{

        let notification = new Notification()
        notification.sender = recruiters._id
        notification.content = job.title
        notification.content = `We regret to inform you that your profile has not been shortlisted for the ${job.title} position.`
        notification.createdAt = new Date();
        notification.createdBy = recruiters._id
        notification.type = "The approval has not been done!."
        notification.createdFrom = data.ip
        const resultNotification :any = await notification.save()




        let from = process.env.EMAIL_FROM;
        let to = candidate.email;
        let subject = "The approval has not been approved!";
        let text = `Hello ${candidate.firstName} ${candidate.lastName},
            We regret to inform you that your profile has not been shortlisted for the ${job.title} position. Thank you for your interest.
            
            Regards,
            Simandhar Education
          `
        const message = { from, to, subject, text };
  
        const resultEmail = await Transporter.sendMail(message);
      }
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }



  async delete(pid: string,data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const apply = await this.applyModel.findById(pid);
      if (!apply) {
        return new Response<any>(true, 200, 'Record not available');
      }
      apply.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      apply.deleteBy = data.deleteBy;
      apply.deleteFrom = data.ip;
      // await this.searchEngine.deleteDocument('apply', pid);
      const result = await apply.save();
      return new Response<any>(true, 200, 'Delete operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
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
            { applyAt: { $regex: search, $options: 'i' } },
            { jobId: { $regex: search, $options: 'i' } },
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
      }else{
        sortQuery = {createdAt:-1}
      }
  
      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
  
      const aggregationPipeline = [
        { $match: searchQuery },
        ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            jobId: 1,
            userId: 1,
            applyAt: 1,
            createdAt:1,
            _id: 0,
          },
        },
        {
          $facet: {
            records: [{ $match: {} }], // Empty match to return the documents
            totalCount: [{ $count: "count" }],
          },
        },
        {
          $project: {
            records: 1,
            totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          },
        },
      ];
  
      const [aggregationResult] = await this.applyModel.aggregate(aggregationPipeline);
  
      const { records, totalCount } = aggregationResult;
  
      console.log(records, totalCount);
  
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
  async searchApplys(query: any): Promise<Response<any>> {
    try {
      const searchOptions = {
        filters: `name:${query}*`, // Specify the filter to search in the "name" column with a partial match
        attributesToRetrieve: ['name'], // Specify the column(s) to retrieve in the search results
      };
      const result = await this.searchEngine.search('apply', query, searchOptions);
      return new Response<any>(true, 200, 'Search engine operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Search engine server error', undefined, undefined, error.message);
    }
  }

}