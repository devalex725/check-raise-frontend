import "../style.scss";

import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";

import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminEmailLogService from "../../../api/services/AdminService/AdminEmailLogService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import customStyle from "../customstyle";
import DataTable from "react-data-table-component";
import moment from "moment";
import { sortDate } from "../../../utils";

const EmailLogs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [emailLogs, setEmailLogs] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState({
    email_setting: "send",
    custom_email: "",
  });

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const columns = useMemo(
    () => [
      {
        name: "Date Time",
        selector: (row) => moment(row.created_at).format("DD.MM.YYYY HH:mm"),
        sortable: true,
        sortFunction: (rowA, rowB) => sortDate(rowA, rowB, "created_at"),
      },
      {
        name: "To",
        selector: (row) => row.to,
        sortable: true,
      },
      {
        name: "From",
        selector: (row) => row.from,
        sortable: true,
      },
      {
        name: "Subject",
        selector: (row) => row.subject,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row?.status,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <Link
            className="action-link green-link mb-1"
            onClick={() => handleEmailShow(row)}
          >
            View
          </Link>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getEmailLogs();
      getEmailSetting();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getEmailLogs = async () => {
    try {
      const responseData = await AdminEmailLogService.index().json();
      setEmailLogs(responseData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getEmailSetting = async () => {
    try {
      const responseData = await AdminEmailLogService.setting().json();
      console.log(responseData);
      setData({
        email_setting: responseData.data?.email_setting || "",
        custom_email: responseData.data?.custom_email || "",
      });
    } catch (error) {}
  };

  const handleEmailShow = async (row) => {
    setSelectedEmail(row);
    setModalShow(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newData = { ...data, [name]: value };

    setData(newData);
    AdminEmailLogService.updateSetting(newData);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className="d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">E-mail log</h1>
      </nav>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
            <Card>
              <Card.Header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#fff"
                  className="me-1"
                >
                  <path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
                E-mail log
              </Card.Header>
              <Card.Body>
                <Form className="mb-3">
                  <Form.Check
                    type="radio"
                    label="Send e-mails"
                    id="send_email"
                    name="email_setting"
                    checked={data.email_setting === "send"}
                    value="send"
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Block e-mails"
                    id="block_email"
                    name="email_setting"
                    checked={data.email_setting === "block"}
                    value="block"
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Send all e-mails to"
                    id="send_to_custom"
                    name="email_setting"
                    checked={data.email_setting === "custom"}
                    value="custom"
                    onChange={handleChange}
                  />
                  <Form.Group
                    className={data.email_setting === "custom" ? "" : "d-none"}
                    style={{ maxWidth: 200 }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      name="custom_email"
                      value={data.custom_email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Form>
                <DataTable
                  data={emailLogs}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  defaultSortAsc={false}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header>
          <Modal.Title>{selectedEmail.subject}</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => setModalShow(false)}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form.Label>
              From : {selectedEmail.from ? selectedEmail.from : ""}
            </Form.Label>
            <Form.Label>
              To : {selectedEmail.to ? selectedEmail.to : ""}
            </Form.Label>
            <Form.Label>
              Content : <p className="mt-3 bg-light text-black p-2 rounded-2" dangerouslySetInnerHTML={{ __html: selectedEmail.content }}></p>
            </Form.Label>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default EmailLogs;
