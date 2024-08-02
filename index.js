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


import cors from 'cors'
import express from 'express';
import users from './routes/users.js';
import data from './routes/data.js';
import institutions from './routes/institutions.js';
import deaneries from './routes/deaneries.js';
import vicars from './routes/vicars.js';
import './loadEnvironment.mjs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use('/users', users);
app.use('/data', data);
app.use('/institutions', institutions);
app.use('/deaneries', deaneries);
app.use('/vicars', vicars);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
