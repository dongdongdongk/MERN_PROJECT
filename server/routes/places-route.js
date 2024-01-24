const express = require('express');

// Express의 Router를 사용하여 새로운 라우터를 생성합니다.
const router = express.Router();

// 더미 데이터로 사용할 장소 정보를 정의합니다.
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire',
        description: 'One of the famous',
        imageUrl: 'https://blog.btcc.com/wp-content/uploads/2022/10/2022102705575983912_1666817880.png',
        address: '무학공원',
        location: {
            lat: 35.824981,
            lng: 128.639735
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire',
        description: 'One of the famous',
        imageUrl: 'https://blog.btcc.com/wp-content/uploads/2022/10/2022102705575983912_1666817880.png',
        address: '무학공원',
        location: {
            lat: 35.824981,
            lng: 128.639735
        },
        creator: 'u2'
    }
]

// /api/places/:pid 라우트를 처리하는 미들웨어 함수입니다.
router.get('/:pid', (req, res, next) => {
    // 요청 파라미터에서 장소 ID를 추출합니다.
    const placeId = req.params.pid;

    // DUMMY_PLACES 배열에서 해당 ID와 일치하는 장소를 찾습니다.
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        const error = new Error('장소를 찾을 수 없습니다')
        error.code = 404;
        return next(error);
    }

    // 찾은 장소를 JSON 형태로 응답합니다.
    res.json({ place });
});

// /api/places/user/:uid 라우트를 처리하는 미들웨어 함수입니다.
router.get('/user/:uid', (req, res, next) => {
    // 요청 파라미터에서 사용자 ID를 추출합니다.
    const userId = req.params.uid;

    // DUMMY_PLACES 배열에서 해당 사용자가 작성한 장소를 찾습니다.
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });

    if (!place) {
        const error = new Error('유저를 찾을 수 없습니다')
        error.code = 404;
       return next(error); // return 이 없으면 아래 res 가 실행되서 {} 가 반환된다 
    }

    // 찾은 장소를 JSON 형태로 응답합니다.
    res.json({ place });
});

// 라우터를 모듈로 내보냅니다.
module.exports = router;
