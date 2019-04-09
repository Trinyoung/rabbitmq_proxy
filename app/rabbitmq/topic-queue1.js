'use strict';

const Subscription = require('egg').Subscription;
const request = require('request');
class MessageConsumer extends Subscription {
  async subscribe(message) {
    const { fields, properties, content } = message;
    console.log('Please consume1 this message', fields, properties, content.toString());
    const path = 'http://192.168.0.102:3000/home';
    console.log(this.ctx, '--------------------->');
    request({
      url: path,
      method: 'POST',
      json: true,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(message)
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body, '------------------------------->');
      }
    });
  }
}
module.exports = MessageConsumer;
