
const express = require('express');

const app = express();

app.use(express.static('./dist/tic-tac-toe'));

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'dist/tic-tac-toe/' }
  );
});

app.listen(process.env.PORT || 8080);
