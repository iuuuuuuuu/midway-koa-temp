import { Guard, IGuard, httpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import Utils from '../common/utils';
const utils = new Utils();
/**
 * @file: demo
 * @description: 权限验证demo
 * @param: {context} 上下文
 * @param: {supplierClz} 供应商类
 * @param: {methodName} 方法名
 */
@Guard()
export class AuthGuard implements IGuard<Context> {
  async canActivate(
    context: Context,
    supplierClz,
    methodName: string
  ): Promise<boolean> {
    if (!context.headers['authorization']) {
      throw new httpError.UnauthorizedError('请先登录');
    }
    const parts = context.headers['authorization'].split(' ')[1];
    if (parts.length !== 2) {
      throw new httpError.UnauthorizedError('token格式错误');
    }
    const [scheme, token] = parts;
    if (/^Bearer$/i.test(scheme)) {
      const user = await utils.GetToken(token);
      if (!user) {
        throw new httpError.UnauthorizedError('token无效');
      }
      context.user = user;
      return true;
    } else {
      throw new httpError.UnauthorizedError('token格式错误');
    }
  }
}