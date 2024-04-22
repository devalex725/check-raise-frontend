import "../AdminSide.scss";

import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import customStyle from "../customstyle";
import { Row, Col, Card, Form, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminRoomService from "../../../api/services/AdminService/AdminRoomService";
import { useTranslation } from "react-i18next";
import { Editor } from "@tinymce/tinymce-react";

const Room = () => {
  const { t } = useTranslation();
  const [isActive, setActive] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState();
  const [sendData, SetSendData] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const [sendModal, setSendModal] = useState(false);
  const [content, setContent] = useState([]);
  const [sendEmailMessage, SetSendEmailMessage] = useState("");
  const [sendEmailModal, setSendEmailModal] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toggleClass = () => {
    setActive(!isActive);
  };

  const getRoomIndex = async () => {
    try {
      let responseData = await AdminRoomService.adminIndex().json();
      setRooms(responseData.data);
      setFilteredList(responseData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
    }
  };

  const handleOpenDeleteModal = (room) => {
    setSelectedRoom(room);
    setDeleteModalShow(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedRoom(null);
    setDeleteModalShow(false);
  };

  const deleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      const responseData = await AdminRoomService.adminDestroy(
        selectedRoom.id
      ).json();
      if (responseData.status === true) {
        getRoomIndex();
      }

      handleCloseDeleteModal();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getRoomIndex();
      setIsLoading(false);
    } else {
      navigate("/");
    }
  }, []);

  const getStatusStr = (row) => {
    let str = "To validate";

    switch (row.status) {
      case 0:
        str = "To validate";
        break;
      case 1:
        str = "Active";
        break;
      case 2:
        str = "Deactivated";
        break;
      case 3:
        str = "Suspended";
        break;
      default:
        str = "To validate";
        break;
    }
    return str;
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      {
        name: "Room Name",
        selector: (row) => (row ? row.title : ""),
        sortable: true,
        grow: 2,
      },
      {
        name: "Room Manager",
        selector: (row) => (row ? row.manager : ""),
        sortable: true,
        grow: 1,
        format: (row) => (
          <div>
            <div>{row.manager.firstname}</div>
            <div>{row.manager.lastname}</div>
          </div>
        ),
      },
      {
        name: "Subscription Until",
        selector: (row) =>
          row
            ? row.expiry === null
              ? ""
              : moment(row.expiry).format(" DD.MM.YYYY")
            : "",
        sortable: true,
      },
      {
        name: "Number of Credits",
        selector: (row) => (row ? row.credits : ""),
        sortable: true,
      },
      {
        name: "Limit of Buy-in",
        selector: (row) => (row ? row.buyuinlimit : ""),
        sortable: true,
      },
      {
        name: "Max number of tournaments displayed",
        selector: (row) => (row ? row.maxnumberoftournament : ""),
        sortable: true,
      },
      {
        name: "Max number of TOP banners",
        selector: (row) => (row ? row.maxnumberoftopbanner : ""),
        sortable: true,
      },
      {
        name: "Max number of CENTRAL banners",
        selector: (row) => (row ? row.maxnumberofbottombanner : ""),
        sortable: true,
      },
      {
        name: `Max number of premium tournaments`,
        selector: (row) => (row ? row.maxnumberofpremium : ""),
        sortable: true,
      },
      {
        name: "Late Arrival delay",
        selector: (row) => (row ? row.latearrivaldelay : ""),
        sortable: true,
      },
      {
        name: "Status",
        selector: getStatusStr,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <>
            <td>
              <Link
                className="action-link green-link mb-1"
                to={`/admin/room/edit/${row.id}`}
              >
                Edit
              </Link>
              {row.status == 0 ? (
                <Link
                  className="action-link yellow-link mb-1"
                  onClick={() => {
                    handleUpdateStatus(row.id, 1);
                  }}
                >
                  Validate
                </Link>
              ) : (
                ""
              )}
              {row.status == 1 ? (
                <>
                  <Link
                    className="action-link gray-link mb-1"
                    onClick={() => {
                      handleUpdateStatus(row.id, 3);
                    }}
                  >
                    Suspend
                  </Link>
                  <Link
                    className="action-link blue-link mb-1"
                    onClick={() => {
                      handleUpdateStatus(row.id, 2);
                    }}
                  >
                    Deactive
                  </Link>
                </>
              ) : (
                ""
              )}
              {row.status > 1 ? ( // for deactivated and suspended rooms
                <Link
                  className="action-link green-link mb-1"
                  onClick={() => {
                    handleUpdateStatus(row.id, 1);
                  }}
                >
                  Active
                </Link>
              ) : (
                ""
              )}
              <Link
                className="action-link pink-link mb-1"
                onClick={() => handleEmail(row.id)}
              >
                Send Email to RM
              </Link>
              <Link
                className="action-link red-link mb-1"
                onClick={() => {
                  handleOpenDeleteModal(row);
                }}
              >
                Delete
              </Link>
            </td>
          </>
        ),
      },
    ],
    []
  );
  const [searchParam] = useState([
    "title",
    // 'manager',
    // 'expiry',
    // 'credits',
    // 'buyuinlimit',
  ]);
  const filterBySearch = (event) => {
    const query = event.target.value;

    var updatedList = [...rooms];

    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem]
            .toString()
            .toLowerCase()
            .indexOf(query.toLowerCase()) !== -1
        );
      });
    });

    setFilteredList(updatedList);
  };
  const handleEmail = (e) => {
    SetSendData(e);
    setSendEmailModal(true);
  };
  const handleEditorChange = (e) => {
    setContent(e.target.getContent());
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();
    let userData = {
      tournament_id: sendData,
      subject: event.target.subject.value,
      content: content,
    };

    try {
      // let responseData = await TournamentService.sendemail(userData).json()
      // if (responseData.status === true) {
      //   setSendModal(true)
      //   SetSenddata('');
      //   setContent('')
      //   setSendEmailModal(false)
      //   SetSendEmailMessage(responseData.message)
      //     (responseData.message)
      // }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };
  const handleUpdateStatus = async (id, value) => {
    try {
      var postData = {
        id: id,
        status: value,
      };
      await AdminRoomService.updateStatus(postData).json();
      getRoomIndex();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">My poker rooms</h1>
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
                All Rooms
              </Card.Header>
              <Card.Body>
                <Form className="static">
                  <Row>
                    <Col md={3}>
                      <Link
                        className="btn btn-primary"
                        to="/admin/addroom"
                        role="button"
                      >
                        Add Room
                      </Link>
                    </Col>
                  </Row>
                </Form>
                <Row className="my-3">
                  <Col md={6}></Col>
                  <Col md={6} className="text-end">
                    <Form.Group
                      className="mb-5 form-group text-end d-flex align-items-center justify-content-end p-0"
                      controlId=""
                    >
                      <Form.Label className="d-block me-2">Search :</Form.Label>

                      <Form.Control
                        type="text"
                        className="player-statistics-search"
                        onChange={filterBySearch}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <DataTable
                  data={filteredList}
                  columns={columns}
                  theme="dark"
                  defaultSortFieldId={1}
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
        <p className="error">{errors}</p>
      </div>

      {isLoading && <LogoAnimationLoader />}
      <Modal show={sendEmailModal}>
        <Modal.Header>
          <Modal.Title>Send Email</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => setSendEmailModal(false)}
          ></button>
        </Modal.Header>
        <Form onSubmit={handleSendEmail}>
          <Modal.Body>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="form-group" controlId="">
                          <Form.Label>
                            {t(
                              "page.myprofile.myprofilenav.Newsletters.Subject"
                            )}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className=""
                            name="subject"
                          />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            i
                            initialValue={content}
                            name="content"
                            onChange={handleEditorChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setSendEmailModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={sendModal}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>

        <Modal.Body>{sendEmailMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              getRoomIndex();
              setSendModal(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteModalShow}>
        <>
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseDeleteModal}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete room?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Close
            </Button>
            <Button variant="secondary" onClick={deleteRoom}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default Room;
