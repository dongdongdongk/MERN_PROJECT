import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {

    const {isLoading, error, sendRequest , clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState([]); // 로드된 사용자 목록

    useEffect(() => {
        // 컴포넌트가 마운트될 때 실행되는 useEffect 함수
        const fetchUsers = async () => {
            // 비동기 함수 정의: API에 데이터 요청 및 처리
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData);


            } catch (error) {

            }

        }

        fetchUsers();
        // useEffect가 처음 호출될 때 한 번 실행
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
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
