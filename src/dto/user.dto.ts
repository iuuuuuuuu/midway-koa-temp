import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

export class UserDTO {
  @ApiProperty({
    description: '用户名',
    required: true,
  })
  @Rule(RuleType.string().required().error(new Error('用户名不能为空')))
  username: string;
  @ApiProperty({
    description: '密码',
    required: true,
  })
  @Rule(RuleType.string().required().error(new Error('密码不能为空')))
  password: string;
}
