import "../style.scss";

import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import customStyle from "../customstyle";
import DataTable from "react-data-table-component";
import AdminPlayerService from "../../../api/services/AdminService/AdminPlayerService";
import PlayerInfoModal from "./components/PlayerInfoModal";

const Player = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [playerInfoModalShow, setPlayerInfoModalShow] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerRooms, setPlayerRooms] = useState([]);

  const [isActive, setActive] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [suspendShow, ModalSuspendShow] = useState(false);
  const [Error, setError] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getPlayers();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getPlayers = async () => {
    try {
      const responseData = await AdminPlayerService.playerIndex().json();
      setPlayers(responseData.data);
      setFilteredList(responseData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const toggleClass = () => {
    setActive(!isActive);
  };
  const [statusValue, setStatusValue] = useState("any");
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => (row.firstname ? row.firstname : ""),
        sortable: true,
      },
      {
        name: "Surname",
        selector: (row) => (row.lastname ? row.lastname : ""),
        sortable: true,
      },
      {
        name: "Nickname",
        selector: (row) => (row.nickname ? row.nickname : ""),
        sortable: true,
      },
      {
        name: "ZipCode",
        selector: (row) => (row.zipcode ? row.zipcode : ""),
        sortable: true,
      },
      {
        name: "City",
        selector: (row) => (row.city ? row.city : ""),
        sortable: true,
      },
      {
        name: "Registrations with check-in",
        selector: (row) => (row.withcheckin ? row.withcheckin : 0),
        sortable: true,
      },
      {
        name: "Registrations without check-in",
        selector: (row) => (row.withoutcheckin ? row.withoutcheckin : "0"),
        sortable: true,
      },
      {
        name: "Late Registered",
        selector: (row) => (row.lateregistration ? row.lateregistration : "0"),
        sortable: true,
      },
      {
        name: "Rooms",
        selector: (row) => (row.room_count ? row.room_count : "0"),
        sortable: true,
      },
      {
        name: "Cumulated rakes",
        selector: (row) => (row.rakes ? row.rakes : "0"),
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div>
            <Link
              className="action-link green-link mb-1"
              onClick={() => handleShowInfo(row.user_id)}
            >
              Info
            </Link>
            <Link
              className="action-link blue-link mb-1"
              to={`/admin/infoStatistics/${row.user_id}`}
            >
              Statistics
            </Link>
            {row.is_suspend === 1 ? (
              <Link
                className="action-link gray-link mb-1"
                onClick={() => {
                  updateSuspendStatus(row.user_id, row.roomid);
                }}
              >
                Suspended
              </Link>
            ) : (
              <Link
                className="action-link pink-link mb-1"
                onClick={() => {
                  updateSuspendStatus(row.user_id, row.roomid);
                }}
              >
                Suspend
              </Link>
            )}

            <Link
              className="action-link green-link mb-1"
              to={`/admin/user/edit/${row.user_id}`}
            >
              Edit
            </Link>
            <Link
              className="action-link red-link mb-1"
              onClick={() => {
                deletePlayer(row.user_id);
              }}
            >
              Delete
            </Link>
          </div>
        ),
      },
    ],
    []
  );
  const deletePlayer = async (userId) => {
    setDeleteId(userId);
    setDeleteModal(true);
  };
  const handleDeleteUser = async () => {
    try {
      let responseData = await AdminPlayerService.destroy(deleteId).json();
      if (responseData.status === true) setDeleteModal(false);
      setDeleteSuccess(true);

      setModalMessage(responseData.message);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const updateSuspendStatus = async (userId, roomId) => {
    // console.log(userid, "userid", roomid, "roomnud")
    try {
      let responseData = await AdminPlayerService.updatesuspendstatus(
        roomId,
        userId
      ).json();
      if (responseData.status === true) getPlayers();
      ModalSuspendShow(true);
      setModalMessage("Status Updated!!!");

      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
    // try {
    //   var userData = {

    //     id: e,
    //     device_name: "web"
    //   }
    //   let responseData = await AdminUserService.loginuser(userData).json()
    //   if (responseData.status === true) {

    //     localStorage.setItem("usertoken", JSON.stringify(responseData.token));
    //     localStorage.setItem("usertype", responseData.type.toString());
    //     localStorage.setItem("user", JSON.stringify(responseData.user));
    //     localStorage.setItem("adminloginasuser", 'adminloginasuser');
    //     window.open(process.env.REACT_APP_URL, "_blank", "noreferrer");
    //   }
    // } catch (error) {
    //   if (error.name === 'HTTPError') {
    //     const errorJson = await error.response.json();

    //     setError(errorJson.message)
    //   }
    // }
  };
  const [searchParam] = useState([
    "firstname",
    "lastname",
    "email",
    "nickname",
    // 'zipcode',
    // 'city'
  ]);
  const filterBySearch = (event) => {
    const query = event.target.value;

    var updatedList = [...players];

    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          (item[newItem] || "").toLowerCase().indexOf(query.toLowerCase()) !==
          -1
        );
      });
    });

    setFilteredList(updatedList);
  };
  const handleShowInfo = async (playerId) => {
    try {
      let responseData = await AdminPlayerService.infoStatistics(
        playerId
      ).json();

      setPlayerInfo(responseData.player_info);

      const rooms = responseData.rooms || [];
      (responseData.room_memeber || []).map((rm) => {
        const index = rooms.findIndex((room) => room.room_id === rm.room_id);

        if (index > -1) {
          rooms[index] = { ...rooms[index], expiry: rm.expiry, room_member_id: rm.room_member_id };
        } else {
          rooms.push(rm);
        }
      });

      setPlayerRooms(rooms);
      setPlayerInfoModalShow(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleStatus = (e) => {
    if (e.target.value === "suspended") {
      var filtered2 = players.filter((element) => {
        return element.is_suspend == 1;
      });
      setFilteredList(filtered2);
      setStatusValue(1);
    } else if (e.target.value === "active") {
      var filtered2 = players.filter((element) => {
        return element.is_suspend == 0;
      });
      setFilteredList(filtered2);
      setStatusValue(0);
    } else {
      setFilteredList(players);
      setStatusValue("any");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">All Players</h1>
      </nav>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Form>
                  {/* <Row className='m-2'>
                    <Col md={6} className='text-start'>
                      <Button varient="primary" onClick={() => navigate('/admin/addplayer/Player')}>create a player account</Button>
                    </Col>
                    <Col md={6} sm={12} className='text-end'>
                      <Form.Control type="text" className='' placeholder='Searchby'
                        onChange={filterBySearch}
                      />
                    </Col>
                  </Row> */}
                  <Row className="m-2">
                    <Col md={4} sm={12}></Col>
                    <Col md={4} sm={12}>
                      <Form.Control
                        type="text"
                        className=""
                        placeholder="Searchby"
                        onChange={filterBySearch}
                      />
                    </Col>
                  </Row>
                  {/* <Row className='m-2'>
                    <Col md={12} sm={12} className='text-end'>

                    </Col>

                  </Row>
                  <Row className='m-2'>
                    <Col md={4} sm={12}>
                      <Form.Label>Status</Form.Label>
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Select onChange={handlestatus} defaultValue={statusValue}>
                        <option value="any">Any</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </Form.Select>
                    </Col>
                  </Row> */}
                  <Row className="m-2">
                    <Col md={4} sm={12}>
                      <Form.Label>Status</Form.Label>
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Select
                        onChange={handleStatus}
                        defaultValue={statusValue}
                      >
                        <option value="any">Any</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="m-2">
                    <Col md={12} className="text-end">
                      <Button
                        varient="primary"
                        onClick={() => navigate("/admin/addplayer/Player")}
                      >
                        create a player account
                      </Button>
                    </Col>
                  </Row>
                </Form>

                <DataTable
                  // data={filteredList}
                  data={
                    filteredList &&
                    filteredList.filter((element) => {
                      return statusValue === "any"
                        ? filteredList
                        : element.is_suspend === statusValue;
                    })
                  }
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
                <p>{Error}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <PlayerInfoModal
        show={playerInfoModalShow}
        onHide={() => {
          setPlayerInfoModalShow(false);
        }}
        playerInfo={playerInfo}
        rooms={playerRooms}
      />

      {isLoading && <LogoAnimationLoader />}
      {suspendShow ? (
        <Modal show={suspendShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  ModalSuspendShow(false);
                  setIsLoading(true);
                  getPlayers();
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
      <Modal show={deleteModal}>
        <>
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setDeleteModal(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete player?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteUser()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={deleteSuccess}>
        <Modal.Header>
          <Modal.Title>Deleted</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true);
              getPlayers();
              // setdeleteModal(false)
              setDeleteSuccess(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Player;
