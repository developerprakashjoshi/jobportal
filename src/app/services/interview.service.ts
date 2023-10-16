import AppDataSource from "@config/mongoose";
import Service from "@libs/service";
import moment from "moment";
import Response from "@libs/response";
import Interview from "@models/interview.schema";
import User from "@models/interview.schema";
import Jobs from "@models/job.schema";
import Notification from "@models/notification.schema";
import { Transporter } from "@config/mail";
import { ObjectId } from "mongodb";

export default class InterviewService extends Service {
  private interviewModel: any;
  private userModel: any;
  private jobModel: any;
  private notificationModel: any;
  constructor() {
    super();
    this.jobModel = Jobs;
    this.interviewModel = AppDataSource.model("Interview");
    this.userModel = AppDataSource.model("User");
    this.notificationModel = AppDataSource.model("Notification");
  }
  async count(): Promise<Response<any[]>> {
    try {
      const result = await this.interviewModel.countDocuments({
        deletedAt: null,
        createdBy: "64bd4d01c02b6a3246207fc9",
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
        job: data.jobId,
      });

      if (existingInterview) {
        return new Response<any[]>(
          false,
          400,
          "Record already exists for candidateId and jobId"
        );
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
      console.log("*result*");
      console.log(result);

      const candidateId = interview.user;
      let checkCandidateId = await this.userModel.find({ _id: candidateId });
      let candidateEmail = checkCandidateId[0].email;
      const jobId = result.job.toString();
      const job = await this.jobModel.findById(jobId);

      if (result.status === "true") {
        let notification = new Notification();
        notification.sender = checkCandidateId[0]._id;
        notification.content = job.title;
        notification.content = `${checkCandidateId[0].firstName} ${checkCandidateId[0].lastName},\n\n Good news! An interview has been scheduled for the ${job.title} position.`;
        notification.createdAt = new Date();
        notification.createdBy = result.createdBy;
        notification.type = "An interview has been scheduled.";
        notification.createdFrom = data.ip;
        const resultNotification: any = await notification.save();

        let from = process.env.EMAIL_FROM;
        let to = candidateEmail;
        let subject = "Interview Schedule";
        // let text = `Dear ${checkCandidateId[0].firstName} ${checkCandidateId[0].lastName}, Your interview has been scheduled for [${interview.interviewDate}/${interview.interviewTime}/${interview.interviewLink}]. Please prepare for the interview and arrive on time. Best regards`;
        let text = `Hello ${checkCandidateId[0].firstName} ${checkCandidateId[0].lastName},

        Good news! An interview has been scheduled for the ${job.title} position. Check your email for detailed information.

        Regards,
        Simandhar Education`;

        const message = { from, to, subject, text };
        const resultEmail = await Transporter.sendMail(message);
      } else {
        let notification = new Notification();
        notification.sender = checkCandidateId[0]._id;
        notification.content = job.title;
        notification.content = `${checkCandidateId[0].firstName} ${checkCandidateId[0].lastName},\n\n We regret to inform you that your application for the ${job.title} position's skills interview has not been successful.`;
        notification.createdAt = new Date();
        notification.createdBy = result.createdBy;
        notification.type =
          "We regret to inform you that your application for the ${job.title} position's skills interview has not been successful.";
        notification.createdFrom = data.ip;
        const resultNotification: any = await notification.save();

        let from = process.env.EMAIL_FROM;
        let to = candidateEmail;
        let subject = "Interview Cancel.";
        let text = `Hello ${checkCandidateId[0].firstName} ${checkCandidateId[0].lastName},

        We regret to inform you that your application for the ${job.title} position's skills interview has not been successful. Keep applying for other opportunities with us.

        Regards,
        Simandhar Education `;

        const message = { from, to, subject, text };
        const resultEmail = await Transporter.sendMail(message);
      }

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
      let { page, limit, search, sort, token, date, name, email, phone } = data;

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
              { "userDetails.phoneNo": { $regex: search, $options: "i" } },
            ],
          };
        }
      }

      if (
        name !== undefined ||
        email !== undefined ||
        phone !== undefined ||
        date !== undefined
      ) {
        const andConditions = [];

        if (name !== undefined) {
          andConditions.push({
            $or: [
              { candidateName: { $regex: name, $options: "i" } },
              { "userDetails.firstName": { $regex: name, $options: "i" } },
              { "userDetails.lastName": { $regex: name, $options: "i" } },
            ],
          });
        }

        if (email !== undefined) {
          andConditions.push({
            "userDetails.email": { $regex: email, $options: "i" },
          });
        }
        if (phone !== undefined) {
          andConditions.push({
            "userDetails.phoneNo": { $regex: phone, $options: "i" },
          });
        }

        if (date !== undefined) {
          const searchDate = new Date(date);
          console.log(searchDate)
          if (!isNaN(searchDate.getTime())) {
          //   // Valid date format, construct a date range for search
          //   const nextDay = new Date(searchDate);
          //   nextDay.setDate(nextDay.getDate() + 1);

          andConditions.push( { interviewDate: { $eq: searchDate } });

          }
        }

        searchQuery = { $and: andConditions };
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
              $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "jobDetails",
              },
            },
            // {
            //   $unwind: "$userDetails",
            // },

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
              $addFields: {
                userDetails: { $arrayElemAt: ["$userDetails", 0] }, // Extract the first user detail
              },
            },
            {
              $addFields: {
                jobDetails: { $arrayElemAt: ["$jobDetails", 0] }, // Extract the first user detail
              },
            },
            {
              $project: {
                candidateName: 1,
                interviewDate: 1,
                interviewTime: 1,
                interviewLink: 1,
                description: 1,
                createdAt: 1,
                createdBy: 1,
                // userDetails:1,
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
                title: "$jobDetails.title",
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
        this.interviewModel.countDocuments({
          deletedAt: null,
          createdBy: token,
        }),
        // this.interviewModel.countDocuments({ deletedAt: { $exists: false } }),
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
