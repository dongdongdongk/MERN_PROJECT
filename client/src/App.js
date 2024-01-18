import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
const App = () => {
  return (
    <>
      <MainNavigation />
      <main>
        <Routes>
          <Route path='/' element={<Users />} />
          <Route path='/places/new' element={<NewPlace />} />
          {/* 다른 페이지로 이동하려 하면 리다이렉트 */}
          <Route path='*' element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
