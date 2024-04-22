import React, { useEffect, useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import customStyle from "../../Admin/customstyle";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { Link, resolvePath, useNavigate } from "react-router-dom";

import MyPlayerService from "../../../api/services/MyPlayerService";
import TournamentService from "../../../api/services/TournamentService";
import moment from "moment";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import PlayerInfoModal from "./components/PlayerInfoModal";
import SettingService from "../../../api/services/SettingService";
import { sortDate } from "../../../utils";

const Player = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerInfoModalShow, setPlayerInfoModalShow] = useState(false);

  const [suspendShow, ModalSuspendShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [saveMessage, setSaveMessage] = useState("");
  const [announce, setAnnounce] = useState(false);
  const [Error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [filteredList, setFilteredList] = new useState([]);
  const [statusValue, setStatusValue] = useState("any");

  const [currentRoomMemberId, setCurrentRoomMemberId] = useState(0);
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [currentMemberDate, setCurrentMemberDate] = useState(new Date());
  const [currentMemberDateDay, setCurrentMemberDateDay] = useState();
  const [currentMemberDateMonth, setCurrentMemberDateMonth] = useState();
  const [currentMemberDateYear, setCurrentMemberDateYear] = useState();
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [membershipModalShow, setMembershipModalShow] = useState(false);
  const [isMembership, setIsMembership] = useState(false);

  const getMyPlayer = async () => {
    setAnnounce(false);
    try {
      const responseData = await MyPlayerService.index().json();

      setPlayers(responseData.data.users.data);
      setFilteredList([].concat(responseData.data.users.data));
      // // const count = await MyPlayerService.totalCount().json();
      // // const lastPage = Math.ceil(count.total / 1000);

      // const [user1, user2, user3] = await Promise.all([
      //   MyPlayerService.index(1).json(),
      //   MyPlayerService.index(2).json(),
      //   MyPlayerService.index(3).json()
      // ])
      // const users = [].concat(user1.data.users.data, user2.data.users.data, user3.data.users.data)

      // // let responseData = await MyPlayerService.index().json();
      // const obj = Object.entries(users).map(
      //   ([key, value]) => ({ value })
      // );
      // setPlayers(
      //   obj.map((element) => {
      //     return element.value;
      //   })
      // );
      // setFilteredList(
      //   obj.map((element) => {
      //     return element.value;
      //   })
      // );

      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const getSetting = async () => {
    try {
      const responseData = await SettingService.index().json();
      setIsMembership(responseData?.data?.is_membership === 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertype") === "Room Manager") {
      getSetting();
      getMyPlayer();
    } else {
      navigate("/");
    }
  }, [navigate]);
  const handleStatus = (e) => {
    if (e.target.value === "suspended") {
      const _filtered = players.filter((element) => {
        return element.is_suspend;
      });
      setFilteredList(_filtered);
      setStatusValue(true);
    } else if (e.target.value === "active") {
      const _filtered = players.filter((element) => {
        return !element.is_suspend;
      });
      setFilteredList(_filtered);
      setStatusValue(false);
    } else {
      setFilteredList(players);
      setStatusValue("any");
    }
  };
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const handleMembership = (id, date, room_id, user_id) => {
    setIsCustomDate(false);
    setCurrentRoomId(room_id);
    setCurrentUserId(user_id);
    setCurrentRoomMemberId(id);
    if (date && date != "-") {
      const date1 = date;
      const day = new Date(date1).getDate() - 1;
      const month = new Date(date1).getMonth() + 1;
      const year = new Date(date1).getFullYear() + 1;
      setCurrentMemberDate(day + "." + month + "." + year);
      setCurrentMemberDateDay(day);
      setCurrentMemberDateMonth(month);
      setCurrentMemberDateYear(year);
    } else {
      const date = new Date();
      const day = new Date(date).getDate() - 1;
      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear() + 1;
      setCurrentMemberDate(day + "." + month + "." + year);

      setCurrentMemberDateDay(day);
      setCurrentMemberDateMonth(month);
      setCurrentMemberDateYear(year);
    }
    setError("");
    setMembershipModalShow(true);
  };
  const handleMembershipSubmit = async (event) => {
    const membershipDate = event.target.membershipdate.value;
    let expiry = "";

    switch (membershipDate) {
      case "custom":
        expiry = event.target.custom_date.value;
        break;
      case "reset":
        expiry = null;
        break;
      default:
        expiry = event.target.membershipdate.value;
        break;
    }

    event.preventDefault();

    if (membershipDate !== "reset" && !expiry) {
      setError("Invalid date.");
      return;
    }

    try {
      const userData = {
        id: currentRoomMemberId,
        room_id: currentRoomId,
        user_id: currentUserId,
        expiry: expiry,
      };
      const responseData = await TournamentService.updateexpiry(
        userData
      ).json();

      setMembershipModalShow(false);

      if (responseData.status === true) {
        setSaveMessage(responseData.message);
        setAnnounce(true);
      }
    } catch (error) {
      setMembershipModalShow(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleCustomDate = (event) => {
    setIsCustomDate(false);
    if (event.target.value == "custom") {
      setIsCustomDate(true);
    }
  };
  const columns = useMemo(
    () => [
      {
        name: "Name",

        selector: (player) => (player.firstname ? player.firstname : ""),
        sortable: true,
        // button: true
      },
      {
        name: "Surname",
        selector: (player) => (player.lastname ? player.lastname : ""),
        sortable: true,
      },
      {
        name: "Nickname",
        selector: (player) => (player.nickname ? player.nickname : ""),
        sortable: true,
      },
      {
        name: "Zipcode",
        selector: (player) => (player.zipcode ? player.zipcode : ""),
        sortable: true,
      },
      {
        name: "City",
        selector: (player) => (player.city ? player.city : ""),
        sortable: true,
      },
      {
        name: "Registration with check-in",
        selector: (row) => (row ? row.with_checkin : "0"),
        sortable: true,
      },
      {
        name: "Registration without check-in",
        selector: (row) => (row ? row.without_checkin : "0"),
        sortable: true,
      },
      {
        name: `Last Registered`,
        selector: (row) =>
          row.last ? moment(row.last).format("DD.MM.YYYY HH:mm") : "-",
        sortable: true,
        sortFunction: (rowA, rowB) => sortDate(rowA, rowB, "last"),
      },
      {
        name: "Membership",
        selector: (row) => (
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => {
              handleMembership(
                row.room_member_id,
                row.membership,
                row.room_id,
                row.id
              );
            }}
          >
            {row.membership && row.membership != "-" ? (
              moment().format() > moment(row.membership).format() ? (
                <div style={{ color: "red" }}>
                  {moment(row.membership).format("DD.MM.YYYY")}
                </div>
              ) : (
                moment(row.membership).format("DD.MM.YYYY")
              )
            ) : (
              "-"
            )}
          </div>
        ),
        sortable: true,
        sortFunction: (rowA, rowB) => sortDate(rowA, rowB, "membership"),
        omit: !isMembership,
      },
      {
        name: "Cumulated rakes",
        selector: (row) => (row.rakes ? row.rakes : "0"),
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <>
            <div>
              <Link
                className="action-link green-link mb-1"
                onClick={() =>
                  handleClickInfo(
                    row.id,
                    row.membership,
                    row.first_registration_date
                  )
                }
              >
                Info
              </Link>
              <Link
                className="action-link blue-link mb-1"
                to={`/manager/infoStatistics/${row.id}`}
              >
                Statistics
              </Link>
              {row.is_suspend ? (
                <Link
                  className="action-link red-link mb-1"
                  onClick={() => {
                    updateSuspendStatus(row.id);
                  }}
                >
                  Unsuspend
                </Link>
              ) : (
                <Link
                  className="action-link red-link mb-1"
                  onClick={() => {
                    updateSuspendStatus(row.id);
                  }}
                >
                  Suspend
                </Link>
              )}
            </div>
          </>
        ),
      },
    ],
    [isMembership]
  );
  const [searchParam] = useState([
    "firstname",
    "lastname",
    "city",
    "nickname",
    "email",
    "zipcode",
  ]);
  const filterBySearch = (event) => {
    const query = (event.target.value || "").trim();

    let updatedList = [...players];

    if (!query) {
      setFilteredList(updatedList);
    }

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
  const updateSuspendStatus = async (playerId) => {
    try {
      let responseData = await MyPlayerService.updatesuspendstatus(
        playerId
      ).json();
      if (responseData.status === true) getMyPlayer();
      ModalSuspendShow(true);
      setModalMessage("Status Updated!!!");

      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleClickInfo = async (
    playerId,
    membership,
    firstRegistrationDate
  ) => {
    try {
      const responseData = await MyPlayerService.infoStatistics(
        playerId
      ).json();

      setPlayerInfo({
        ...responseData.player_info,
        membership,
        firstRegistrationDate,
      });

      setPlayerInfoModalShow(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={2}>{/* <MyProfileLeftNavManager /> */}</Col>
          <Col md={10} lg={12}>
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
                My Players
              </Card.Header>
              <Card.Body>
                <Form>
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
                        onClick={() => navigate("/manager/addplayer")}
                      >
                        create a player account
                      </Button>
                    </Col>
                  </Row>
                </Form>

                <DataTable
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
                  // defaultSortFieldId={1}
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
      <Modal show={announce}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>{saveMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="button"
            onClick={() => getMyPlayer()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <LogoAnimationLoader />}

      <PlayerInfoModal
        show={playerInfoModalShow}
        onHide={() => {
          setPlayerInfoModalShow(false);
        }}
        playerInfo={playerInfo}
        isMembership={isMembership}
      />

      <Modal show={membershipModalShow}>
        <Modal.Header onClick={() => setMembershipModalShow(false)}>
          <Modal.Title>
            <h4>Membership</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleMembershipSubmit}>
            <Form.Group className="form-group" controlId="">
              <select
                onChange={handleCustomDate}
                name="membershipdate"
                className="form-select mb-3"
              >
                <option value={new Date().getFullYear() + "-12-31"}>
                  Until the end of the year (
                  {"31.12." + new Date().getFullYear()})
                </option>
                <option
                  value={parseInt(new Date().getFullYear() + 1) + "-12-31"}
                >
                  Until the end of the next year (
                  {"31.12." + parseInt(new Date().getFullYear() + 1)})
                </option>
                <option
                  value={
                    currentMemberDateYear +
                    "-" +
                    currentMemberDateMonth +
                    "-" +
                    currentMemberDateDay
                  }
                >
                  By one year ({currentMemberDate})
                </option>
                <option value="custom">Custom Date</option>
                <option value="reset">Reset membership</option>
              </select>
              {isCustomDate ? (
                <input
                  type="date"
                  name="custom_date"
                  className="form-control"
                />
              ) : (
                <input type="hidden" name="custom_date" />
              )}
              <p className="error">{Error}</p>
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Save
              </Button>
              <Button
                variant="secondary"
                type="reset"
                onClick={() => setMembershipModalShow(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
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
                  getMyPlayer();
                }}
              >
                Okay
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default Player;
