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
import UserService from '../service/user.service';
import { UserDTO } from '../dto/user.dto';

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
  @Inject()
  userService: UserService;

  async resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('请先登录');
      }
      const parts = ctx.get('authorization').split(' ');
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('token格式错误');
      }
      const [scheme, token] = parts;
      if (/^Bearer$/i.test(scheme) && token) {
        try {
          let user = await this.utils.jwtVerify<UserDTO>(token);
          ctx.user = await this.userService.find({
            _id: user._id,
          });
          await next();
        } catch (error: any) {
          if (error.message == 'jwt expired') {
            ctx.jwtToken = token;
            await next();
          } else {
            throw new httpError.UnauthorizedError(error.message);
          }
        }
      } else {
        throw new httpError.UnauthorizedError('token格式错误');
      }
    };
  }

  public match(ctx: Context): boolean {
    const ignore = [
      '/',
      '/client/user/login',
      '/client/user/register',
      '/admin/user/register',
      '/admin/user/login',
      '/admin/user/test',
      '/client/version',
      '/client/record',
    ];
    const is = !ignore.includes(ctx.path);
    if (is) console.log('ignore', ctx.path);
    return is;
  }
}
