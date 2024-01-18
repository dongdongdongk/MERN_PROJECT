import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

const UserPlaces = () => {

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

    // useParams() 함수를 사용하여 현재 경로의 URL 매개변수에서 userId를 추출합니다.

    // 예전에 내가 쓰던방법
    // const params = useParams()
    // const userId = params.userId
    
    // 더 짧은 새로운 방법
    const userId = useParams().userId;

    // DUMMY_PLACES 배열에서 현재 사용자(userId)에 해당하는 장소들을 필터링합니다.
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

    // PlaceList 컴포넌트에 전달할 데이터로 사용될 loadedPlaces를 가진 JSX를 반환합니다.
    // PlaceList 컴포넌트는 이 데이터를 받아서 해당 사용자가 생성한 장소들을 표시합니다.
    return (
        <PlaceList items={loadedPlaces} />
    );


}

export default UserPlaces;