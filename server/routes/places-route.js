// index.js

const express = require('express');

const placeControllers = require('../controllers/places-controllers')

// Express의 Router를 사용하여 새로운 라우터를 생성합니다.
const router = express.Router();


// /api/places/:pid 라우트를 처리하는 미들웨어 함수입니다.
router.get('/:pid',placeControllers.getPlaceById)

// /api/places/user/:uid 라우트를 처리하는 미들웨어 함수입니다.
router.get('/user/:uid',placeControllers.getPlaceByUserId)

// 라우터를 모듈로 내보냅니다.
module.exports = router;