import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import  State  from "@models/state.schema";
import  Country  from "@models/country.schema";
import { ObjectId } from 'mongodb';

export default class StateService extends Service {
  private stateModel: any;
  constructor() {
    super()
    this.stateModel = AppDataSource.model('State');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.stateModel.countDocuments()
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.stateModel.find()
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

      const record = await this.stateModel.findById(pid).populate('country');
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);

    }
  }

  async retrieveByState(stateName:any) {
    try {
      const record = await this.stateModel.find({stateName:stateName});
     
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error:any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let state = new State()
      state.stateName = data.stateName
      state.stateCode = data.stateCode
      state.countryName = data.countryName
      state.country = data.countryId
      state.status = data.status
      state.createdAt = new Date();
      state.createdBy = data.createdBy
      state.createdFrom = data.ip

      const result:any = await state.save()
      
      delete result.created_at;
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
      const state = await this.stateModel.findById(pid);

      if (!state) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (data.stateName) {
        state.stateName = data.stateName
      }
      if (data.stateCode) {
        state.stateCode = data.stateCode
      }
      if (data.countryName) {
        state.countryName = data.countryName
      }
      if(data.countryId){
        state.country = data.countryId
      }
      if (data.status) {
        state.status = data.status
      }

      state.updatedAt = new Date()
      state.updatedBy = data.updatedBy
      state.updatedFrom = data.ip

      const result = await state.save();
      
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

      const states = await this.stateModel.findById(pid);
      if (!states) {
        return new Response<any[]>(true, 404, "States not found", states);
      }

      states.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      states.deleteBy = data.deleteBy;
      states.deleteFrom = data.ip;

      const result = await states.save(states);
      

      return new Response<any[]>(true, 200, "Delete operation successful", states);
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
            { stateName: { $regex: search, $options: 'i' } },
            { stateCode : { $regex: search, $options: 'i' } },
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
        this.stateModel.find()
          .select({ 
            "stateName": 1,
            "stateCode":1,
            "countryCode":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.stateModel.countDocuments(searchQuery),
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