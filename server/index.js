require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Verify that environment variables are set up correctly
if (!process.env.DATABASE_URL) {
  console.error('Please set up the required environment variables for the database.');
  process.exit(1);
}

// Connect to database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));

// Verify that required dependencies are installed
try {
  require.resolve('express-openid-connect');
} catch (error) {
  console.error('Please install the express-openid-connect package:', error);
  process.exit(1);
}

// Verify that environment variables are set up correctly for Auth0
if (!process.env.ISSUER_BASE_URL || !process.env.BASE_URL || !process.env.CLIENT_ID || !process.env.SECRET) {
  console.error('Please set up the required environment variables for authentication.');
  process.exit(1);
}

// Define middleware
app.use(cors())
app.use(bodyParser.json()); // For every request run bodyParser

// Import routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

// Verify that the app object is defined
if (!app) {
  console.error('Please define the app object before using the auth middleware.');
  process.exit(1);
}

// Set up Auth0 middleware with the appropriate options
const { auth, requiresAuth } = require('express-openid-connect');
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

// Verify that the auth middleware is set up correctly
// if (!app._router.stack.some(layer => layer.name === 'openid')) {
//   console.error('Please check the auth middleware options and try again.');
//   process.exit(1);
// }

// Define routes
app.get('/status', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged In' : 'Logged Out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = app;
