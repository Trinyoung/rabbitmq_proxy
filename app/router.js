'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.post('/send', controller.home.send);
  router.post('/publish', controller.home.publish);
};
