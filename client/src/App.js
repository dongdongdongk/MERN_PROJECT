import React, { useState, useCallback } from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  // 로그인 상태와 사용자 ID를 관리하는 상태
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);

  // useCallback을 사용한 로그인 함수
  const login = useCallback((userId,token) => {
    setToken(token);
    setUserId(userId);
  }, []);

  // useCallback을 사용한 로그아웃 함수
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

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
        token : token,
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
