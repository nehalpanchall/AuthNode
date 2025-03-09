import express from 'express';

const app = express();
const PORT = 3300;

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
