// import express from 'express';
// import bodyParser from 'body-parser'

// const app = express();
// const PORT = 5000

// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   console.log('[GET ROUTE]');
//   res.send('HELLO FROM HOMEPAGE');
// })

// app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));


import express from 'express';
import posts from './routes/posts.js';
import './loadEnvironment.mjs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/users', posts);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
