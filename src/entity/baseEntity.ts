import { prop } from '@typegoose/typegoose';

export default class baseEntity {
  @prop({
    default: Date.now(),
  })
  updatedAt?: number;

  @prop({
    default: Date.now(),
  })
  createdAt?: number;
}
