const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');


// HttpError 모델을 불러와 사용합니다.
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

// 더미 데이터로 사용할 장소 정보를 정의합니다.
let DUMMY_PLACES = [
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
        id: 'p1',
        title: '지산 222',
        description: 'One of the famous44444',
        imageUrl: 'https://blog.btcc.com/wp-content/uploads/2022/10/2022102705575983912_1666817880.png',
        address: '지산공원',
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

// 특정 장소 ID에 대한 정보를 반환하는 함수입니다.
const getPlacesById = (req, res, next) => {
    // 요청 파라미터에서 장소 ID를 추출합니다.
    const placeId = req.params.pid;

    // DUMMY_PLACES 배열에서 해당 ID와 일치하는 장소를 찾습니다.
    const places = DUMMY_PLACES.filter(p => {
        return p.id === placeId;
    });

    // 만약 장소를 찾지 못했다면 HttpError를 발생시키지 않고, next 함수를 통해 에러를 전달합니다.
    if (!places || places.length === 0) {
        return next(new HttpError('장소를 찾을 수 없습니다', 404));
    }

    // 찾은 장소를 JSON 형태로 응답합니다.
    res.json({ places });
};

// 특정 사용자 ID에 대한 장소 정보를 반환하는 함수입니다.
const getPlaceByUserId = (req, res, next) => {
    // 요청 파라미터에서 사용자 ID를 추출합니다.
    const userId = req.params.uid;

    // DUMMY_PLACES 배열에서 해당 사용자가 작성한 장소를 찾습니다.
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });

    // 만약 사용자를 찾지 못했다면 HttpError를 발생시킵니다.
    if (!place) {
        return next(
            new HttpError('유저를 찾을 수 없습니다', 404)
        );
    }

    // 찾은 장소를 JSON 형태로 응답합니다.
    res.json({ place });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors)
        next( new HttpError(`${errors.errors[0].path}는 비어있을 수 없습니다`,422)) // 에러가 배열로 나와서 처번째 인덱스만 출력했다 나중에 수정이 필요할듯
    }
    
    const { title, description, address, creator } = req.body;

    let coordinates;
    
    try {
        coordinates =  await getCoordsForAddress(address)
        
    } catch (error) {
        return next(error);
    }


    const createPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createPlace);

    res.status(201).json({ place: createPlace });
}


const updatePlaceById = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError(`${errors.errors[0].path}는 비어있을 수 없습니다`,422) // 에러가 배열로 나와서 처번째 인덱스만 출력했다 나중에 수정이 필요할듯
    }
    // 요청에서 필요한 데이터를 추출합니다.
    const { title, description } = req.body;
    const placeId = req.params.pid;

    // DUMMY_PLACES 배열에서 해당 ID와 일치하는 장소를 찾아 복제합니다.
    const updatePlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };

    // DUMMY_PLACES 배열에서 해당 장소의 인덱스를 찾습니다.
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    // 복제한 장소 정보를 업데이트합니다.
    updatePlace.title = title; // 원시값이기 때문에 직접 수정이 가능합니다.
    updatePlace.description = description;

    // DUMMY_PLACES 배열에서 업데이트된 장소 정보를 저장합니다.
    DUMMY_PLACES[placeIndex] = updatePlace;

    // 클라이언트에게 업데이트된 장소 정보를 응답합니다.
    res.status(200).json({ place: updatePlace });
}

const deletePlaceById = (req, res, next) => {
    // 요청 파라미터에서 장소 ID를 추출합니다.
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError("삭제할 장소가 없습니다.",404)
    }

    // DUMMY_PLACES 배열에서 해당 ID와 일치하지 않는 장소들로 새로운 배열을 생성하여 할당합니다.
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    // 클라이언트에게 성공적인 삭제를 알리는 응답을 전송합니다.
    res.status(200).json({ message: '삭제 성공' });
}


// 외부에서 사용할 수 있도록 함수를 내보냅니다.
exports.getPlacesById = getPlacesById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;