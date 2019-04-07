'use strict';

const Subscription = require('egg').Subscription;

class MessageConsumer extends Subscription {
  async subscribe(message) {
    const { fields, properties, content } = message;
    console.log('Please consume1 this message', fields, properties, content.toString());
  }
}
module.exports = MessageConsumer;
