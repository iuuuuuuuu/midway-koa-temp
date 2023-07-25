import { ALL, Body, Controller, Get, Post, UseGuard } from '@midwayjs/core';
import { AuthGuard } from '../../guard/auth.gurd';
import BaseController from '../base.controller';
import { User } from '../../entity/user';

@Controller('/admin')
export class UserController extends BaseController {
  @Get('/user')
  @UseGuard(AuthGuard)
  async home() {
    return this.ok('Hello user!');
  }
  @Post('/login')
  async login(@Body(ALL) body: User) {
    const { password, username } = body;
    const user = await this.userService.find({
      username,
      password,
    });
    if (user) {
      const data = await this.CreateToken(user);
      return this.ok(data);
    } else {
      return this.fail('用户名或密码错误');
    }
  }
}
