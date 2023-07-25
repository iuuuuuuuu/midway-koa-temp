import {
  Inject,
  Middleware,
  httpError,
  IMiddleware,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import Utils from '../common/utils';

@Scope(ScopeEnum.Request, {
  allowDowngrade: true,
})
@Middleware()
export default class AuthMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Inject()
  ctx: Context;
  @Inject()
  utils: Utils;

  async resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('请先登录');
      }
      const parts = ctx.headers['authorization'].split(' ')[1];
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('token格式错误');
      }
      const [scheme, token] = parts;
      if (/^Bearer$/i.test(scheme)) {
        const user = await this.utils.GetToken(token);
        if (!user) {
          throw new httpError.UnauthorizedError('token无效');
        }
        ctx.user = user;
        await next();
      } else {
        throw new httpError.UnauthorizedError('token格式错误');
      }
    };
  }

  public match(ctx: Context): boolean {
    const ignore = [
      '/client/user/login',
      '/client/user/register',
      '/admin/user/register',
      '/admin/user/login',
    ];
    return ignore.includes(ctx.path);
  }
}
