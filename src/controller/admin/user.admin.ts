import { Body, Controller, Get, Post } from '@midwayjs/core';
import BaseController from '../base.controller';
import { UserDTO, UserEditPsdDto } from '../../dto/user.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/admin/user')
export class UserAdminController extends BaseController {
  @Get('/test')
  async home() {
    return this.ok('Hello user!');
  }

  @Post('/login', {
    summary: '登录',
  })
  @Validate({
    // 一般情况下使用全局默认配置即可
    // errorStatus: 400,
  })
  async login(@Body() body: UserDTO) {
    const { password, username } = body;
    const user = await this.userService.find({
      username,
      password,
    });
    if (user) {
      return this.ok(await this.createToken(this.ctx, user._id.toString()));
    } else {
      return this.fail('用户名或密码错误');
    }
  }
  @Post('/updateToken')
  async updateToken(@Body() body: { refreshToken: string }) {
    const msg = '账号已在其他平台登录,当前平台账号登录已失效.';
    const { refreshToken } = body;
    const redisData = await this.utils.getRedis<{
      token: string;
      user: UserDTO;
    }>(refreshToken);
    if (!redisData) {
      return this.fail(msg, 501);
    }
    const jwtToken = this.ctx.jwtToken;
    if (!jwtToken) {
      return this.ok('token还未过期!');
    }
    const { token: redisJwtToken, user } = redisData;
    if (jwtToken == redisJwtToken) {
      return this.ok(await this.createToken(this.ctx, user._id));
    } else {
      return this.fail(msg, 501);
    }
  }

  @Get('/getUserInfo')
  async getUserInfo() {
    return this.ok(this.ctx.user);
  }

  @Post('/editPsword')
  async editPsword(@Body() body: UserEditPsdDto) {
    const { oldPassword, newPassword } = body;
    const user = await this.userService.find({
      username: this.ctx.user.username,
      password: oldPassword,
    });
    if (user) {
      await this.userService.update({
        password: newPassword,
      });
      return this.ok('修改成功');
    } else {
      return this.fail('旧密码错误');
    }
  }
}
