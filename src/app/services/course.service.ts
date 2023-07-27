import AppDataSource from '@config/mongoose';
import Service from '@libs/service';
import Response from '@libs/response';

import Course from '@models/course.schema';
// import User from '@models/user.schema';
// import Post from '@models/post.schema';
import SearchEngine from '@libs/meili.search';
import { ObjectId } from 'mongodb';
import moment from 'moment';

export default class CourseService extends Service {
  private courseModel: any;
  private userModel: any;
  private postModel: any;
  private searchEngine: any;
  constructor() {
    super();
    this.searchEngine = new SearchEngine()
    this.courseModel = Course;
    // this.userModel = User;
    // this.postModel = Post;
  }

  async count(): Promise<Response<any>> {
    try {
      const result = await this.courseModel.countDocuments();
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
      const result = await this.courseModel.find();
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
      const record = await this.courseModel.findById(pid);
      if (!record) {
        return new Response<any>(true, 200, 'Record not available', record);
      }
      return new Response<any>(true, 200, 'Read operation successful', record);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async retrieveByCourse(name: string): Promise<any> {
    try {
      const records = await this.courseModel.findOne({ name: name });
      return records;
    } catch (error: any) {
      return error;
    }
  }

  async create(data: any): Promise<Response<any>> {
    try {
      const course = new Course();
      course.alphaLearnCourse = data.alphaLearnCourse;
      course.alphaLearnCourse =data.alphaLearnCourse;
      course.availableTill= data.availableTill;
      course.avgRating= data.avgRating;
      course.courseCode= data.courseCode;
      course.courseId= data.courseId;
      course.courseType= data.courseType;
      course.currency= data.currency;
      course.description= data.description;
      course.price= data.price;
      course.status= data.status;
      course.thumbnail = data.thumbnail;
      course.createdAt = new Date();
      course.createdBy = data.createdBy
      course.createdFrom = data.ip
      const result = await course.save();
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
      const course = await this.courseModel.findById(pid);
      if (!course) {
        return new Response<any>(true, 200, 'Record not available', course);
      }
      if (data.alphaLearnCourse) {
        course.alphaLearnCourse = data.alphaLearnCourse;
      }
      if (data.availableFrom) {
        course.availableFrom = data.availableFrom;
      }
      if (data.availableTill ) {
        course.availableTill  = data.availableTill;
      }
      if (data.avgRating) {
        course.avgRating = data.avgRating;
      }
      if (data.courseCode) {
        course.courseCode = data.courseCode;
      }
      if (data.courseId) {
        course.courseId = data.courseId;
      }
      if (data.courseType) {
        course.courseType = data.courseType;
      }
      if (data.currency) {
        course.currency = data.currency;
      }
      if (data.description) {
        course.description = data.description;
      }
      if (data.price) {
        course.price = data.price;
      }
      if (data.status) {
        course.status = data.status;
      }
      if (data.thumbnail) {
        course.thumbnail = data.thumbnail;
      }
      course.updatedAt = new Date()
      course.updatedBy = data.updatedBy
      course.updatedFrom = data.ip
      const result = await course.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async delete(pid: string , data:any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const course = await this.courseModel.findById(pid);
      if (!course) {
        return new Response<any>(true, 200, 'Record not available');
      }
      course.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      course.deleteBy = data.delete_by;
      course.deleteFrom = data.ip;

      const result = await course.save();
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
            { alphaLearnCourse: { $regex: search, $options: 'i' } },
            { alphaLearnCourse: { $regex: search, $options: 'i' } },
            { availableFrom: { $regex: search, $options: 'i' } },
          ],
        };
      }
  
      let sortQuery = {};
      if (sort !== undefined ) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }
      }else{
        sortQuery = {createdAt:-1}
      }
      console.log("----");
      console.log(sortQuery);
  
      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.courseModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                { deletedAt: null } // Filter out documents where deletedAt is not null
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              "currency": 1,
              "avgRating":1,
              "availableTill":1,
              "availableFrom":1
            },
          },
          {
            $unwind: {
              path: '$company',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).exec(),
        this.courseModel.countDocuments(searchQuery),
      ]);
  
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }
  
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const dataCount:any = records.map(async(row:any)=>{
        console.log(row._id);
         return await this.courseModel(row._id)
      })
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,

      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async searchCourses(query: any): Promise<Response<any>> {
    try {
      const searchOptions = {
        filters: `name:${query}*`, // Specify the filter to search in the "name" column with a partial match
        attributesToRetrieve: ['name'], // Specify the column(s) to retrieve in the search results
      };
      const result = await this.searchEngine.search('course', query, searchOptions);
      return new Response<any>(true, 200, 'Search engine operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Search engine server error', undefined, undefined, error.message);
    }
  }
}