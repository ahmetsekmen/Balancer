const http = require('http');
const path = require('path');
const express = require('express');
const { config } = require('./config');
const routeInitialize = require('./routes');
const cronService = require('./services/cron.service');
const dbInitialize = require('./services/db.initialize');

// Create Express App
const app = express();

// Create Http Server
const server = http.createServer(app);

// Wide-open CORS configuration (change before this is considered production-ready)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Set Body-Parser
app.use(require('morgan')('dev'));
app.use(require('body-parser').urlencoded({ limit: '50mb', extended: true }));
app.use(require('body-parser').json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(require('cookie-parser')());

app.use(express.static(path.join(__dirname, '/public'))); //eslint-disable-line

// DB Initialize
dbInitialize(app);
// Run Cron Service
cronService();
// Initialize Router
routeInitialize(app);

server.listen(config.app.port, () => {
  console.log(`Server listening at port ${config.app.port}`);
});
