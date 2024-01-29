import { useCallback, useState, useEffect, useRef } from "react";

export const useHttpClient = () => {
    // 로딩 상태를 관리하는 useState 훅
    const [isLoading, setIsLoading] = useState(false);
    // 에러 상태를 관리하는 useState 훅
    const [error, setError] = useState();

    // 현재 진행 중인 HTTP 요청들을 추적하기 위한 useRef 훅
    const activeHttpRequests = useRef([]);

    // HTTP 요청을 보내는 함수
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        // 요청을 보내기 전에 로딩 상태를 true로 설정
        setIsLoading(true);
        // AbortController를 사용하여 중간에 요청을 취소할 수 있도록 설정
        const httpAbortController = new AbortController();
        // 현재 진행 중인 HTTP 요청들을 추적하기 위해 배열에 추가
        activeHttpRequests.current.push(httpAbortController);

        try {
            // fetch 함수를 사용하여 서버에 요청을 보냄
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal  // AbortController의 signal을 이용하여 중간에 요청을 취소할 수 있도록 함
            });

            // 서버로부터 받은 응답을 JSON 형태로 파싱
            const responseData = await response.json();

            // 리스트를 깔끔하게 유지하기 위해 사용되는 코드
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController)

            // 응답이 성공적이지 않으면 에러를 던짐
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);

            // 성공한 경우 응답 데이터를 반환
            return responseData;

        } catch (error) {
            // 요청 도중에 에러가 발생하면 에러 상태를 업데이트
            setError(error.message);
            setIsLoading(false);
            throw error;
        }
    }, []);

    // 에러를 지우는 함수
    const clearError = () => {
        setError(null);
    };

    // 컴포넌트가 언마운트되거나 업데이트 되기 전에 실행되는 클린업 로직
    useEffect(() => {
        return () => {
            // 언마운트되기 전에 현재 진행 중인 HTTP 요청들을 취소
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    // isLoading, error, sendRequest, clearError를 반환하여 컴포넌트에서 사용할 수 있게 함
    return { isLoading, error, sendRequest, clearError };
};
