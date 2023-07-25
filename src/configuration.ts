import { IMidwayContainer, Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ValidateErrorFilter } from './filter/validate.filter';
import ReportMiddleware from './middleware/report.middleware';
import AuthMiddleware from './middleware/auth.middleware';
import * as crossDomain from '@midwayjs/cross-domain';
import * as redis from '@midwayjs/redis';
import * as typegoose from '@midwayjs/typegoose';
import * as axios from '@midwayjs/axios';
import * as swagger from '@midwayjs/swagger';
import * as bull from '@midwayjs/bull';
import * as staticFile from '@midwayjs/static-file';
import * as captcha from '@midwayjs/captcha';
import UserService from './service/user.service';

@Configuration({
  // 启用类名冲突检查
  conflictCheck: true,
  imports: [
    koa,
    validate,
    crossDomain,
    redis,
    axios,
    swagger,
    typegoose,
    bull,
    staticFile,
    captcha,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady(container: IMidwayContainer) {
    const userService = await container.getAsync(UserService);
    userService.initUser();
    // add middleware
    this.app.useMiddleware([ReportMiddleware, AuthMiddleware]);
    // add filter
    this.app.useFilter([
      // NotFoundFilter,
      DefaultErrorFilter,
      ValidateErrorFilter,
    ]);
  }
}
