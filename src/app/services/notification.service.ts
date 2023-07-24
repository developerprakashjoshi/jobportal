import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response"
import  Notification  from "@models/notification.schema";
import { ObjectId } from 'mongodb';

export default class NotificationService extends Service {
  private notificationModel: any;
  constructor() {
    super()
    this.notificationModel = AppDataSource.model('Notification');
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.notificationModel.countDocuments()
      return new Response<any[]>(true, 200, "Count operation successful", result);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const record = await this.notificationModel.find({deletedAt: null})
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
      const record = await this.notificationModel.findById(pid).populate('sender','firstName lastName').populate('recipient','firstName lastName');
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(true, 200, "Read operation successful", record);
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async retrieveByNotification(name: string) {
    try {
      const records = await this.notificationModel.findOne({ where: { name: name } });
      return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      let notification = new Notification()
      notification.sender = data.senderId
      notification.recipient = data.recipientId
      notification.text = data.text
      notification.createdAt = new Date();
      notification.createdBy = data.createdBy
      notification.createdFrom = data.ip
      const result:any = await notification.save()
  
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
      const notification = await this.notificationModel.findById(pid);
      if (!notification) {
        return new Response<any[]>(true, 404, "Record not found");
      }
      
      if (data.text) {
        notification.text = data.text
      }
      if (data.text) {
        notification.text = data.text
      }
      if (data.senderId) {
        notification.sender = data.senderId
      }
      if (data.recipientId) {
        notification.recipient = data.recipientId
      }
      notification.updatedAt = new Date()
      notification.updatedBy = data.updatedBy
      notification.updatedFrom = data.ip
      const result = await notification.save();
      
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
      const notification = await this.notificationModel.findById(pid);
      if (!notification) {
        return new Response<any[]>(true, 404, "Notification not found", notification);
      }

      notification.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      notification.deleteBy = data.deleteBy;
      notification.deleteFrom = data.ip

      const result = await notification.save(notification);
      

      return new Response<any[]>(true, 200, "Delete operation successful", notification);
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
            { text: { $regex: search, $options: 'i' } },
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
        this.notificationModel.find()
          .select({ 
            "text":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.notificationModel.countDocuments(searchQuery),
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