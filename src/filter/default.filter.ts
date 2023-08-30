import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RESCODE } from '../constant/global';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    let code = transformError(err);
    code = code ? code : RESCODE.COMMFAIL;
    console.error(`${code ? '已收录' : '未收录'} :${err.name} ${err.message}`);
    ctx.status = code;
    return {
      code: code,
      message: err.message,
    };
  }
}

const transformError = (error: Error) => {
  switch (error.name) {
    case 'ValidationError': {
      return 414;
    }
    case 'TokenExpiredError': {
      return 900;
    }
    case 'JsonWebTokenError':
    case 'UnauthorizedError': {
      return 401;
    }
    case 'ForbiddenError': {
      return 403;
    }
    case 'NotFoundError': {
      return 404;
    }
    case 'MethodNotAllowedError': {
      return 405;
    }
    case 'NotAcceptableError': {
      return 406;
    }
    case 'RequestTimeoutError': {
      return 408;
    }
    case 'ConflictError': {
      return 409;
    }
    case 'UnsupportedMediaTypeError': {
      return 415;
    }
    case 'UnprocessableEntityError': {
      return 422;
    }
    case 'TooManyRequestsError': {
      return 429;
    }

    default: {
      return false;
    }
  }
};
