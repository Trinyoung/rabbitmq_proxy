'use strict';
const Service = require('egg').Service;
const amqp = require('amqplib');
const MessageConsumer = require('../rabbitmq/topic-queue1');
class HomeService extends Service {

  async send() {
    const { config, ctx } = this;
    const msg = JSON.stringify(ctx.request.body);
    const options = {
      uri: config.rabbitmq.URI,
      connectRetries: 5
    };
    const connection = await this.connect(options, 1);
    const channel = await connection.createChannel();
    const queue = config.rabbitmq.logging_queue;
    await channel.assertQueue(queue, { durable: false });
    try {
      await channel.sendToQueue(queue, Buffer.from(msg));
      console.log('msg send successfully!');
    } catch (err) {
      console.log(err);
    }

    await channel.close();
    await connection.close();
    return;
  }


  async connect(options, connectAttempts) {
    let connection = null;
    if (connection) return connection;
    try {
      // const configure = {
      //   protocol: 'amqp',
      //   hostname: 'kintergration.chinacloudapp',
      //   port: 5672,
      //   username: 'dev_200',
      //   password: 'dev_200',
      //   // locale: 'en_US',
      //   frameMax: 0,
      //   heartbeat: 0,
      //   vhost: '/dev',
      // };
      connection = await amqp.connect(options.uri);
      console.log('here--------------------------->');
      connection.on('close', () => {
        connection = null;
        process.emitWarning('RabbitMQ-Connection-closed');
      });
      connection.on('error', error => {
        connection = null;
        process.emitWarning('RabbitMQ-Connection-error', { code: 'RabbitMQ-Connection-error', detail: error });
      });
      return connection;
    } catch (error) {
      console.log(error);
      if (++connectAttempts <= options.connectRetries || options.connectRetries === -1) {
        // await Promise.delay(options.connectRetryInterval);
        return this.connect(options);
      }
      throw error;
    }
  }

  // amqp.connect(config.rabbitmq.URI).then(function(conn) {
  //   // 创建通道，让when立即执行promise
  //   return when(conn.createChannel().then(function(ch) {
  //     const q = config.rabbitmq.logging_queue;
  //     const msg = ctx.request.body;
  //     // 监听q队列，设置持久化为false。
  //     return ch.assertQueue(q, { durable: false }).then(function(_qok) {
  //       // 监听成功后向队列发送消息，这里我们就简单发送一个字符串。发送完毕后关闭通道。
  //       ch.sendToQueue(q, new Buffer(msg));
  //       console.log(" [x] Sent '%s'", msg);
  //       return ch.close();
  //     });
  //   })).ensure(function() { // ensure是promise.finally的别名，不管promise的状态如何都会执行的函数
  //     // 这里我们把连接关闭
  //     conn.close();
  //   });
  // }).then(null, console.warn);
  // }


  async subscribe() {
    const consumer = new MessageConsumer();
    consumer.subscribe();
  }
}

module.exports = HomeService;
