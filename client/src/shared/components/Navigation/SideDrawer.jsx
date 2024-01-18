// React 및 ReactDOM 라이브러리를 import
import React from "react";
import ReactDOM from "react-dom";

// react-transition-group 라이브러리에서 CSSTransition 컴포넌트를 import
import { CSSTransition } from 'react-transition-group'

// SideDrawer.css 파일에서 스타일을 import
import './SideDrawer.css'

// SideDrawer 함수형 컴포넌트 정의
const SideDrawer = (props) => {
    // 1. JSX로 사이드 드로어의 콘텐츠를 정의
    const content =
        <CSSTransition 
            in={props.show}            // 드로어의 표시 여부를 결정하는 props
            timeout={200}               // 애니메이션 효과의 지속 시간 (200ms)
            classNames="slide-in-left"  // 적용할 CSS 클래스 이름
            mountOnEnter                // 드로어가 나타날 때 DOM에 추가
            unmountOnExit               // 드로어가 사라질 때 DOM에서 제거
        >
            {/* aside 태그로 감싼 드로어 콘텐츠 */}
            <aside className="side-drawer">{props.children}</aside>
        </CSSTransition>

    // 2. 렌더링할 위치의 DOM 요소 선택
    const portalRoot = document.getElementById("drawer-hook");

    // 3. ReactDOM.createPortal을 사용하여 콘텐츠를 렌더링할 위치와 방법을 설정하고 반환
    return (
        ReactDOM.createPortal(content, portalRoot)
    )
}

// SideDrawer 컴포넌트를 내보내기
export default SideDrawer;