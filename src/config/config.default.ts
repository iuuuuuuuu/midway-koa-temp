import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1690269356749_743',
  koa: {
    port: 7001,
  },
  security: {
    csrf: {
      enable: false,
    },
  },
  cors: {
    credentials: false,
  },
  jsonp: {
    limit: 100,
    callback: 'jsonp',
  },
  bull: {
    // 默认队列配置
    defaultQueueOptions: {
      redis: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
      },
    },
  },
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
      expire: 60 * 60 * 24 * 3,
    },
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://127.0.0.1:27017/test',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          user: '',
          pass: '',
        },
        entities: ['entity/*{.ts,.js}'],
      },
    },
  },
  validate: {
    validationOptions: {
      // 允许出现没有定义的字段
      // allowUnknown: true,
      // 剔除参数中的未定义字段
      stripUnknown: true,
    },
  },
  swagger: {
    enable: true,
    routerMap: true,
    apiInfo: {
      title: 'midwayjs-koa',
      description: 'midwayjs-koa api doc',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enableSecurity: false,
    enableValidate: true,
  },
  staticFile: {
    dirs: {
      default: {
        // 自定义url前缀
        // prefix: '/static/admin/',
        // 对应的静态文件目录
        // dir: 'public',
        // alias: {
        //   '/': '/index.html',
        // },
      },
    },
  },
  captcha: {
    default: {
      width: 120,
      height: 40,
      noise: 2,
    },
  },
  jwt: {
    secret: 'midway-koa+klhsdaklhgalksjd@!#^&%*#$%skdaj',
    expiresIn: 60 * 30,
  },
  i18n: {
    defaultLocale: 'zh-CN',
    localeTable: {},
  },
} as MidwayConfig;
