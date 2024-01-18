import React from 'react';

import './Card.css';

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {/* 해당 컴포넌트가 사용될 때 컴포넌트 태그 사이에 작성된 내용들이 props.children으로 전달 */}
      {props.children} 
    </div>
  );
};

export default Card;



