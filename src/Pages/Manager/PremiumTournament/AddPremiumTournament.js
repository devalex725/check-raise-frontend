import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

import MyProfileLeftNavManager from "../../../components/MyProfileLeftNav/MyProfileLeftNavManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import PremiumService from "../../../api/services/PremiumService";
import DatePicker from "react-datepicker";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import moment from "moment";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
const AddBanner = () => {
  /*useEffect(() => {
        if (localStorage.getItem('usertype') === 'Room Manager') {
           
        }
        else {
            navigate('/');
        }

    }, [])*/
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [Modalshow, setModelShow] = useState(false);
  const [modalmessage, setModalMessage] = useState("");
  const [formRefSt, setFormRefst] = useState("");
  const [tournament, setTournament] = useState([]);
  const [tournamentselect, SetTournamentselect] = useState(
    searchParams.get("id") ?? ""
  );
  const [show, setShow] = useState(false);
  const [isLoading, setisloading] = useState(true);
  const [error, setError] = useState();
  const [credit, setCredit] = useState([]);
  const [premiumDate, setPremiumDate] = useState("");
  const [premiumweekly, setpremiumweekly] = useState([]);
  const [usercredit, setUsercredit] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(moment().startOf("isoweek").utc()),
    endDate: new Date(moment().endOf("week").utc()),
  });

  const getTournament = async () => {
    try {
      let responseData = await PremiumService.getroomtournamets().json();

      setTournament(responseData.data);
      setisloading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const getCredit = async () => {
    try {
      let responseData = await PremiumService.getcredit().json();
      console.log(responseData);
      setCredit(responseData.data);
      setisloading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertype") === "Room Manager") {
      getTournament();
      getpremiumWeekly();
      getCredit();
      getUserCredit();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const setFormRef = (formRef) => {
    setFormRefst(formRef);
  };
  const getUserCredit = async () => {
    try {
      let responseData = await PremiumService.getuserCredit().json();
      setUsercredit(responseData.balance);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleTournament = (tournament) => {
    SetTournamentselect(tournament.target.value);
  };
  const submitForm = () => {
    formRefSt.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };
  function handleTopDate(event) {
    setPremiumDate(event.target.value);
  }
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (premiumDate === "") {
      setShow(false);
      setError("Please Select Date!!!");
      return;
    }
    try {
      var postdata = {
        startdate: moment(premiumDate).format("YYYY-MM-DD HH:mm"),
        tournament_id: tournamentselect,
      };
      if (tournamentselect === "") {
        setShow(false);
        setError("Please Select Tournament *");
      } else {
        const data = await PremiumService.store(postdata).json();
        if (data.status === true) {
          setShow(false);
          setModelShow(true);
          setModalMessage(data);
          setError("");
        } else {
          setShow(false);
          setError("PremiumTournament already added between week!!!");
        }
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };
  const handleConfirmation = async (event) => {
    event.preventDefault();
    try {
      setShow(true);
    } catch (error) {
      console.error("Error When Get City", error);
    }
  };
  const getpremiumWeekly = async () => {
    try {
      let responseData = await PremiumService.getpremiumweekly().json();
      setpremiumweekly(responseData);
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
          {/* <Col md={2}>
                         {/* <MyProfileLeftNavManager /> */}
          {/* </Col>  */}

          <Col md={12} lg={12}>
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
                <Link to="/manager/premium-tournament">Premium Tournament</Link>{" "}
                <FontAwesomeIcon icon={faArrowRight} /> Add Premium Tournament
              </Card.Header>
              <Card.Body>
                <Form
                  name="form"
                  onSubmit={onSubmitHandler}
                  ref={(ref) => setFormRef(ref)}
                >
                  <Row>
                    <Col md={12} className="without-date-calander">
                      <Link to="/manager/premium-tournament">Back</Link>
                      <p>
                        Max Number of premium tournament per week (all rooms):{" "}
                        {premiumweekly && premiumweekly.max_number_premium}
                      </p>
                      <p>
                        Max Number of premium tournament per week (your room):{" "}
                        {premiumweekly.roomdetails &&
                          premiumweekly.roomdetails.maxnumberofpremium}
                      </p>
                      <p>My credits: {usercredit}</p>
                      <div className="col-md-8">
                        <div className="d-flex col-md-12 justify-content-between">
                          <div>
                            <div>
                              <p>Week Number</p>
                              {premiumweekly.week &&
                                premiumweekly.week.map((element) => {
                                  return <p>{element}</p>;
                                })}
                            </div>
                          </div>
                          <div>
                            <div>
                              <p>Start (Mo 0:00)</p>
                              {premiumweekly.startdates &&
                                premiumweekly.startdates.map((element) => {
                                  return (
                                    <p>
                                      {element
                                        ? moment(element).format("DD.MM.YYYY")
                                        : ""}
                                    </p>
                                  );
                                })}
                            </div>
                          </div>
                          <div>
                            <div>
                              <p>End (Su 23:59)</p>
                              {premiumweekly.enddates &&
                                premiumweekly.enddates.map((element) => {
                                  return (
                                    <p>
                                      {element
                                        ? moment(element).format("DD.MM.YYYY")
                                        : ""}
                                    </p>
                                  );
                                })}
                            </div>
                          </div>
                          <div>
                            <div>
                              <p>Rent (All)</p>
                              {premiumweekly.pt_select_all &&
                                premiumweekly.pt_select_all.map(
                                  (element, index) => {
                                    return (
                                      <p className="d-flex">
                                        <>
                                          <span className="me-2">
                                            {element} /{" "}
                                            {premiumweekly.max_number_premium}
                                          </span>
                                        </>
                                      </p>
                                    );
                                  }
                                )}
                            </div>
                          </div>
                          <div>
                            <div>
                              <p>Rent (You)</p>
                              {premiumweekly.pt_select &&
                                premiumweekly.pt_select.map(
                                  (element, index) => {
                                    return (
                                      <p
                                        className="d-flex"
                                        style={{ marginBottom: "14px" }}
                                      >
                                        <span className="me-2">
                                          {element} /{" "}
                                          {premiumweekly.roomdetails &&
                                            premiumweekly.roomdetails
                                              .maxnumberofpremium}
                                        </span>
                                        {element >=
                                        premiumweekly.roomdetails
                                          .maxnumberofpremium ? (
                                          ""
                                        ) : premiumweekly.pt_select_all[index] <
                                          premiumweekly.max_number_premium ? (
                                          <Form.Check
                                            type="radio"
                                            id="default-radio"
                                            name="topbanner"
                                            label="Select"
                                            value={
                                              premiumweekly.startdates[index]
                                            }
                                            onChange={handleTopDate}
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </p>
                                    );
                                  }
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <Form.Group
                        className="mb-3 form-group"
                        controlId="firstname"
                      >
                        <Form.Label>Tournament List*</Form.Label>
                        <Form.Select
                          onChange={handleTournament}
                          value={tournamentselect}
                        >
                          <option value="select">Select Tournament</option>
                          {tournament.map((element) => (
                            <option key={element.id} value={element.id}>
                              {element.title}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <p className="error">{error}</p>

                    <Col md={12} className="text-center mt-5">
                      <Button
                        type="submit"
                        onClick={handleConfirmation}
                        className=" btn btn-primary btn-submit"
                      >
                        Create Premium Tournament
                      </Button>
                    </Col>
                  </Row>
                </Form>
                {/* </div> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal show={show}>
          <Modal.Header closeButton onClick={() => setShow(false)}>
            <Modal.Title>Create Premium Tournament</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {credit &&
              credit.map((element) =>
                element.key == "premium_tournament" ? (
                  <p>You have to pay {element.perday} credit per week.</p>
                ) : (
                  ""
                )
              )}
            Are you sure?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setError("");
                setShow(false);
              }}
            >
              Cancel
            </Button>
            <Button varient="primary" onClick={submitForm}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {isLoading && <LogoAnimationLoader />}
      {Modalshow ? (
        <Modal show={Modalshow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalmessage.message}</Modal.Body>
            <Modal.Footer>
              {modalmessage.flag == 1 ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModelShow(false);
                    navigate("/manager/banner");
                  }}
                >
                  Close
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModelShow(false);
                    navigate("/manager/premium-tournament");
                  }}
                >
                  Close
                </Button>
              )}
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};
export default AddBanner;
