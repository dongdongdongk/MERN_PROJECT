import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

let logoutTimer;

const App = () => {

  // 토큰 및 사용자 ID 상태 관리
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
    setTokenExpirationDate(null)
    // Local Storage에서 사용자 데이터 삭제
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
     logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer);
    }
  },[token, logout, tokenExpirationDate]);




  // useEffect를 활용한 자동 로그인 처리
  useEffect(() => {
    // Local Storage에서 저장된 사용자 데이터 가져오기
    const storedData = JSON.parse(localStorage.getItem('userData'));

    // 저장된 데이터가 있고, 토큰이 존재하며, 만료 기간이 지나지 않았을 경우 자동 로그인
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  // 라우팅을 위한 JSX 설정
  let routes;
  if (token) {
    // 로그인한 경우의 라우트 설정
    routes = (
      <>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/places/:placeId' element={<UpdatePlace />} />
        <Route path='*' element={<Navigate replace to="/" />} />
      </>
    );
  } else {
    // 로그인하지 않은 경우의 라우트 설정
    routes = (
      <>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='*' element={<Navigate replace to="/auth" />} />
      </>
    );
  }

  // AuthContext.Provider를 사용하여 전역적으로 사용되는 사용자 정보 관리
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <>
        {/* 상단 네비게이션 바 */}
        <MainNavigation />

        {/* 메인 컨텐츠 영역 */}
        <main>
          {/* 라우트 설정 */}
          <Routes>
            {routes}
          </Routes>
        </main>
      </>
    </AuthContext.Provider>
  );
}

export default App;
