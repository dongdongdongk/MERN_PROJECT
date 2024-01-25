const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'dhk93091111',
        name: '김동현1111',
        email: 'test@gmail.com1111',
        password: "123451111"
    },
    {
        id: 'dhk93092222',
        name: '김동현2222',
        email: 'test@gmail.com2222',
        password: "123452222"
    },
    {
        id: 'dhk93093333',
        name: '김동현3333',
        email: 'test@gmail.com3333',
        password: "123453333"
    }
]



const getUsers = (req, res, next) => {

    res.json({ users: DUMMY_USERS });

}


const signup = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError(`${errors.errors[0].path}는 비어있을 수 없습니다`, 422) // 에러가 배열로 나와서 처번째 인덱스만 출력했다 나중에 수정이 필요할듯
    }

    const { name, email, password } = req.body

    const haUser = DUMMY_USERS.find(u => u.email === email)

    if (haUser) {
        throw new HttpError("이미 유저가 있습니다.", 422)
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser })
}


const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email)

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("로그인에 실패 했습니다 (없는 유저)", 401)
    }
    res.json({ message: '로그인 성공' })
}


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;