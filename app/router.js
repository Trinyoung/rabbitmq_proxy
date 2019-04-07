'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/send', controller.home.send);
  router.get('/subscribe', controller.home.subscribe);
};
