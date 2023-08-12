import AppDataSource from '@config/mongoose';
import Service from '@libs/service';
import Response from '@libs/response';
import Favourite from '@models/favourite.schema';
// import User from '@models/user.schema';
// import Post from '@models/post.schema';
import SearchEngine from '@libs/meili.search';
import { ObjectId } from 'mongodb';
import moment from 'moment';

export default class FavouriteService extends Service {
  private favouriteModel: any;
  private userModel: any;
  private postModel: any;
  private searchEngine: any;
  constructor() {
    super();
    this.searchEngine = new SearchEngine()
    this.favouriteModel = Favourite;
  }

  async count(userId: string): Promise<Response<any>> {
    try {
      const result = await this.favouriteModel.countDocuments({ user: userId });
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
      const result = await this.favouriteModel.find();
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
      const record = await this.favouriteModel.findById(pid);
      if (!record) {
        return new Response<any>(true, 200, 'Record not available', record);
      }
      return new Response<any>(true, 200, 'Read operation successful', record);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async getUserFav(userId: string):Promise<Response<any[]>> {
    try {
      const records:any = await this.favouriteModel.find({ user: userId }).populate('user').populate('job');
      console.log(records);
      return new Response<any[]>(true, 200, "Retrive successfully", records);
    } catch (error:any) {
      console.error('Error fetching :', error);
      return new Response<any[]>(false, 400, error.message);
    }
  };
  async retrieveByFavourite(name: string): Promise<any> {
    try {
      const records = await this.favouriteModel.findOne({ name: name });
      return records;
    } catch (error: any) {
      return error;
    }
  }

  async create(data: any): Promise<Response<any>> {
    try {
      const existingUser = await this.favouriteModel.findOne({ user: data.userId, job: data.jobId });

      if(existingUser) {
      return new Response<any[]>(false, 409, "User favourite already exists");
      }
      const favourite = new Favourite();
      favourite.user = data.userId;
      favourite.job =data.jobId;
      favourite.createdAt = new Date();
      favourite.createdBy = data.createdBy
      favourite.createdFrom = data.ip
      const result = await favourite.save();
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
      const favourite = await this.favouriteModel.findById(pid);
      if (!favourite) {
        return new Response<any>(true, 200, 'Record not available', favourite);
      }
      if (data.userId) {
        favourite.user = data.userId;
      }
      if (data.jobId) {
        favourite.job = data.jobId;
      }
      const result = await favourite.save();
      favourite.updatedAt = new Date()
      favourite.updatedBy = data.updatedBy
      favourite.updatedFrom = data.ip
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async delete(data:any): Promise<Response<any>> {
    try {

      const favourite = await this.favouriteModel.findOne({user:data.userId,job:data.jobId});
      console.log(favourite)
      if (!favourite) {
        return new Response<any>(true, 200, 'Record not available');
      }
      favourite.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      favourite.deleteBy = data.deleteBy;
      favourite.deleteFrom = data.ip
      const result = await favourite.save();
      return new Response<any>(true, 200, 'Delete operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async findJobsByUserId(userId: string,data:any) {
    try {
      const isValidObjectId = ObjectId.isValid(userId);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
  
      const jobs = await this.favouriteModel.find({ userId: userId });
  
      if (!jobs) {
        return new Response<any[]>(true, 404, "No user found", []);
      }
      jobs.deletedAt = moment().toDate(); // Set the deleted_at field to the current timestamp
      jobs.deleteBy = data.deleteBy;
      jobs.deleteFrom = data.ip;

      const result = await jobs.save(jobs);
      return new Response<any[]>(true, 200, "Found jobs for the specified user", result);
    } catch (error: any) {
      return new Response<any[]>(false, 500, error.message);
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
            { description: { $regex: search, $options: 'i' } },
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
        this.favouriteModel.find()
          .select({ 
            "name": 1,
            "description":1,
            "status":1,
           "_id": 0
          })
          .where(searchQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),
        this.favouriteModel.countDocuments(searchQuery),
      ]);
      console.log(records, totalCount)
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
  async searchFavourites(query: any): Promise<Response<any>> {
    try {
      const searchOptions = {
        filters: `name:${query}*`, // Specify the filter to search in the "name" column with a partial match
        attributesToRetrieve: ['name'], // Specify the column(s) to retrieve in the search results
      };
      const result = await this.searchEngine.search('favourite', query, searchOptions);
      return new Response<any>(true, 200, 'Search engine operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Search engine server error', undefined, undefined, error.message);
    }
  }
}