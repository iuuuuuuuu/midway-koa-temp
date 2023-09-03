import { Body, Controller, Get, Post } from '@midwayjs/core';
import BaseController from '../base.controller';
import { UserDTO, UserEditPsdDto } from '../../dto/user.dto';
import { Validate } from '@midwayjs/validate';
import { PLATFORM } from '../../constant/global';

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
      return this.ok({
        ...await this.createToken(this.ctx, user._id.toString()),
        userInfo: user,
      });
    } else {
      return this.fail('用户名或密码错误');
    }
  }
  @Post('/updateToken')
  async updateToken(@Body() body: { refreshToken: string }) {
    const device = this.utils.getDeviceTypeCN(
      this.utils.getDeviceType(this.ctx)
    );
    const msg = `账号已在其他 ${device} 登录,当前账号登录已失效.`;
    const { refreshToken } = body;
    const redisData = await this.utils.getRedis<{
      token: string;
      user: UserDTO;
    }>(refreshToken);
    if (!redisData) {
      return this.fail(msg, 501);
    }
    const jwtToken = this.ctx.jwtToken;
    const { token: redisJwtToken, user } = redisData;
    if (jwtToken == redisJwtToken) {
      return this.ok({
        ...await this.createToken(this.ctx, user._id.toString()),
        userInfo: await this.userService.find({ _id: user._id }),
      });
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
        _id: user._id
      }, {
        password: newPassword,
      });
      // 删除对应的refreshToken 全部失效
      PLATFORM.map(key => {
        try {
          this.utils.delRedis(this.utils.md5(key + user._id));
        } catch (error: any) {
          console.log('删除refreshToken失败', error.message);
        }
      });
      return this.ok('修改成功');
    } else {
      return this.fail('旧密码错误');
    }
  }
}
