import { Provide, Inject } from '@midwayjs/core';
import axios from 'axios';
import * as Crypto from 'crypto';
import { Context } from 'koa';

@Provide()
export default class Utils {
  @Inject()
  axios: typeof axios;

  async getIpInfo(ip: string) {
    const { data } = (await this.axios({
      url: `https://qifu-api.baidubce.com/ip/geo/v1/district`,
      method: 'GET',
      params: {
        ip,
      },
    })) as ipResponse;
    return data;
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
