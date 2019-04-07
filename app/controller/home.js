'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async send() {
    const { ctx } = this;
    await ctx.service.home.send();
  }

  async subscribe() {
    const { ctx } = this;
    await ctx.service.home.subscribe();
  }
}

module.exports = HomeController;
