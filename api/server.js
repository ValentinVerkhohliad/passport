import express from 'express';
import Cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import helmet from 'helmet';
import CONFIG from "./config"

const app = express();

const API_PORT = process.env.API_PORT || 3000;

const swaggerDefinition = {
  info: {
    title: 'MySQL Registration Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test the user registration routes',
  },
  host: `${CONFIG.HOST}`,
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

require('./config/passport');

const whitelist = [
  'http://localhost:3031',
  'http://localhost:3000',
  `${CONFIG.BASE_URL}`,
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(Cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(helmet());
app.use(passport.initialize());

require('./routes/loginUser')(app);
require('./routes/registerUser')(app);
require('./routes/forgotPassword')(app);
require('./routes/resetPassword')(app);
require('./routes/updatePassword')(app);
require('./routes/updatePasswordViaEmail')(app);
require('./routes/findUsers')(app);
require('./routes/deleteUser')(app);
require('./routes/updateUser')(app);

// eslint-disable-next-line no-console
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

module.exports = app;
