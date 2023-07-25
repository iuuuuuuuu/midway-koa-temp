import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../entity/user';

@Provide()
export default class BaseService {
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;
}
