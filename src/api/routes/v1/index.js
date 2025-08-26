const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const sessionRoute = require('./session.route');
const productRoute = require('./product.route');
const pdfRoute = require('./pdf.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/sessions',
    route: sessionRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/pdf',
    route: pdfRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
