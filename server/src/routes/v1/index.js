const express = require('express');
// const authRoute = require('./auth.route');
// const userRoute = require('./user.route');
const resumeRoute = require('./resume.route');
const resumePDFRoute = require('./resumePDF.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  /*
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  */
  {
    path: '/resume',
    route: resumeRoute,
  },

  {
    path: '/resumePDF',
    route: resumePDFRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

// biome-ignore lint/complexity/noForEach: <explanation>
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  // biome-ignore lint/complexity/noForEach: <explanation>
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
