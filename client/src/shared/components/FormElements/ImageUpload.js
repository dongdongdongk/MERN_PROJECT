import React, { useRef, useState, useEffect } from "react";

// useRef를 사용하여 파일 선택기 엘리먼트를 참조할 수 있게 선언
import './ImageUpload.css'

// 이미지 업로드 컴포넌트에서 사용할 외부 스타일 파일 및 Button 컴포넌트를 import
import Button from "./Button";

// ImageUpload 컴포넌트 선언
const ImageUpload = (props) => {

    const [file, setFile] = useState();
    // 미리보기 상태 
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    // useRef 훅을 사용하여 파일 선택기 엘리먼트를 참조
    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        // 브라우저 내장 API 파일 미리보기 기능 파일을 읽는 것과 파일의 구문 분석을 돕는다
        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file]);

    // 파일 선택기 열기를 처리하는 함수
    const pickImageHandler = () => {
        // useRef로 참조한 파일 선택기 엘리먼트의 click 메서드 호출
        filePickerRef.current.click();
    }

    // 파일 선택 시 실행되는 핸들러
    const pickHandler = (event) => {
        let pickedFile
        let fileIsValid = isValid;
        // 파일이 있는지 없는지 확인 ( 이앱은 파일을 하나만 허용 )
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile)
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid(false);
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    // 컴포넌트 렌더링
    return (
        <div className="form-control">
            {/* 파일 선택기 엘리먼트 */}
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type='file'
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}
            />

            {/* 이미지 업로드 영역 */}
            <div className={`image-upload ${props.center && 'center'} `}>
                {/* 이미지 미리보기 영역 */}
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>이미지를 선택하세요</p>}
                </div>

                {/* "PICK IMAGE" 버튼 */}
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

// ImageUpload 컴포넌트를 외부에서 사용할 수 있도록 export
export default ImageUpload;