// Express 프레임워크를 가져옵니다.
const express = require('express');
const { check } = require('express-validator');


const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()// Test@test.com => test@test.com 변환
            .isEmail(), // 이메일인지 형식 확인
        check('password')
            .isLength({min : 6})
    ]

    , usersController.signup);

router.post('/login', usersController.login);


// 라우터를 모듈로 내보냅니다.
module.exports = router;
