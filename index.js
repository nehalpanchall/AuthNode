import express from 'express';

const app = express();
const PORT = 4321;

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.get('/nehal', (req, res) => {
  res.send('Route to Nehal');
});

app.get('/panchal', (req, res) => {
  res.send('Route to Panchal');
});

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
