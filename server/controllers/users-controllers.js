const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password'); // - 는 제외하고 password 제외하고 불러오기 
    } catch (err) {
        const error = HttpError("유저 정보를 불러오지 못했습니다", 500);
        return next(error)
    }
    res.json(users)
}


const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError(`${errors.errors[0].path}는 비어있을 수 없습니다`, 422) // 에러가 배열로 나와서 처번째 인덱스만 출력했다 나중에 수정이 필요할듯
        return next(error);
    }

    const { name, email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError("회원가입 실패", 500)
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError("이미 유저가 있습니다.", 422)
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://cdn.coindeskkorea.com//news/photo/202102/72702_10249_4844.jpg',
        password,
        places : []
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('회원 저장에 오류가 발생했습니다', 500)
        return next(error);
    }


    res.status(201).json({ user: createdUser })
}


const login = async (req, res, next) => {
    // 1. 요청 바디에서 이메일과 비밀번호 추출
    const { email, password } = req.body;

    let existingUser;
    try {
        // 2. 데이터베이스에서 해당 이메일을 가진 사용자 찾기
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        // 3. 데이터베이스 조회 중 에러가 발생한 경우, 500 상태코드로 에러 응답
        const error = new HttpError("로그인 실패", 500);
        return next(error);
    }

    // 4. 찾은 사용자가 없거나 비밀번호가 일치하지 않는 경우, 401 상태코드로 에러 응답
    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError("유저 정보가 틀립니다", 401);
        return next(error);
    }

    // 5. 로그인이 성공한 경우, 성공 메시지를 JSON 형태로 응답
    res.json({ message: '로그인 성공' });
}


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;