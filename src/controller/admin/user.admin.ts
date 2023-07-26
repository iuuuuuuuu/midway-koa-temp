import { Body, Controller, Get, Post, UseGuard } from '@midwayjs/core';
import { AuthGuard } from '../../guard/auth.gurd';
import BaseController from '../base.controller';
import { UserDTO } from '../../dto/user.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/admin')
export class adminUserController extends BaseController {
  @Get('/user')
  @UseGuard(AuthGuard)
  async home() {
    return this.ok('Hello user!');
  }

  @Post('/login', {
    summary: '登录',
  })
  @Validate({
    // 一般情况下使用全局默认配置即可
    errorStatus: 400,
  })
  async login(@Body() body: UserDTO) {
    const { password, username } = body;
    const user = await this.userService.find({
      username,
      password,
    });
    if (user) {
      const data = await this.utils.CreateToken(user);
      return this.ok(data);
    } else {
      return this.fail('用户名或密码错误');
    }
  }
}
