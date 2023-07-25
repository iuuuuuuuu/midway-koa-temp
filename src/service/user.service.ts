import { Provide } from '@midwayjs/core';
import { User } from '../entity/user';
import BaseService from './base.service';

@Provide()
export default class UserService extends BaseService {
  async initUser() {
    const count = await this.count();
    if (count == 0) {
      const data = await this.add({
        username: 'admin',
        password: 'admin',
      });
      console.info('初始化用户成功!', data);
    }
  }
  add(params: User): Promise<User> {
    return this.userModel.create(params);
  }
  async find(map: any = {}): Promise<User | undefined> {
    return await this.userModel.findOne(map).select('-password').exec();
  }
  async finds(
    map: any = {},
    skip = 0,
    limit = 1,
    sort: any = {
      _id: -1,
    }
  ): Promise<User[]> {
    return await this.userModel
      .find(map)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({
        ...sort,
      })
      .exec();
  }
  async delete(map: any): Promise<boolean> {
    const { _id } = map;
    if (_id) {
      const { acknowledged } = await this.userModel.deleteOne(map).exec();
      return acknowledged;
    } else {
      const { acknowledged } = await this.userModel.deleteMany(map).exec();
      return acknowledged;
    }
  }
  async update(map: any, params?: User): Promise<boolean> {
    const { _id } = map;
    if (_id) {
      const { acknowledged } = await this.userModel
        .updateOne(map, params)
        .exec();
      return acknowledged;
    } else {
      const { acknowledged } = await this.userModel
        .updateMany(map, params)
        .exec();
      return acknowledged;
    }
  }
  async count(map: any = {}) {
    return await this.userModel.countDocuments(map);
  }
}
