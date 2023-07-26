import { App, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Context } from '@midwayjs/koa';
import { RESCODE, RESMESSAGE } from '../constant/global';
import Utils from '../common/utils';
import UserService from '../service/user.service';
import { CaptchaService } from '@midwayjs/captcha';
import { HttpService } from '@midwayjs/axios';

@Provide()
export default abstract class BaseController {
  @App()
  baseApp: IMidwayApplication;
  @Inject()
  ctx: Context;
  @Inject()
  httpService: HttpService;
  @Inject()
  redisService: RedisService;
  @Inject()
  utils: Utils;
  @Inject()
  captchaService: CaptchaService;

  @Inject()
  userService: UserService;

  /**
   * @description: 获取请求IP详细信息
   */
  async getIpInfo(ip: string) {
    const { data } = (await this.httpService.get(
      `https://qifu-api.baidubce.com/ip/geo/v1/district`,
      {
        params: {
          ip,
        },
      }
    )) as ipResponse;
    return data;
  }
  /**
   * @description: 生成验证码图片
   */
  async captcha(width: number = 120, height: number = 40) {
    const { id, imageBase64 } = await this.captchaService.image({
      width,
      height,
    });
    return { id, imageBase64 };
  }
  /**
   * @description: 生成计算表达式验证码
   */
  async captchaMath() {
    const { id, imageBase64 } = await this.captchaService.formula();
    return { id, imageBase64 };
  }
  /**
   * @description: 验证验证码
   */
  async verifyCaptcha(ctx: Context) {
    const { id, answer } = ctx.request.body as any;
    const passed: boolean = await this.captchaService.check(id, answer);
    if (passed) {
      return this.ok('验证成功');
    }
    return this.fail('验证码错误', RESCODE.VALIDATEFAIL);
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
