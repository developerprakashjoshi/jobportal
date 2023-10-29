import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import  Company  from "@models/company.schema";
import Jobs from "@models/job.schema";
import StorageService from "@services/storage.service";
import * as AWS from 'aws-sdk';
import { ObjectId } from 'mongodb';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,

});
export default class CompanyService extends Service {
  private companyModel: any;
  private jobModel: any;
  constructor() {
    super()
    this.companyModel = AppDataSource.model('Company');
    this.jobModel = Jobs;
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.companyModel.countDocuments({ deleted_at: { $eq: null } })
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.companyModel.find({deletedAt: null})
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

      const record = await this.companyModel.findById(pid);
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByCompany(name: string) {
    try {
      const records = await this.companyModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {

      const existingCompany = await this.companyModel.findOne({ name: data.name });

      if(existingCompany) {
      return new Response<any[]>(false, 409, "Company name already exists");
      }

      let company = new Company()
      company.name = data.name
      company.logo=data.logo
      company.size = data.size
      company.industry = data.industry
      company.yearOfEstd = data.yearOfEstd
      company.revenue = data.revenue  
      company.ceo = data.ceo
      company.ceoAvatar=data.ceoAvatar
      company.website = data.website
      company.description = data.description
      company.location=data.location
      company.photos = data.photos;

      company.createdAt = new Date();
      company.createdBy = data.createdBy
      company.createdFrom = data.ip
      const result:any = await company.save()
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

      const company = await this.companyModel.findById(pid);

      if (!company) {
        return new Response<any[]>(true, 200, "Record not found");
      }

      if (data.name) {
        company.name = data.name
      }
      if (data.size) {
        company.size = data.size
      }
      if (data.ceo) {
        company.ceo = data.ceo
      }
      if (data.yearOfEstd) {
        company.yearOfEstd = data.yearOfEstd
      }
      
      if (data.revenue) {
        company.revenue = data.revenue
      }
      if (data.opportunity) {
        company.opportunity = data.opportunity
      }
      if (data.location) {
        company.location = data.location
      }
      if (data.description) {
        company.description = data.description
      }
      if (data.industry) {
        company.industry = data.industry
      }
      
      company.updatedAt = new Date()
      company.updatedBy = data.updatedBy
      company.updatedFrom = data.ip
      const result = await company.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }
  async uploadCompanyLogo(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const company = await this.companyModel.findById(pid);
      company.logo = path
      const result = await company.save();
     
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
      
  }
  async uploadCeoAvtar(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const company = await this.companyModel.findById(pid);
      company.ceoAvatar = path
      const result = await company.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
      
  }
  async uploadPhoto(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const company = await this.companyModel.findById(pid);
      company.photo = path
      const result = await company.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
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

      const company = await this.companyModel.findOne(id);
      if (!company) {
        return new Response<any[]>(true, 404, "Company not found", company);
      }

      company.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      company.deleteBy = data.deleteBy;
      company.deleteFrom = data.ip;

      const result = await company.save();

      const filter = { company: pid }; // Specify the filter criteria

        const update = {
            $set: {
                deletedAt: moment().toDate(), // Set the deletedAt field to the current timestamp
                deleteBy: data.deleteBy, // Set the deleteBy field
                deleteFrom: data.ip // Set the deleteFrom field
            }
        };

        // Update the documents that match the filter criteria
        const resultUpdate = await this.jobModel.updateMany(filter, update);

      

      return new Response<any[]>(true, 200, "Delete operation successful", company);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  // async datatable(data: any): Promise<Response<any>> {
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
  //       searchQuery = {
  //         $or: [
  //           { name: { $regex: search, $options: 'i' } },
  //           { industry: { $regex: search, $options: 'i' } },
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
  //     }else{
  //       sortQuery = {createdAt:-1}
  //     }

  //     page = page === undefined ? 1 : parseInt(page);
  //     limit = limit === undefined ? 10 : parseInt(limit);
  //     const skip = (page - 1) * limit;
  //     const [records, totalCount] = await Promise.all([
  //       this.companyModel.find()
  //         .select({ 
  //           "logo":1,
  //           "name": 1,
  //           "size":1,
  //           "industry":1,
  //           "location":1,
  //           "createdAt":1,
  //          "_id": 1
  //         })
  //         .where(searchQuery)
  //         .sort(sortQuery)
  //         .skip(skip)
  //         .limit(limit),
  //       this.companyModel.countDocuments(searchQuery),
  //     ]);

  //     if (records.length === 0) {
  //       return new Response<any>(true, 200, 'No records available', {});
  //     }

  //     const totalPages = Math.ceil(totalCount / limit);
  //     const currentPage = page;
  //     const output = {
  //       records: records,
  //       totalPages: totalPages !== null ? totalPages : 0,
  //       currentPage: currentPage !== null ? currentPage : 0,
  //       filterCount: records.length,
  //       totalCount: totalCount,
  //     };
  //     return new Response<any>(true, 200, 'Read operation successful', output);
  //   } catch (error: any) {
  //     return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
  //   }
  // }
  async  datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,name,location,size } = data;
      console.log("data................................");
      console.log(data);
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
        return new Response(false, 400, errorMessage);
      }
  
      let searchQuery = {};
      // if (search !== undefined) {
        
      //   searchQuery = {
      //     $or: [
      //       { name: { $regex: search, $options: 'i' } },
      //       { size: { $regex: search, $options: 'i' } },
      //       { location: { $regex: search, $options: 'i' } },
      //     ],
      //   };
      // }


      // if (search !== undefined) {
      //   const searchNumber = parseFloat(search);
      //   if (!isNaN(searchNumber)) {
      //     searchQuery = { size: { $eq: searchNumber } };
      //   } else {
      //     searchQuery = {
      //       $or: [
      //         { name: { $regex: search, $options: 'i' } },
      //         { location: { $regex: search, $options: 'i' } },
      //       ],
      //     };
      //   }
      // }
      if (size !== undefined || name !== undefined || location !== undefined) {
        const andConditions = [];
      
        if (size !== undefined) {
          const sizeNumber = parseFloat(size);
          andConditions.push({ size: { $eq: sizeNumber } });
        }
      
        if (name !== undefined) {
          andConditions.push({ name: { $regex: name, $options: 'i' } });
        }
      
        if (location !== undefined) {
          andConditions.push({ location: { $regex: location, $options: 'i' } });
        }
      
        searchQuery = { $and: andConditions };
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
        {
          $match: {
            $and: [
              searchQuery,
              { deletedAt: null } // Filter out documents where deletedAt is not null
            ]
          }
        },
        ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
        // { $skip: skip },
        // { $limit: limit },
        {
          $project: {
            logo: 1,
            name: 1,
            size: 1,
            industry: 1,
            location: 1,
            createdAt:1,
            _id: 1,
          },
        },
      ];
  
      const [records, totalCount] = await Promise.all([
        Company.aggregate(aggregationPipeline),
        Company.countDocuments({ deletedAt: { $exists: false } }),
      ]);
  
      if (records.length === 0) {
        return new Response(true, 200, 'No records available', {});
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
      return new Response(true, 200, 'Read operation successful', output);
    } catch (error:any  ) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
}