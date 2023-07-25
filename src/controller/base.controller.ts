import { App, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Context } from '@midwayjs/koa';
import { RESCODE, RESMESSAGE } from '../constant/global';
import Utils from '../common/utils';
import { User } from '../entity/user';
import UserService from '../service/user.service';

@Provide()
export default abstract class BaseController {
  @App()
  baseApp: IMidwayApplication;
  @Inject()
  ctx: Context;
  @Inject()
  redisService: RedisService;
  @Inject()
  utils: Utils;

  @Inject()
  userService: UserService;

  /**
   * @description: 创建token
   */
  async CreateToken(User: User, n = 1) {
    const username = User.username;
    const sk = this.utils.md5(
      username + Date.now() + Math.ceil(Math.random() * 1000 + n)
    );
    this.redisService.set(
      `SESSION:${sk}`,
      JSON.stringify(User),
      'EX',
      60 * 60 * 24 * 1
    );
    return {
      User,
      sk,
    };
  }
  /**
   * @description: 获取token
   */
  async GetToken(sk: string) {
    let result = await this.redisService.get(`SESSION:${sk}`);
    try {
      result = JSON.parse(result);
    } catch (error) {}
    return result;
  }
  /**
   * 成功返回
   * @param data 返回数据
   */
  ok(data?: any) {
    const res = {
      code: RESCODE.SUCCESS,
      message: RESMESSAGE.SUCCESS,
    };
    if (data || data == 0) {
      res['data'] = data;
    }
    return res;
  }

  /**
   * 失败返回
   * @param message 返回信息
   */
  fail(message?: string, code?: number) {
    return {
      code: code ? code : RESCODE.COMMFAIL,
      message: message
        ? message
        : code == RESCODE.VALIDATEFAIL
        ? RESMESSAGE.VALIDATEFAIL
        : RESMESSAGE.COMMFAIL,
    };
  }
}
