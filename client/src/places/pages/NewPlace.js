import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
  // useContext를 통해 AuthContext에서 전역 상태를 가져옴
  const auth = useContext(AuthContext);
  // useNavigate 훅을 이용하여 페이지 이동 기능을 사용할 수 있는 navigate 함수 생성
  const navigate = useNavigate();
  // useHttpClient 훅을 이용하여 HTTP 요청 관련 기능들을 사용
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  // useForm 훅을 이용하여 폼 상태 및 관련 기능들을 사용
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image : {
        value : '',
        isValid : false
      }
    },
    false
  );

  // 장소 등록 폼을 제출했을 때의 핸들러 함수
  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      // FormData를 사용하여 이미지를 포함한 폼 데이터 생성
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('creator', auth.userId)
      formData.append('image', formState.inputs.image.value)

      // useHttpClient 훅을 이용하여 서버에 POST 요청을 보냄
      const responseData = await sendRequest(
        'http://localhost:5000/api/places', 
        'POST',
        formData, 
        {
          // Authorization 헤더에 토큰을 추가하여 인증된 요청을 보냄
          Authorization : 'Bearer ' + auth.token
        }
      );
      
      // 요청이 성공하면 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      // 요청이 실패하면 에러 처리
    }
  };

  // JSX를 반환하여 컴포넌트를 렌더링
  return (
    <>
      {/* 에러 모달 컴포넌트를 사용하여 에러가 있을 경우 표시 */}
      <ErrorModal error={error} onClear={clearError} />
      {/* 폼 요소를 가지고 있는 form 태그 */}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {/* 로딩 중일 경우 로딩 스피너를 표시 */}
        {isLoading && <LoadingSpinner asOverlay />}
        {/* 입력 컴포넌트들을 사용하여 각 필드에 대한 입력을 처리 */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        {/* 이미지 업로드 컴포넌트 */}
        <ImageUpload id='image' onInput={inputHandler} errorText="이미지를 업로드 하세요" />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        {/* 제출 버튼 */}
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

// 컴포넌트를 내보내기
export default NewPlace;
