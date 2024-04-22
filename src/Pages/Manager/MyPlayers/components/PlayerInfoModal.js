import React, { useRef } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { downloadExcel } from "react-export-table-to-excel";
import moment from "moment";
import { formatPhoneNumber } from "../../../../utils";

const PlayerInfoModal = ({ show, onHide, playerInfo, isMembership }) => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSaveExcel = async () => {
    const membership =
      isMembership && playerInfo?.membership && playerInfo?.membership !== "-"
        ? playerInfo?.membership
        : null;

    const header = [
      "Name",
      "Surname",
      "Nickname",
      "Street and Number",
      "ZIP and City",
      "Birthday",
      "E-Mail Address",
      "Phone Number",
    ];
    const body = [
      playerInfo?.firstname,
      playerInfo?.lastname,
      playerInfo?.nickname,
      playerInfo?.street,
      `${playerInfo?.zipcode} ${playerInfo?.city}`,
      moment(playerInfo?.dob).format("DD.MM.YYYY"),
      playerInfo?.email,
      formatPhoneNumber(playerInfo?.phonecode, playerInfo?.phonenumber),
    ];

    if (membership) {
      header.push("Membership");
      body.push(membership);
    }
    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerInfo",
      tablePayload: {
        header,
        body: [body],
      },
    });
  };

  return (
    <>
      <Modal show={show}>
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
            <Row>
              <Form.Label>Name : {playerInfo?.firstname} </Form.Label>
              <Form.Label>Surname : {playerInfo?.lastname}</Form.Label>
              <Form.Label>Nickname : {playerInfo?.nickname}</Form.Label>
              <Form.Label>Street and number : {playerInfo?.street}</Form.Label>
              <Form.Label>
                ZIP and City : {playerInfo?.zipcode} {playerInfo?.city}
              </Form.Label>
              <Form.Label>
                Birthdate :{" "}
                {playerInfo?.dob
                  ? moment(playerInfo?.dob).format("DD.MM.YYYY")
                  : ""}
              </Form.Label>
              <Form.Label>
                E-Mail Address :{" "}
                <a className="text-white" href={`mailto:${playerInfo?.email}`}>
                  {playerInfo?.email}
                </a>
              </Form.Label>
              <Form.Label>
                Phone Number :{" "}
                {formatPhoneNumber(
                  playerInfo?.phonecode,
                  playerInfo?.phonenumber
                )}
              </Form.Label>
              <Form.Label>
                First Registration:{" "}
                {playerInfo?.firstRegistrationDate
                  ? moment(playerInfo?.firstRegistrationDate).format(
                      "DD.MM.YYYY"
                    )
                  : "Before 04.2024"}
              </Form.Label>
              <Form.Label>
                Membership:{" "}
                {!isMembership
                  ? "Not active"
                  : playerInfo?.membership && playerInfo?.membership !== "-"
                  ? moment(playerInfo?.membership).format("DD.MM.YYYY")
                  : "-"}
              </Form.Label>
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
            onClick={() =>
              navigate(`/manager/infoStatistics/${playerInfo?.id}`)
            }
          >
            Statistics
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlayerInfoModal;
