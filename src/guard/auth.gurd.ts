import { Guard, IGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

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
    return true;
  }
}
