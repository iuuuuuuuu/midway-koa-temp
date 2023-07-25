import { prop } from '@typegoose/typegoose';

export default abstract class BaseEntity {
  @prop({
    default: Date.now(),
    timestamp: true,
  })
  updateTime?: Date;

  @prop({
    default: Date.now(),
  })
  createTime?: Date;
}
