import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
    // 상태 설정: 데이터 로딩 여부, 에러 상태, 사용자 목록 데이터
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 여부
    const [error, setError] = useState(); // 에러 상태
    const [loadedUsers, setLoadedUsers] = useState([]); // 로드된 사용자 목록

    useEffect(() => {
        // 컴포넌트가 마운트될 때 실행되는 useEffect 함수
        const sendRequest = async () => {
            // 비동기 함수 정의: API에 데이터 요청 및 처리
            setIsLoading(true); // 로딩 중 상태 설정
            try {
                const response = await fetch('http://localhost:5000/api/users');
                // API에서 데이터를 받아오는 HTTP 요청 수행

                const responseData = await response.json();
                // HTTP 응답 데이터를 JSON 형식으로 변환


                if (!response.ok) {
                    // 응답이 성공적이지 않은 경우 (HTTP 상태 코드가 200번대가 아닌 경우)
                    throw new Error(responseData.message);
                    // 에러 객체를 던져서 catch 블록으로 이동
                }

                setLoadedUsers(responseData);
                // 로드된 사용자 목록을 상태로 설정

            } catch (error) {
                // try 블록에서 에러 발생 시 실행
                setError(error.message);
                // 에러 상태를 설정
            }
            setIsLoading(false);
            // 비동기 작업이 완료되면 로딩 상태 해제
        }

        sendRequest();
        // useEffect가 처음 호출될 때 한 번 실행
    }, []);

    const errorHandler = () => {
        // 에러 모달에서 '닫기' 버튼 클릭 시 실행되는 함수
        setError(null);
        // 에러 상태를 초기화하여 모달을 닫음
    }

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {/* 에러 모달 컴포넌트: 에러 상태가 있으면 모달을 띄움 */}
            
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {/* 로딩 스피너 표시: 데이터 로딩 중일 때 로딩 스피너를 화면 중앙에 표시 */}
    
            {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
            {/* 사용자 목록 표시: 로딩이 끝나고 로드된 사용자 목록이 있으면 UserList 컴포넌트에 전달하여 표시 */}
        </>
    )
}

export default Users;
