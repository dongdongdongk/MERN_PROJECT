const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-route');

const app = express();


app.use('/api/places',placesRoutes); // => /api/places/ 로 시작하는 요청 라우팅

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({message : error.message || "알수없는 에러"})
})

app.listen(5000);
