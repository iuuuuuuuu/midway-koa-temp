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
    credentials: true,
  },
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/test',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          user: '',
          pass: '',
        },
        entities: ['src/entity/*{.ts,.js}'],
      },
    },
  },
} as MidwayConfig;
