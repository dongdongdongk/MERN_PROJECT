import React, { Suspense } from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'
// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import UserPlaces from './places/pages/UserPlaces';
// import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import useAuth from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./user/pages/Users')) // 첫 페이지기 때문에 lazy 로딩이 필요없다 
const NewPlace = React.lazy(() => import('./shared/components/Navigation/MainNavigation'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const Auth = React.lazy(() => import('./user/pages/Auth'))

const App = () => {
  const { token, login, logout, userId } = useAuth()

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
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner/>
            </div>
          }>
            {/* 라우트 설정 */}
            <Routes>
              {routes}
            </Routes>
          </Suspense>
        </main>
      </>
    </AuthContext.Provider>
  );
}

export default App;
