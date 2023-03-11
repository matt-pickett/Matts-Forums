require('dotenv').config();
const app = require('express')();
const PORT = 3001;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import routes
const postsRoutes = require('./routes/posts');

// Define middleware
app.use(cors())
app.use(bodyParser.json()); // For every request run bodyParser
app.use('/posts', postsRoutes)

// Connect to database
mongoose.set('strictQuery', true);
mongoose.connect(
  process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  )
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));

// Set up Auth0
const { auth, requiresAuth } = require('express-openid-connect');


// Verify that required dependencies are installed
try {
  require.resolve('express-openid-connect');
} catch (error) {
  console.error('Please install the express-openid-connect package:', error);
  process.exit(1);
}

// Verify that environment variables are set up correctly
if (!process.env.ISSUER_BASE_URL || !process.env.BASE_URL || !process.env.CLIENT_ID || !process.env.SECRET) {
  console.error('Please set up the required environment variables for authentication.');
  process.exit(1);
}

// Verify that the app object is defined
if (!app) {
  console.error('Please define the app object before using the auth middleware.');
  process.exit(1);
}

// Set up the auth middleware with the appropriate options
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

// Verify that the middleware options are set up correctly
if (!app._router.stack.some(layer => layer.name === 'openid')) {
  console.error('Please check the auth middleware options and try again.');
  process.exit(1);
}

app.get('/status', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged In' : 'Logged Out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});