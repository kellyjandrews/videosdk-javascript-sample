const express = require('express');
const dotenv = require('dotenv');
const { generateToken } = require('./auth.js');
dotenv.config();

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', `${process.cwd()}/src/views`);
app.use(
  express.static(`${process.cwd()}/src/public`, {
    setHeaders: (res) => {
      res.set('Cross-Origin-Opener-Policy', 'same-origin');
      res.set('Cross-Origin-Embedder-Policy', 'require-corp');
    }
  })
);

app.use('/zoom', express.static(`${process.cwd()}/node_modules/@zoom/videosdk/dist`));
app.use('/rawjs', express.static(`${process.cwd()}/node_modules/@squaresapp/rawjs`));
app.use('/ejs', express.static(`${process.cwd()}/node_modules/ejs/`));

app.get('/', async (req, res) => {
  // allow for password
  // check if session is during current time or if in past/future
  let sessionName = req.query.s;
  let displayName = req.query.dn;
  let roleType = parseInt(req.query.r);

  let config = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    sdkSecret: process.env.ZOOM_SDK_SECRET,
    topic: sessionName,
    roleType: roleType
  };

  let signature = await generateToken(config);
  res.render('index', {
    session: { sessionName, displayName, roleType, ...signature }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
