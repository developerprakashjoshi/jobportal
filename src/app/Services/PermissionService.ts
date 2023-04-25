import {Permission} from "../Models/Permission";
import Service from "../../libs/Service";
import {AppDataSource} from "../../config/database";

export default class PermissionService extends Service {
  private permissionRepository;
  constructor(){
    super()
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }
  async count() {
    try {
      const result = await this.permissionRepository.count()
      return result
    } catch (error) {
      return error
    }
  }

  async list() {
    try {
      const record = await this.permissionRepository.find()
      return record
    } catch (error) {
      return error
    }
  }

  async retrieve(id: number) {
    try {
    const records = await this.permissionRepository.findOne({where: {id: id}});
    return records;
    } catch (error) {
      return error
    }
  }

  async retrieveByRole(name: string) {
    try {
    const records = await this.permissionRepository.findOne({where: {name: name}});
    return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any) {
    try {
      let permission: Permission = new Permission()
      permission.name = data.name
      permission.description = data.description
      permission.status = data.status
      const result = await this.permissionRepository.save(permission)
      return result
    } catch (error) {
      return error
    }
  }

  async update(id: number, data: any) {
    try {
      let permission: Permission = new Permission()
      permission.id = data.id
      permission.name = data.name
      permission.description = data.description
      permission.status = data.status
      const result = await this.permissionRepository.save(permission);
      return result
    } catch (error) {
      return error
    }
  }

  async delete(id: number) {
    try {
      const result = await this.permissionRepository.delete(id);
      return result
    } catch (error) {
      return error
    }
  }

  async datatable() {
    try{
      const records = await this.permissionRepository.find({
        order: {
          id: "DESC",
        },
        skip: 0,
        take: 10,
      });
      return records
    } catch (error) {
      return error
    }
  }
}