import React, { useContext, useState } from "react";

// 컴포넌트 및 훅 임포트
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

// CSS 파일 임포트
import './PlaceItem.css';

const PlaceItem = (props) => {
    // AuthContext로부터 사용자 인증 정보를 가져옴
    const auth = useContext(AuthContext);

    // useHttpClient 훅을 사용하여 HTTP 요청과 에러 처리를 담당하는 객체를 가져옴
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    // 지도 모달 열기/닫기를 위한 상태 관리
    const [showMap, setShowMap] = useState(false);

    // 삭제 확인 모달 열기/닫기를 위한 상태 관리
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 지도 모달 열기 핸들러
    const openMapHandler = () => setShowMap(true);

    // 지도 모달 닫기 핸들러
    const closeMapHandler = () => setShowMap(false);

    // 삭제 확인 모달 열기 핸들러
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    // 삭제 확인 모달 취소 핸들러
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    // 삭제 확인 모달에서 DELETE 버튼 클릭 시 처리 핸들러
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            // 서버에 DELETE 요청을 보냄
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization : 'Bearer ' + auth.token
                }

            );
        } catch (error) {
            // 에러 발생 시 아무 동작 없음 (추가 로직 필요)
        }
        // 삭제된 장소의 ID를 onDelete 콜백 함수를 통해 상위 컴포넌트에 전달
        props.onDelete(props.id);
    };

    return (
        <>
            {/* 에러 모달 컴포넌트 */}
            <ErrorModal error={error} onClear={clearError} />

            {/* 지도 모달 컴포넌트 */}
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <h2>THE MAP</h2>
                </div>
            </Modal>

            {/* 삭제 확인 모달 컴포넌트 */}
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </>
                }
            >
                <p>
                    정말 삭제 하시겠습니까?
                </p>
            </Modal>

            {/* 장소 항목 */}
            <li className="place-item">
                {/* 카드 컴포넌트 */}
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}

                    {/* 장소 이미지 */}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>

                    {/* 장소 정보 */}
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>

                    {/* 장소 액션 버튼 */}
                    <div className="place-item__actions">
                        {/* 지도 보기 버튼 */}
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>

                        {/* 사용자가 로그인 중일 때만 편집 및 삭제 버튼 표시 */}
                        {auth.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>
                                EDIT
                            </Button>
                        )}

                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;