/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554346085052_7911';

  // add your middleware config here
  config.middleware = [];
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '127.0.0.1',
    }
  };

  config.rabbitmq = {
    URI: 'amqp://rabbitmq:rabbitmq@kintergration.chinacloudapp.cn:5672',
    sub: [{
      queue: { name: 'test_log_queue', keys: [ 'history.*.*', 'realtime.*.*' ], options: {}, handler: 'topic-queue1.js' },
      exchange: { name: 'topic_logs', type: 'topic', options: {} },
    }, {
      queue: { name: 'test_log_queue2', keys: [ '#' ], options: {}, handler: 'topic-queue2.js' },
      exchange: { name: 'topic_logs', type: 'topic', options: {} },
    }],
    pub: {
      exchange: 'topic_logs',
      type: 'topic',
      options: {}
    }
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  return {
    ...config
  };
};
