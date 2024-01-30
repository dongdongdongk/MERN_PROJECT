import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    // useParams() 함수를 사용하여 현재 경로의 URL 매개변수에서 userId를 추출합니다.

    // 예전에 내가 쓰던방법
    // const params = useParams()
    // const userId = params.userId

    // 더 짧은 새로운 방법
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (error) {

            }
        }
        fetchPlaces();
    }, [sendRequest, userId])

    // PlaceList 컴포넌트에 전달할 데이터로 사용될 loadedPlaces를 가진 JSX를 반환합니다.
    // PlaceList 컴포넌트는 이 데이터를 받아서 해당 사용자가 생성한 장소들을 표시합니다.
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
        </>
    );


}

export default UserPlaces;