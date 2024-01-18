import React, { useState } from "react";
import { Link } from "react-router-dom"

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop"

import './MainNavigation.css'

const MainNavigation = (props) => {
    // 드로어의 열고 닫음 상태를 관리하는 useState 선언
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    // 드로어 열기 함수
    const openDrawer = () => {
        setDrawerIsOpen(true);
    }

    // 드로어 닫기 함수
    const closeDrawer = () => {
        setDrawerIsOpen(false);
    }

    return (
        <>
            {/* 드로어가 열려있을 때만 백드롭 렌더링 */}
            {drawerIsOpen && <Backdrop onClick={closeDrawer} />}

            {/* 
            SideDrawer 컴포넌트를 렌더링합니다.
            'show' prop을 통해 현재 드로어가 열려 있는지 닫혀 있는지를 전달합니다.
            만약 'drawerIsOpen' 상태가 true이면, 즉 드로어가 열려 있다면 SideDrawer가 나타납니다. */}
            <SideDrawer show={drawerIsOpen}>
                {/* SideDrawer 내부에 들어갈 내용을 정의합니다. */}
                {/* 여기서는 드로어 내비게이션의 링크를 포함한 NavLinks 컴포넌트가 들어갑니다. */}
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>



            {/* 메인 헤더 영역 */}
            <MainHeader>
                {/* 드로어를 열기 위한 메뉴 버튼 */}
                <button className="main-navigation__menu-btn" onClick={openDrawer}>
                    <span />
                    <span />
                    <span />
                </button>

                {/* 로고 또는 사이트 제목 */}
                <h1 className="main-navigation__title">
                    <Link to='/'>YourPlaces</Link>
                </h1>

                {/* 메인 내비게이션 링크 영역 */}
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    )
}

export default MainNavigation;