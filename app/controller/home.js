'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async send() {
    const { ctx } = this;
    try {
      await ctx.service.home.send();
      ctx.body = {
        code: 200,
        message: 'OK'
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        error: err
      };
    }
  }

  async subscribe() {
    const { ctx } = this;
    await ctx.service.home.subscribe();
  }
}

module.exports = HomeController;
