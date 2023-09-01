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
        // 挂载jwtToken
        ctx.jwtToken = token;
        try {
          let user = await this.utils.jwtVerify<UserDTO>(token);
          ctx.user = await this.userService.find({
            _id: user._id,
          });
          await next();
        } catch (error: any) {
          const exludeUrl = ['/client/user/updateToken', '/admin/user/updateToken'];
          const url = ctx.path.slice(0, ctx.path.lastIndexOf('?'));
          console.log('url', url, error.message)
          if (error.message == 'jwt expired' && exludeUrl.includes(url)) {
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
      '/public',
      '/client/user/login',
      '/client/user/register',
      '/admin/user/register',
      '/admin/user/login',

      '/client/api/*',
    ];
    const is = !ignore.includes(ctx.path);
    if (is) console.log('ignore', ctx.path);
    // 截取最后 1 位
    const requestPath = ctx.path;
    // 把最后一个 / 之后的内容删除
    const path = requestPath.substr(0, requestPath.lastIndexOf('/')) + '/*';
    // 如果是 /client/api/* 之类的
    if (ignore.includes(path)) {
      return false;
    }
    return is;
  }
}
