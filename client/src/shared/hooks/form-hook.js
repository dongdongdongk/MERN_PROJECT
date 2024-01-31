import { useCallback, useReducer } from 'react';

// formReducer: useReducer에 사용될 리듀서 함수
const formReducer = (state, action) => {
  switch (action.type) {
    // INPUT_CHANGE 액션: 입력 요소의 변경을 처리
    case 'INPUT_CHANGE':
      // 기본적으로 폼은 유효하다고 가정하고 시작
      let formIsValid = true;
      
      // 현재 상태의 모든 입력 요소에 대해 반복
      for (const inputId in state.inputs) {
        // 만약 현재의 inputId가 undefined이면(즉, 입력 요소가 없으면) continue로 건너뛴다.
        if (!state.inputs[inputId]) {
          continue;
        }

        // 현재의 inputId가 액션에서 전달된 inputId와 일치하면
        if (inputId === action.inputId) {
          // 현재 입력 요소의 유효성을 action에서 전달된 값으로 업데이트
          formIsValid = formIsValid && action.isValid;
        } else {
          // 현재 입력 요소의 유효성을 유지
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      // 업데이트된 입력 값 및 유효성을 포함하여 상태 업데이트
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };

    // SET_DATA 액션: 초기 데이터로 상태를 설정
    case 'SET_DATA':
      // 액션에서 전달된 입력 데이터 및 폼 유효성으로 상태 업데이트
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };

    // 기본 케이스: 상태 변경 없음
    default:
      return state;
  }
};

// useForm 커스텀 훅 정의
export const useForm = (initialInputs, initialFormValidity) => {
  // useReducer를 사용하여 formReducer와 초기 상태 설정
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  // 입력 요소 변경 이벤트 핸들러 정의
  const inputHandler = useCallback((id, value, isValid) => {
    // INPUT_CHANGE 액션 디스패치
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  // 초기 데이터로 상태를 설정하는 함수 정의
  const setFormData = useCallback((inputData, formValidity) => {
    // SET_DATA 액션 디스패치
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  // 커스텀 훅 반환
  return [formState, inputHandler, setFormData];
};
