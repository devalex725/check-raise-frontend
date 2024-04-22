import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { downloadExcel } from "react-export-table-to-excel";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import MembershipModal from "./MembershipModal";
import RegDateModal from "./RegDateModal";
import { formatPhoneNumber } from "../../../../utils";

const PlayerInfoModal = ({ show, onHide, playerInfo, rooms }) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const [isShowMembershipModal, setIsShowMembershipModal] = useState(false);
  const [isShowRegDateModal, setIsShowRegDateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    setRoomList(rooms || []);
  }, [rooms]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSaveExcel = async () => {
    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerInfo",
      tablePayload: {
        header: [
          "Name",
          "Surname",
          "Nickname",
          "Street and Number",
          "ZIP and City",
          "Birthday",
          "E-Mail Address",
          "Phone Number",
        ],
        body: [
          [
            playerInfo?.firstname,
            playerInfo?.lastname,
            playerInfo?.nickname,
            playerInfo?.street,
            `${playerInfo?.zipcode} ${playerInfo?.city}`,
            moment(playerInfo?.dob).format("DD.MM.YYYY"),
            playerInfo?.email,
            `${formatPhoneNumber(
              playerInfo?.phonecode,
              playerInfo?.phonenumber
            )}`,
          ],
        ],
      },
    });
  };

  const handleOpenMembershipModal = (room) => {
    setIsShowMembershipModal(true);
    setSelectedRoom(room);
  };

  const handleHideMembershipModal = (expiry) => {
    if (expiry) {
      setRoomList((prev) => {
        const index = prev.findIndex(
          (room) => room.room_id === selectedRoom.room_id
        );
        prev[index].expiry = expiry;

        return [...prev];
      });
    }
    setIsShowMembershipModal(false);
    setSelectedRoom(null);
  };

  const handleShowRegDateModal = (room) => {
    setIsShowRegDateModal(true);
    setSelectedRoom(room);
  };

  const handleHideRegDateModal = () => {
    setIsShowRegDateModal(false);
    setSelectedRoom(null);
  };

  const handleSubmitRegDate = (dateType, regDate) => {
    setRoomList((prev) => {
      const index = prev.findIndex(
        (room) => room.room_id === selectedRoom.room_id
      );
      if (dateType === "reset") {
        prev.splice(index, 1);
      } else {
        prev[index].first_registration_date = regDate;
      }
      console.log(prev[index]);

      return [...prev];
    });
    handleHideRegDateModal();
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <div ref={componentRef}>
          <style type="text/css" media="print">
            {
              "\
              @page {size: auto;    margin: 20mm;}\
            "
            }
            {
              "\
              body {color:#000 !important; }\
            "
            }
            {
              "\
              .form-label {color:#000 !important; }\
            "
            }
          </style>
          <Modal.Header>
            <Modal.Title>
              {playerInfo?.firstname} {playerInfo?.lastname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="modal-data-player">
              <Form.Label>Name : {playerInfo?.firstname} </Form.Label>
              <Form.Label>Surname : {playerInfo?.lastname}</Form.Label>
              <Form.Label>Nickname : {playerInfo?.nickname}</Form.Label>
              <Form.Label>Street and number : {playerInfo?.street}</Form.Label>
              <Form.Label>
                ZIP and City : {playerInfo?.zipcode} {playerInfo?.city}
              </Form.Label>
              <Form.Label>
                Birthdate : {moment(playerInfo?.dob).format("DD.MM.YYYY")}
              </Form.Label>
              <Form.Label>E-Mail Address : {playerInfo?.email}</Form.Label>
              <Form.Label>
                Phone Number :{" "}
                {formatPhoneNumber(
                  playerInfo?.phonecode,
                  playerInfo?.phonenumber
                )}
              </Form.Label>
              {roomList.length > 0 ? (
                <>
                  <p className="text-center">Room List</p>
                  <table style={{ margin: "12px" }}>
                    <thead>
                      <tr>
                        <th style={{ paddingBottom: "10px" }}>Name</th>
                        <th>First Registration</th>
                        <th>Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomList.map((rm, i) => {
                        return (
                          <tr key={i}>
                            <td>{rm.title}</td>
                            <td
                              role="button"
                              onClick={() => handleShowRegDateModal(rm)}
                            >
                              {rm?.first_registration_date &&
                              rm?.first_registration_date !== "before 04.2024"
                                ? moment(rm?.first_registration_date).format(
                                    "DD.MM.YYYY"
                                  )
                                : "Before 04.2024"}
                            </td>
                            <td>
                              {rm.is_membership === 1 ? (
                                <span
                                  role="button"
                                  onClick={() => {
                                    handleOpenMembershipModal(rm);
                                  }}
                                >
                                  {rm?.expiry && rm?.expiry !== "-"
                                    ? moment(rm?.expiry).format("DD.MM.YYYY")
                                    : "-"}
                                </span>
                              ) : (
                                "Not Active"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                ""
              )}
            </Row>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" download onClick={handleSaveExcel}>
            Save Excel
          </Button>

          <Button variant="primary" onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/manager/infoStatistics/${playerInfo.id}`)}
          >
            Statistics
          </Button>
        </Modal.Footer>
      </Modal>
      <MembershipModal
        show={isShowMembershipModal}
        onHide={handleHideMembershipModal}
        room={selectedRoom}
        playerInfo={playerInfo}
      />
      <RegDateModal
        show={isShowRegDateModal}
        onHide={handleHideRegDateModal}
        onSubmit={handleSubmitRegDate}
        room={selectedRoom}
        playerInfo={playerInfo}
      />
    </>
  );
};

export default PlayerInfoModal;
