import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response";
import Message from "@models/message.schema";
// import  User  from "@models/user.schema";
import { ObjectId } from "mongodb";

export default class MessageService extends Service {
  private messageModel: any;
  constructor() {
    super();
    this.messageModel = AppDataSource.model("Message");
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.messageModel.count({
        deleted_at: { $eq: null },
      });
      return new Response<any[]>(
        true,
        200,
        "Count operation successful",
        result
      );
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async list(): Promise<Response<any[]>> {
    try {
      const records = await this.messageModel
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "senderInfo",
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "recipient",
              foreignField: "_id",
              as: "recipientInfo",
            }
          },
          {
            $addFields: {
              recipientName: {
                $concat: [
                  { $arrayElemAt: ["$recipientInfo.firstName", 0] },
                  " ",
                  { $arrayElemAt: ["$recipientInfo.lastName", 0] },
                ],
              },
              senderName: {
                $concat: [
                  { $arrayElemAt: ["$senderInfo.firstName", 0] },
                  " ",
                  { $arrayElemAt: ["$senderInfo.lastName", 0] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              message: 1,
              sender: 1,
              senderName: 1,
              recipient: 1,
              recipientName: 1,
              createdAt: 1,
              createdBy: 1,
              totalApplied: 1,
              createdFrom: 1,
              __v: 1,
            }
          }
        ]);
  
      return new Response<any[]>(
        true,
        200,
        "Read operation successful",
        records
      );
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }
  
  async retrieve(pid: string) {
      try {
        const records = await this.messageModel
          .aggregate([
            {
              $match: {
                createdBy: pid, // Assuming you are using Mongoose and senderId is a valid ObjectId
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderInfo",
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "_id",
                as: "recipientInfo",
              }
            },
            {
              $addFields: {
                recipientName: {
                  $concat: [
                    { $arrayElemAt: ["$recipientInfo.firstName", 0] },
                    " ",
                    { $arrayElemAt: ["$recipientInfo.lastName", 0] },
                  ],
                },
                senderName: {
                  $concat: [
                    { $arrayElemAt: ["$senderInfo.firstName", 0] },
                    " ",
                    { $arrayElemAt: ["$senderInfo.lastName", 0] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                message: 1,
                sender: 1,
                senderName: 1,
                recipient: 1,
                recipientName: 1,
                createdAt: 1,
                createdBy: 1,
                totalApplied: 1,
                createdFrom: 1,
                __v: 1,
              }
            }
          ]);
    
        return new Response<any[]>(
          true,
          200,
          "Read operation successful",
          records
        );
      } catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
    
  }

  async retrieveByMessage(name: string) {
    try {
      const records = await this.messageModel.findOne({
        where: { name: name },
      });
      return records;
    } catch (error) {
      return error;
    }
  }

  async create(data: any) {
    try {
      let message = new Message();
      message.message = data.message;
      message.sender = data.senderId;
      message.recipient = data.recipientId;
      message.createdAt = new Date();
      message.createdBy = data.createdBy;
      message.createdFrom = data.ip;
      const result: any = await message.save();

      return new Response<any[]>(
        true,
        201,
        "Insert operation successful",
        result
      );
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
      const message = await this.messageModel.findById(pid);

      if (!message) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (data.message) {
        message.message = data.message;
      }
      if (data.senderId) {
        message.sender = data.senderId;
      }
      if (data.recipientId) {
        message.recipient = data.recipientId;
      }

      message.updatedAt = new Date();
      message.updatedBy = data.updatedBy;
      message.updatedFrom = data.ip;
      const result = await message.save();

      return new Response<any[]>(
        true,
        200,
        "Update operation successful",
        result
      );
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
      const message = await this.messageModel.findById(pid);
      if (!message) {
        return new Response<any[]>(true, 404, "Message not found", message);
      }

      message.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      message.deleteBy = data.deleteBy;
      message.deleteFrom = data.ip;

      const result = await message.save(message);
      return new Response<any[]>(
        true,
        200,
        "Delete operation successful",
        message
      );
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort } = data;
      let errorMessage = "";

      if (page !== undefined && limit !== undefined) {
        if (
          isNaN(page) ||
          !Number.isInteger(Number(page)) ||
          isNaN(limit) ||
          !Number.isInteger(Number(limit))
        ) {
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
            { message: { $regex: search, $options: "i" } },
            { messageTo: { $regex: search, $options: "i" } },
          ],
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(":");
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === "desc" ? -1 : 1 };
        }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.messageModel
          .find()
          .select({
            message: 1,
            messageTo: 1,
            _id: 0,
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.messageModel.countDocuments(searchQuery),
      ]);

      if (records.length === 0) {
        return new Response<any>(true, 200, "No records available", {});
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
      return new Response<any>(true, 200, "Read operation successful", output);
    } catch (error: any) {
      return new Response<any>(
        false,
        500,
        "Internal Server Error",
        undefined,
        undefined,
        error.message
      );
    }
  }
}
