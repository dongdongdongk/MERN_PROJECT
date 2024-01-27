const express = require('express');

const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/user-route');
const HttpError = require('./models/http-error');

const app = express();
// mongoose 라이브러리 불러오기
const mongoose = require('mongoose');

app.use(express.json()); // 본문 라우터 위에 있어야 한다 순서대로 읽기 때문
app.use(express.urlencoded({ extended: true }));




app.use('/api/places',placesRoutes); // => /api/places/ 로 시작하는 요청 라우팅
app.use('/api/users', usersRoutes);

// 에러 핸들링 미들웨어: 요청이 들어올 때 항상 실행되는 미들웨어입니다.
app.use((req, res, next) => {
    // HttpError 모델을 사용하여 '없는 페이지' 에러를 생성합니다.
    const error = new HttpError('없는 페이지 입니다', 404);

    // 생성한 에러를 던져서 다음 에러 핸들러로 전달합니다.
    throw error;
});

// 에러 핸들링 미들웨어: 이전에 던져진 에러를 처리하는 미들웨어입니다.
app.use((error, req, res, next) => {
    // 이미 응답이 전송되었는지 확인합니다.
    if (res.headersSent) {
        // 이미 응답이 전송된 경우 다음 에러 핸들러로 이동합니다.
        return next(error);
    }

    // 에러 응답을 전송합니다. 에러 코드가 정의되어 있지 않으면 500을 사용합니다.
    res.status(error.code || 500).json({ message: error.message || "알 수 없는 에러" });
});

// MongoDB 서버에 연결
mongoose.connect('mongodb+srv://dhk9309:kim1458@cluster0.ckluwao.mongodb.net/places?retryWrites=true&w=majority')
    .then(() => {
        console.log("데이터 베이스 연결 성공");
    })
    .catch(() => {
        console.log("데이터 베이스 연결 실패");
    });

app.listen(5000);
