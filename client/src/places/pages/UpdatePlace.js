import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UpdatePlace = () => {
  // useNavigate 훅을 사용하여 페이지 간 이동을 담당하는 navigate 함수 호출
  const navigate = useNavigate();

  // AuthContext에서 사용자 정보를 가져옴
  const auth = useContext(AuthContext);

  // useHttpClient 훅을 통해 로딩 상태 및 에러 처리에 관련된 함수들을 가져옴
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // 로드된 장소 데이터를 저장하는 state
  const [loadedPlaces, setLoadedPlaces] = useState();

  // URL 파라미터에서 placeId 추출
  const placeId = useParams().placeId;

  // useForm 훅을 사용하여 양식 상태 및 관련 함수 초기화
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  // useEffect를 사용하여 페이지 로딩 시 특정 장소의 데이터를 가져오는 비동기 함수 호출
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // sendRequest 함수를 사용하여 특정 장소의 데이터 가져오기
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
        
        // 가져온 데이터로 loadedPlaces state 업데이트
        setLoadedPlaces(responseData.places);

        // 가져온 데이터를 사용하여 폼 데이터 업데이트
        setFormData(
          {
            title: {
              value: responseData.places.title,
              isValid: true
            },
            description: {
              value: responseData.places.description,
              isValid: true
            }
          },
          true
        );
      } catch (error) {
        // 오류 발생 시 처리
      }
    };

    // 페이지 로딩 시 fetchPlaces 함수 호출
    fetchPlaces();
  }, [sendRequest, placeId, setFormData]);

  // 장소 업데이트를 위한 submit 핸들러
  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      // sendRequest 함수를 사용하여 장소 업데이트 요청 보내기
      await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }),
        {
          'Content-Type': 'application/json'
        }
      );

      // 업데이트 성공 시 사용자를 해당 사용자의 장소 개요 페이지로 리디렉션
      navigate('/' + auth.userId + '/places');
    } catch (error) {
      // 오류 발생 시 처리
    }
  };

  // 로딩 중일 때 LoadingSpinner 출력
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  // 로드된 장소가 없고 오류가 없을 때 Card 컴포넌트를 사용한 메시지 출력
  if (!loadedPlaces && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  // 오류가 있을 때 ErrorModal 출력
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {/* 로딩 중이 아니고 로드된 장소가 있을 때 양식 렌더링 */}
      {!isLoading && loadedPlaces && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        {/* Input 컴포넌트를 사용하여 제목 입력란 렌더링 */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlaces.title}
          initialValid={true}
        />
        {/* Input 컴포넌트를 사용하여 설명 입력란 렌더링 */}
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlaces.description}
          initialValid={true}
        />
        {/* 장소 업데이트 버튼 */}
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>}
    </>
  );
};

export default UpdatePlace;
