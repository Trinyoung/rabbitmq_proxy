'use strict';
const Service = require('egg').Service;
const amqp = require('amqplib');
const MessageConsumer = require('../rabbitmq/topic-queue1');
class HomeService extends Service {

  async send() {
    const { config, ctx } = this;
    const msg = ctx.request.body;
    const options = {
      connectRetries: 5
    };
    const connection = await this.connect(config.rabbitmq.URI, options);
    const channel = connection.createChannel();
    const queue = config.rabbitmq.logging_queue;
    await channel.assertQueue(queue, { durable: false });
    try {
      await channel.sendToQueue(queue, new Buffer(msg));
    } catch (err) {
      console.log(err);
    }

    await channel.close();
    await connection.close();
  }


  async connect(uri, options) {
    let connection = null;
    let connectAttempts = 1;
    if (connection) return connection;
    try {
      connection = await amqp.connect(uri);
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
      if (++connectAttempts <= options.connectRetries || options.connectRetries === -1) {
        await Promise.delay(options.connectRetryInterval);
        return this.connect();
      }
      throw error;
    }
  }


  // async destroy() {
  //   const conn = await this.connect();
  //   return conn.close();
  // }

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
