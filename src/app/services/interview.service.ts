import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response";
import Interview from "@models/interview.schema";
import User from "@models/interview.schema";
import { ObjectId } from "mongodb";

export default class InterviewService extends Service {
  private interviewModel: any;
  private userModel: any;
  constructor() {
    super();
    this.interviewModel = AppDataSource.model("Interview");
    this.userModel = AppDataSource.model("User");
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.interviewModel.countDocuments();
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
      const record = await this.interviewModel.find({ deletedAt: null });
      return new Response<any[]>(
        true,
        200,
        "Read operation successful",
        record
      );
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
      const record = await this.interviewModel.findById(pid);
      if (!record) {
        return new Response<any[]>(false, 404, "Record not found");
      }
      return new Response<any[]>(
        true,
        200,
        "Read operation successful",
        record
      );
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async listOfCandidate(): Promise<Response<any[]>> {
    try {
      // const record = await this.companyModel.find().limit(10).populate({path: 'company', select: 'name'})
      const records: any = await this.userModel
        .find()
        .limit(10)
        .select("firstName lastName");
      // const companyNames = records.map((record:any) => record.name);

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

  async retrieveByinterview(name: string) {
    try {
      const records = await this.interviewModel.findOne({
        where: { name: name },
      });
      return records;
    } catch (error) {
      return error;
    }
  }

  async create(data: any): Promise<Response<any[]>> {
    try {
      const existingInterview = await Interview.findOne({
        user: data.candidateId,
        job: data.jobId
      });
  
      if (existingInterview) {
        return new Response<any[]>(false, 400, "Record already exists for candidateId and jobId");
      }
      let interview = new Interview();
      interview.user = data.candidateId;
      interview.job = data.jobId;
      interview.candidateName = data.candidateName;
      interview.interviewDate = data.interviewDate;
      interview.interviewTime = data.interviewTime;
      interview.interviewLink = data.interviewLink;
      interview.description = data.description;
      interview.createdAt = new Date();
      interview.createdBy = data.createdBy;
      interview.createdFrom = data.ip;
      const result: any = await interview.save();
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
      const interview = await this.interviewModel.findById(pid);

      if (!interview) {
        return new Response<any[]>(true, 404, "Record not found");
      }
      if (data.candidateId) {
        interview.user = data.candidateId;
      }
      if (data.candidateName) {
        interview.candidateName = data.candidateName;
      }
      if (data.interviewDate) {
        interview.interviewDate = data.interviewDate;
      }
      if (data.interviewTime) {
        interview.interviewTime = data.interviewTime;
      }
      if (data.interviewLink) {
        interview.interviewLink = data.interviewLink;
      }
      if (data.description) {
        interview.description = data.description;
      }
      if (data.jobId) {
        interview.job = data.jobId;
      }

      interview.updatedAt = new Date();
      interview.updatedBy = data.updatedBy;
      interview.updatedFrom = data.ip;
      const result = await interview.save();
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

  async updateApproval(pid: string, data: any) {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }

      const interview = await this.interviewModel.findById(pid);

      if (!interview) {
        return new Response<any[]>(true, 404, "Record not found");
      }

      if (typeof data.status == "boolean") {
        // Check if status is provided in the data
        interview.status = data.status;
      }

      interview.updatedAt = new Date();
      interview.updatedBy = data.updatedBy;
      interview.updatedFrom = data.ip;

      const result = await interview.save();

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

  // async delete(pid: string, data: any) {
  //   try {
  //     const isValidObjectId = ObjectId.isValid(pid);
  //     if (!isValidObjectId) {
  //       return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
  //     }
  //     let id = new ObjectId(pid);
  //     const interview = await this.interviewModel.findById(pid);
  //     if (!interview) {
  //       return new Response<any[]>(true, 404, "Interview not found", interview);
  //     }
  //     return new Response<any[]>(true, 200, "Delete operation successful", interview);
  //   } catch (error: any) {
  //     return new Response<any[]>(false, 400, error.message);
  //   }
  // }
  async delete(pid: string, data: any) {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }

      // Assuming you have imported and have access to the `ObjectId` class from the MongoDB driver.
      let id = new ObjectId(pid);

      // Assuming you have a model called `interviewModel` that represents your MongoDB collection.
      const interview = await this.interviewModel.findById(id);

      if (!interview) {
        return new Response<any[]>(true, 404, "Interview not found", interview);
      }

      // Assuming you are using a method like `deleteOne` or `findOneAndDelete` to delete the record.
      const result = await this.interviewModel.deleteOne({ _id: id });

      if (result.deletedCount === 1) {
        return new Response<any[]>(
          true,
          200,
          "Delete operation successful",
          interview
        );
      } else {
        return new Response<any[]>(
          false,
          500,
          "Failed to delete the interview"
        );
      }
    } catch (error: any) {
      return new Response<any[]>(false, 400, error.message);
    }
  }

  async datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort, token } = data;

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
      // if (search !== undefined) {
      //   searchQuery = {
      //     $or: [
      //       { candidateName: { $regex: search, $options: 'i' } },
      //       { interviewDate: { $regex: search, $options: 'i' } },
      //     ],
      //   };
      // }
      if (search !== undefined) {
        // Check if the search query is a valid date format
        const searchDate = new Date(search);
        if (!isNaN(searchDate.getTime())) {
          // Valid date format, construct a date range for search
          const nextDay = new Date(searchDate);
          nextDay.setDate(nextDay.getDate() + 1);

          searchQuery = {
            $and: [
              { interviewDate: { $gte: searchDate } }, // Greater than or equal to search date
              { interviewDate: { $lt: nextDay } }, // Less than the next day
            ],
          };
        } else {
          // Not a date format, search only candidateName using $regex
          searchQuery = {
            $or: [
              { candidateName: { $regex: search, $options: "i" } },
              { "userDetails.firstName": { $regex: search, $options: "i" } },
              { "userDetails.lastName": { $regex: search, $options: "i" } },
              { "userDetails.email": { $regex: search, $options: "i" } },
            ],
          };
        }
      }
      if (token !== undefined) {
        searchQuery = {
          ...searchQuery,
          createdBy: token, // Assuming token represents the createdBy value
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(":");
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === "desc" ? -1 : 1 };
        }
      } else {
        sortQuery = { createdAt: -1 };
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.interviewModel
          .aggregate([
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $unwind: "$userDetails",
            },

            {
              $match: {
                $and: [
                  searchQuery,
                  { deletedAt: null }, // Filter out documents where deletedAt is not null
                ],
              },
            },
            ...(Object.keys(sortQuery).length > 0
              ? [{ $sort: sortQuery }]
              : []),
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                candidateName: 1,
                interviewDate: 1,
                interviewTime: 1,
                interviewLink: 1,
                description: 1,
                createdAt: 1,
                createdBy: 1,
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
                fullName: {
                  $concat: [
                    "$userDetails.firstName",
                    " ",
                    "$userDetails.lastName",
                  ], // Combine first name and last name
                },
                email: "$userDetails.email",
                phoneNo: "$userDetails.phoneNo",
              },
            },
            {
              $unwind: {
                path: "$company",
                preserveNullAndEmptyArrays: true,
              },
            },
          ])
          .exec(),

        this.interviewModel.countDocuments({ deletedAt: { $exists: false } }),
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
