'use strict';
const Service = require('egg').Service;
const amqp = require('amqplib');

const _ = require('lodash');
class HomeService extends Service {
  async publish() {
    const { ctx, config, app } = this;
    const msgs = ctx.request.body;
    const routekey = config.rabbitmq.pub.keys;
    const { instances, options } = config.rabbitmq.pub;
    const result = {
      failed: [],
      success: []
    };
    for (let msg of msgs) {
      if (instances.indexOf(msg.category) < 0) {
        result.failed.push({
          code: msg.code,
          reason: 'category is wrong'
        });
        continue;
      }
      msg = _.omit(msg, [ 'category' ]);
      let content = JSON.stringify(msg);
      content = Buffer.from(content);
      try {
        await app.rabbitmq.publisher.publish(routekey, content, options);
        ctx.logger.info(`publish msg successfully: code: ${msg.code}`);
        result.success.push({
          code: msg.code
        });
      } catch (e) {
        ctx.logger.error(`publish msg err, code: ${msg.code}, error: ${e.toString()}`);
        result.failed.push({
          code: msg.code,
          reason: e.toString()
        });
      }
    }
    return result;
  }

  async send() {
    const { config, ctx } = this;
    const msgs = ctx.request.body;

    const options = {
      uri: config.rabbitmq.URI,
      connectRetries: 5
    };
    const connection = await this.connect(options, 1);
    const channel = await connection.createChannel();
    const { exchange, type, keys } = config.rabbitmq.pub;
    try {
      await channel.assertExchange(exchange, type, { durable: false });
    } catch (err) {
      return new Error('assertExchange Error');
    }

    for (let msg of msgs) {
      const key = keys[msg.category];
      const q = 'test_log_queue2';
      if (q) {
        msg = _.omit(msg, [ 'category' ]);
        msg = JSON.stringify(msg);
        try {
          await channel.publish(exchange, key, Buffer.from(msg));
          console.log('successfully!');
        } catch (err) {
          console.error(err);
          return err;
        }
      } else {
        return new Error('invalid category');
      }
    }

    await channel.close();
    await connection.close();
    return;
  }


  async connect(options, connectAttempts) {
    let connection = null;
    if (connection) return connection;
    try {
      connection = await amqp.connect(options.uri);
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
        // await Promise.delay(options.connectRetryInterval);
        return this.connect(options);
      }
      throw error;
    }
  }

}

module.exports = HomeService;
