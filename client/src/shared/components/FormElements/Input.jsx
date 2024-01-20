import React, { useEffect, useReducer } from "react";

import { validate } from '../../util/validators';
import './Input.css'

// Input 컴포넌트는 다양한 입력 요소를 렌더링합니다.
const inputReducer = (state, action) => {
    // useReducer로 상태를 관리하는 함수입니다.
    switch (action.type) {
        case 'CHANGE':
            // CHANGE 액션일 경우, 새로운 상태를 반환합니다.
            return {
                ...state,
                value: action.val, // 입력 값 업데이트
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH' : {
            return {
                ...state,
                isTouched : true
            }
        }
        default:
            return state; // 기본적으로 현재 상태를 그대로 반환합니다.
    }
}
const Input = (props) => {
    const touchHandler = () => {
        dispatch({
            type : "TOUCH"
        });
    }
    // useReducer를 사용하여 inputState 상태와 dispatch 함수를 얻습니다.
    const [inputState, dispatch] = useReducer(inputReducer, { 
        value: '', 
        isValid: false,
        isTouched : false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid)

    },[id, value, isValid, onInput]);


    const changeHandler = (event) => {
        // CHANGE 액션을 dispatch 하여 상태를 업데이트합니다.
        dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators });
    }

    // 입력 요소의 종류에 따라 input 또는 textarea를 선택하여 렌더링합니다.
    const element = props.element === 'input' ? (
        <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
        />
    ) : (
        <textarea
            id={props.id}
            rows={props.rows || 3}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
        />
    );

    // 입력 요소를 감싸는 form-control 클래스를 가진 div 요소를 반환합니다.
    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            {/* 입력 요소와 연결된 레이블을 표시합니다. */}
            <label htmlFor={props.id}>{props.label}</label>
            {/* 선택한 입력 요소를 렌더링합니다. */}
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}

export default Input;