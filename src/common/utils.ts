import { Provide, Inject } from '@midwayjs/core';
import * as Crypto from 'crypto';
import { Context } from 'koa';
import { User } from '../entity/user';
import { RedisService } from '@midwayjs/redis';

@Provide()
export default class Utils {
  @Inject()
  redisService: RedisService;

  /**
   * @description: 创建token
   */
  async CreateToken(User: User, n = 1) {
    const username = User.username;
    const sk = this.md5(
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
   * 获取请求IP
   */
  getReqIP(ctx: Context): string {
    const req: any = ctx.req;
    return (
      req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress
    ).replace('::ffff:', '');
  }
  md5(str: string) {
    const sk = Crypto.createHash('md5').update(str).digest('hex');
    return sk;
  }
}
