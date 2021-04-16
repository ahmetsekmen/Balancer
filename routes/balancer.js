const express = require('express');

const router = express.Router();
const balancer = require('../controllers/balancer');

router.get('/', balancer.getBalancerTokenInfos);
router.get('/info', balancer.getBalancerTokenInfo);

module.exports = router;
