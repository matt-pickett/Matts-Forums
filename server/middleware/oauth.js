// Optional (not currently used) way of generating access token manually.
// Uses authorization code that auth0 sends when user signs in
// When we make fetch request in front end we would send the authorization code
// as an optional query parameter and get it here
// We are currently using the 'getAccessTokenSilently' method in client which does this for us

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow
var axios = require("axios");

const tokenEndpoint = `${process.env.ISSUER_BASE_URL}/oauth/token`;

 oAuth = (req, res, next) => {
  console.log("request in oAuth:", req)

  var code = req.query.code;

  if(!code) {
    res.status(401).send("Missing authorization code");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.SECRET)
  params.append("code", code);
  params.append("redirect_uri", process.env.BASE_URL);

  axios.post(tokenEndpoint, params)
  .then(response => {
    req.oauth = response.data;
    console.log("axios made token:", req.oauth);
    next();
  })
  .catch(err => {
    console.log(err);
    res.status(403).json(`Error: ${err.message}`);
  })
}

module.exports = oAuth;


// For example, we would have a request run this middleware to generate the token
// Then we would have that request call a second request with the token
// With middleware to see if it is valid

// First request (generates token, calls second request)
// router.post('/', oAuth, async (req, res) => {
//     try {
//     const { access_token } = req.oauth;
//     const data = {
//       "title": "sample",
//       "description": "test",
//       "username": "me",
//       "user_id": 12345,
//       "lastUpdated": "4:34PM"
//     }
//     const response = await axios({
//       method: "post",
//       url: 'http://localhost:3001/posts/protected',
//       headers: { Authorization: `Bearer ${access_token}` },
//       data: data
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.log(error);
//     if (error.response.status === 401) {
//       res.status(401).json("Unauthorized to access data");
//     } else if (error.response.status === 403) {
//       res.status(403).json("Permission denied");
//     } else {
//       res.status(500).json("Whoops, something went wrong");
//     }
//   }
// });

// Second request (validates token, performs request)
// router.post('/protected', jwtCheck, async (req, res) => {
//     // console.log("request:",req)
//     const newPost = new Post({
//         title: req.body.title,
//         description: req.body.description,
//         username: req.body.username,
//         user_id: req.body.user_id,
//         lastUpdated: req.body.lastUpdated
//     });
//     try {
//         const savedPost = await newPost.save();
//         res.json(savedPost);
//     }catch(error) {
//         res.json({ message: error });
//     }
// });