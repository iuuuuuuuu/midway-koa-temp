import { prop } from '@typegoose/typegoose';
import BaseEntity from './baseEntity';
import Utils from '../common/utils';
const utils = new Utils();

export class User extends BaseEntity {
  @prop({
    required: true,
    unique: true,
  })
  public username: string;

  @prop({
    required: true,
    set(val) {
      return utils.md5(val);
    },
  })
  public password: string;
}
