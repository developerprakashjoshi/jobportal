import {Role} from "../Models/Role";
import Service from "../../libs/Service";
import {AppDataSource} from "../../config/database";

export default class RoleService extends Service {
  private roleRepository;
  constructor(){
    super()
    this.roleRepository = AppDataSource.getRepository(Role);
  }
  async count() {
    try {
      const result = await this.roleRepository.count()
      return result
    } catch (error) {
      return error
    }
  }

  async list() {
    try {
      const record = await this.roleRepository.find()
      return record
    } catch (error) {
      return error
    }
  }

  async retrieve(id: number) {
    try {
    const records = await this.roleRepository.findOne({where: {id: id}});
    return records;
    } catch (error) {
      return error
    }
  }

  async retrieveByRole(name: string) {
    try {
    const records = await this.roleRepository.findOne({where: {name: name}});
    return records;
    } catch (error) {
      return error
    }
  }

  async create(data: any) {
    try {
      let role: Role = new Role()
      role.name = data.name
      role.description = data.description
      role.status = data.status
      const result = await this.roleRepository.save(role)
      return result
    } catch (error) {
      return error
    }
  }

  async update(id: number, data: any) {
    try {
      let role: Role = new Role()
      role.id = data.id
      role.name = data.name
      role.description = data.description
      role.status = data.status
      const result = await this.roleRepository.save(role);
      return result
    } catch (error) {
      return error
    }
  }

  async delete(id: number) {
    try {
      const result = await this.roleRepository.delete(id);
      return result
    } catch (error) {
      return error
    }
  }

  async datatable() {
    try{
      const records = await this.roleRepository.find({
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