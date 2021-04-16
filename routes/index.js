const balancerRouter = require('./balancer');

module.exports = function (app) {
  app.use('/balancer', balancerRouter);
};
