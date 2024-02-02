import { useState, useCallback, useEffect } from "react";

let logoutTimer;

const useAuth = () => {
    // 토큰, 사용자 ID, 토큰 만료 시간 상태 관리
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    // useCallback을 사용한 로그인 함수
    const login = useCallback((userId, token, expirationDate) => {
        setToken(token);
        setUserId(userId);
        // 만료 날짜 설정 또는 1시간 후로 설정
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);

        // 사용자 데이터를 Local Storage에 저장
        localStorage.setItem('userData', JSON.stringify({ userId: userId, token: token, expiration: tokenExpirationDate.toISOString }));
    }, []);

    // useCallback을 사용한 로그아웃 함수
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        // Local Storage에서 사용자 데이터 삭제
        localStorage.removeItem('userData');
    }, []);

    // 타이머를 통한 자동 로그아웃 설정
    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    // useEffect를 활용한 자동 로그인 처리
    useEffect(() => {
        // Local Storage에서 저장된 사용자 데이터 가져오기
        const storedData = JSON.parse(localStorage.getItem('userData'));

        // 저장된 데이터가 있고, 토큰이 존재하며, 만료 기간이 지나지 않았을 경우 자동 로그인
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout, userId };
}

export default useAuth