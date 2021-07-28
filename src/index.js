const express = require('express');

var videosController = require('./controller/videos');

let app = express();

app.use(express.json());
app.use('/videos', videosController);

app.listen(3000, () => console.log("server running on port 3000"));