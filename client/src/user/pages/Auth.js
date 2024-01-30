import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators'
import { AuthContext } from "../../shared/context/auth-context";

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);

    // 로그인 및 회원 가입을 위한 상태 및 커스텀 훅 초기화
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
    }, false);

    // 로그인 및 회원 가입 모드 전환
    const switchModeHandler = () => {
        if (!isLoginMode) {
            // 회원 가입 모드에서 로그인 모드로 전환 시, 이름 입력 필드 추가
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            // 로그인 모드에서 회원 가입 모드로 전환 시, 이름 입력 필드 제거
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    // 로그인 또는 회원 가입 시도
    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            // 로그인 모드일 때
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user._id);
            } catch (error) {
                // 오류 발생 시
            }
        } else {
            // 회원 가입 모드일 때
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user._id);
            } catch (error) {
                // 오류 발생 시
            }
        }
    };

    return (
        <>
            {/* HTTP 요청 오류를 표시하는 모달 및 로딩 스피너 */}
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}

            {/* 로그인/회원 가입 양식 */}
            <Card className="authentication">
                <h1>Login Required</h1>
                <hr />

                {/* 로그인/회원 가입 양식 */}
                <form onSubmit={authSubmitHandler}>
                    {/* 회원 가입 모드에서만 보이는 이름 입력 필드 */}
                    {!isLoginMode && (
                        <Input
                            element='input'
                            id='name'
                            type='text'
                            label='Name'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        />
                    )}

                    {/* 이메일 및 비밀번호 입력 필드 */}
                    <Input
                        element='input'
                        id='email'
                        type='email'
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element='input'
                        id='password'
                        type='password'
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password at least 5 Ch."
                        onInput={inputHandler}
                    />

                    {/* 로그인/회원 가입 버튼 */}
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>

                {/* 로그인/회원 가입 모드 전환 버튼 */}
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </>
    )
}

export default Auth;