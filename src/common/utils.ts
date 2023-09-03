import { Provide, Inject, makeHttpRequest } from '@midwayjs/core';
import * as Crypto from 'crypto';
import { Context } from 'koa';
import { RedisService } from '@midwayjs/redis';
import { JwtService } from '@midwayjs/jwt/dist';
type IOptions = Parameters<typeof makeHttpRequest>[1];

@Provide()
export default class Utils {
  @Inject()
  redisService: RedisService;
  @Inject()
  jwtService: JwtService;

  /**
   * @description: 通过请求头获取设备类型
   */
  getDeviceType(ctx: Context): DeviceType {
    const userAgent = ctx.request.headers['user-agent'] || '';
    if (/mobile/i.test(userAgent)) {
      return 'mobile';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'ios';
    } else if (/Android/.test(userAgent)) {
      return 'android';
    } else if (/Tablet/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  /**
   * @description: 把设备类型转换成中文
   */
  getDeviceTypeCN(type: DeviceType): string {
    switch (type) {
      case 'mobile':
        return '手机';
      case 'ios':
        return '苹果';
      case 'android':
        return '安卓';
      case 'tablet':
        return '平板';
      case 'desktop':
        return '电脑';
      default:
        return '未知';
    }
  }

  /**
   * @description: 创建jwt
   */
  async jwtSign(sign: any, options?: any) {
    if (typeof sign == 'object' && sign.toObject) {
      sign = sign.toObject();
    }
    return this.jwtService.sign(sign, options);
  }
  /**
   * @description: 获验证jwt
   */
  async jwtVerify<T>(sk: string): Promise<T> {
    return (await this.jwtService.verify(sk)) as T;
  }
  /**
   * @description: 获取解密后的jwt
   */
  async jwtDecode(sk: string) {
    return this.jwtService.decode(sk);
  }
  /**
   * @description: 存 redis
   */
  async setRedis(key: string, value: any) {
    this.redisService.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24 * 7);
  }
  /**
   * @description: 取 redis
   */
  async getRedis<T>(key: string): Promise<T> {
    let data = await this.redisService.get(key);
    try {
      data = JSON.parse(data);
    } catch (_e) { }
    return data as T;
  }
  async delRedis(key: string) {
    return this.redisService.del(key);
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
  md5(str: string, adTime = false) {
    return this.encrypt('md5', str, adTime);
  }
  sha256(str: string, adTime = false) {
    return this.encrypt('sha256', str, adTime);
  }
  // 加密
  encrypt(type: 'md5' | 'sha256', str: string, addTime = false) {
    addTime ? (str += Date.now()) : str;
    return Crypto.createHash(type).update(str).digest('hex');
  }

  /**
   * @description: 简易请求封装
   */
  async request<T>(url: string, options?: IOptions): Promise<T> {
    options.timeout = 1000 * 15;
    const res = await makeHttpRequest(url, options);
    return res.data as T;
  }
}
