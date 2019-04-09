'use strict';

const Subscription = require('egg').Subscription;
class MessageConsumer extends Subscription {
  async subscribe(message) {
    const { fields, properties, content } = message;
    const { config, ctx } = this;
    const path = config.rabbitmq.pub.path;
    // console.log('Please consume1 this message', fields, properties, content.toString());
    console.log(content.toString(), '>------------+++++++----------<');
    ctx.logger.info(`Please consume this message: ${content.toString()}`);
    try {
      const result = await ctx.curl(path, {
        method: 'POST',
        dataType: 'json',
        contentType: 'json',
        data: JSON.parse(content.toString())
      });
      ctx.logger.info(`curl ${path} successfully and get result : ${JSON.stringify(result)}`);
    } catch (err) {
      ctx.logger.error(`curl ${path} failed and get err: ${JSON.stringify(err)}`);
    }
  }
}
module.exports = MessageConsumer;
