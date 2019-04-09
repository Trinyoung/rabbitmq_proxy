'use strict';
const Service = require('egg').Service;
const amqp = require('amqplib');

const _ = require('lodash');
class HomeService extends Service {
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
      // const key = keys[msg.category];
      const q = 'logging_queue';
      if (q) {
        msg = _.omit(msg, [ 'category' ]);
        msg = JSON.stringify(msg);
        try {
          await channel.publish(exchange, q, Buffer.from(msg));
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
