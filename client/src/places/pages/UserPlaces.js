import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
    // useState를 사용하여 loadedPlaces 상태와 setLoadedPlaces 업데이트 함수를 정의합니다.
    const [loadedPlaces, setLoadedPlaces] = useState();

    // useHttpClient 훅을 사용하여 HTTP 요청과 관련된 상태 및 함수들을 가져옵니다.
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    // useParams() 함수를 사용하여 현재 경로의 URL 매개변수에서 userId를 추출합니다.
    const userId = useParams().userId;

    // useEffect를 사용하여 컴포넌트가 렌더링 될 때 한 번만 실행되는 비동기 함수를 정의합니다.
    useEffect(() => {
        // fetchPlaces 함수 내에서 HTTP 요청을 보내고 응답 데이터를 처리합니다.
        const fetchPlaces = async () => {
            try {
                // sendRequest 함수를 사용하여 백엔드로 Get 요청을 보내고 응답 데이터를 받아옵니다.
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`);

                // 받아온 데이터 중 places 키의 값을 loadedPlaces 상태에 업데이트합니다.
                setLoadedPlaces(responseData.places);
            } catch (error) {
                // 오류가 발생한 경우 여기에서 오류 처리를 추가할 수 있습니다.
            }
        }

        // 컴포넌트가 렌더링 될 때 fetchPlaces 함수를 호출하여 데이터를 가져옵니다.
        fetchPlaces();
    }, [sendRequest, userId]); // useEffect의 의존성 배열에 sendRequest와 userId를 추가하여 해당 값이 변경될 때마다 useEffect를 다시 실행합니다.

    // 삭제 후 새로고침을 위한 함수 
    const placeDeletedHandler = (deletePlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place._id !== deletePlaceId))
    }
    // 반환되는 JSX에서는 ErrorModal, LoadingSpinner, PlaceList 등을 조건부로 렌더링합니다.
    return (
        <>
            {/* ErrorModal 컴포넌트를 사용하여 오류가 있을 경우 모달을 표시합니다. */}
            <ErrorModal error={error} onClear={clearError} />

            {/* 로딩 중일 경우 LoadingSpinner를 표시합니다. */}
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}

            {/* 로딩 중이 아니고 loadedPlaces가 존재하는 경우 PlaceList 컴포넌트를 렌더링합니다. */}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </>
    );
}

// UserPlaces 컴포넌트를 내보냅니다.
export default UserPlaces;
