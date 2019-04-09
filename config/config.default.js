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
      hostname: '127.0.0.1'
    }
  };

  config.rabbitmq = {
    URI: 'amqp://dev_200:dev_200@kintergration.chinacloudapp.cn:5672/dev',
    sub: [{
      queue: { name: 'kuser_graph_queue', keys: [ '*.kuser.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: {} },
    }, {
      queue: { name: 'sap_graph_queue', keys: [ '*.sap.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: {} },
    }, {
      queue: { name: 'wms_graph_queue', keys: [ '*.wms.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: {} },
    }, {
      queue: { name: 'kuser_logging_queue', keys: [ '*.kuser.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: { durable: true } },
    }, {
      queue: { name: 'sap_logging_queue', keys: [ '*.sap.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: { durable: true } },
    }, {
      queue: { name: 'wms_logging_queue', keys: [ '*.wms.entity.*' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: { durable: true } },
    }, {
      queue: { name: 'test_log_queue2', keys: [ '#' ], options: {}, handler: 'topic-queue.js' },
      exchange: { name: 'message_topic_exchange', type: 'topic', options: {} }
    }],
    pub: {
      exchange: 'message_topic_exchange',
      type: 'topic',
      keys: 'realtime.kuser.entity.*',
      instances: ['contract', 'customer', '', '', ''],
      path: '127.0.0.1:3000/home',
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
