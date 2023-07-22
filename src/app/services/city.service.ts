import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import City  from "@models/city.schema";
import State  from "@models/state.schema";

import { ObjectId } from 'mongodb';

export default class CityService extends Service {
  private cityModel: any;
  constructor() {
    super()
    this.cityModel = AppDataSource.model('City');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.cityModel.countDocuments({ deleted_at: { $eq: null } })
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.cityModel.find()
      delete record.updated_by;
      delete record.updated_from;
      delete record.updated_at;
      delete record.delete_by;
      delete record.delete_from;
      delete record.deleted_at;
      delete record.created_by;
      delete record.created_from;
      delete record.created_at;
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

      const record = await this.cityModel.findById(pid).populate('state');
     
      if (!record) {
        return new Response<any[]>(true, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByCountry(cityName: any) {
    try {
      const record = await this.cityModel.find({cityName:cityName});
     
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error:any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let city = new City()
      city.cityName = data.cityName
      city.cityCode = data.cityCode
      city.stateName = data.stateName
      city.countryName = data.countryName
      city.state = data.stateId
      city.status = data.status
      city.createdAt = new Date();
      city.createdBy = data.createdBy
      city.createdFrom = data.ip
      const result:any = await city.save()
    
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

      const city = await this.cityModel.findById(pid);

      if (!city) {
        return new Response<any[]>(false, 404, "Record not found");
      }

      if (data.cityName) {
        city.cityName = data.cityName
      }
      if (data.cityCode) {
        city.cityCode = data.cityCode
      }
      if (data.stateName) {
        city.stateName = data.stateName
      }
      if (data.countryName) {
        city.countryName = data.countryName
      }
      if (data.status) {
        city.status = data.status
      }
      if (data.stateId) {
        city.state = data.stateId
      }
      city.updatedAt = new Date()
      city.updatedBy = data.updatedBy
      city.updatedFrom = data.ip
      const result = await city.save();
      
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
      const city = await this.cityModel.findById(pid);
      if (!city) {
        return new Response<any[]>(true, 404, "City not found", city);
      }

      city.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      city.deleteBy = data.deleteBy;
      city.deleteFrom = data.ip

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
            { cityName: { $regex: search, $options: 'i' } },
            { stateName: { $regex: search, $options: 'i' } },
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
        this.cityModel.find()
          .select({ 
            "cityName": 1,
            "stateName":1,
            "countryName":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.cityModel.countDocuments(searchQuery),
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