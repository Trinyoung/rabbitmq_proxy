'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  // async send() {
  //   const { ctx } = this;
  //   try {
  //     await ctx.service.home.send();
  //     ctx.body = {
  //       code: 200,
  //       message: 'OK'
  //     };
  //   } catch (err) {
  //     ctx.body = {
  //       code: 500,
  //       error: err
  //     };
  //   }
  // }

  async publish() {
    const { ctx } = this;
    const result = await ctx.service.home.publish();
    ctx.body = result;
    // try {
    //   await ctx.service.home.publish();
    //   ctx.body = {
    //     code: 200,
    //     message: 'OK'
    //   };
    // } catch (err) {
    //   ctx.body = {
    //     code: 500,
    //     message: err
    //   };
    // }
  }
}

module.exports = HomeController;
