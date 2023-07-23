import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import Review from "@models/review.schema";
import { ObjectId } from 'mongodb';

export default class ReviewService extends Service {
  private reviewModel: any;
  constructor() {
    super()
    this.reviewModel = AppDataSource.model('Review');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.reviewModel.countDocuments({ deleted_at: { $eq: null } })
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.reviewModel.find({deletedAt: null});

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

      const record = await this.reviewModel.findById(pid);

      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByAddress(name: string) {
    try {
      const records = await this.reviewModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let review = new Review()
      review.name = data.name
      review.designation = data.designation
      review.rating = data.rating
      review.message = data.message

      review.createdAt = new Date();
      review.createdBy = data.createdBy
      review.createdFrom = data.ip
      const result: any = await review.save()

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
      const address = await this.reviewModel.findById(pid);

      if (!address) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (data.name) {
        address.name = data.name
      }
      if (data.designation) {
        address.designation = data.designation
      }
      if (data.rating) {
        address.rating = data.rating
      }
      if (data.message) {
        address.message = data.message
      }

      address.updatedAt = new Date()
      address.updatedBy = data.updatedBy
      address.updatedFrom = data.ip
      const result = await address.save();


      return new Response<any[]>(true, 201, "Update operation successful", result);
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

      const address = await await this.reviewModel.findById(pid);
      if (!address) {
        return new Response<any[]>(true, 404, "Address not found", address);
      }

      address.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      address.deleteBy = data.deleteBy;
      address.deleteFrom = data.ip;

      const result = await address.save(address);
     

      return new Response<any[]>(true, 201, "Delete operation successful", address);
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
            { name: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
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
      const [records, totalCount] = await Promise.all([
        this.reviewModel.find()
          .select({
            "name": 1,
            "rating": 1,
            "designation": 1,
            "_id": 0,
            "createdAt":1
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.reviewModel.countDocuments(searchQuery),
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