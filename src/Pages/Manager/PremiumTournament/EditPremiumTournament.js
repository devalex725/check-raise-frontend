import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PremiumService from '../../../api/services/PremiumService';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom';
import moment from 'moment';
const EditPremiumTournament = () => {

    const navigate = useNavigate()
    const [isLoading, setisloading] = useState(true);

    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');


    const params = useParams();



    const [error, setError] = useState();
    const [dateRange, setDateRange] = useState({
        startDate: setHours(setMinutes(new Date(), 30), 16)
        // startDate: new Date(moment().startOf("isoweek").utc()),
        // endDate: new Date(moment().endOf("week").utc())
    });
    const [PremiumData, setPremiumData] = useState([]);
    const [tournament, setTournament] = useState([]);
    const [tournamentselect, SetTournamentselect] = useState([]);

    const GetBanner = async (id) => {
        try {
            let responseData = await PremiumService.editPreminumtournament(id).json()
            let tournamentData = await PremiumService.getroomtournamets().json()
                    
            setTournament(tournamentData.data);
            let gettournamentdata = tournamentData.data.filter(function (item) {

                return item.id === responseData.data.tournament_id;

            });

            SetTournamentselect(gettournamentdata)
            setPremiumData(responseData.data);
            // setDateRange({ ...dateRange, startDate: new Date(moment(responseData.data.startdate).startOf("isoweek").utc()) })
            setDateRange({ ...dateRange, startDate: new Date(responseData.data.startdate) })


            setisloading(false)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('usertype') === 'Room Manager') {
            GetBanner(params.id);
        }
        else {
            navigate('/');
        }

    }, [])

    const handleTournament = tournament => {
        SetTournamentselect(tournament);


    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();


        setError("")
        try {

            var postdata = {
                // startdate: moment(event.target.startdate.value).format("YYYY-DD-MM HH:mm"),
                startdate: moment(dateRange.startDate).format('YYYY-MM-DD HH:mm'),
                tournament_id: tournamentselect.id ? tournamentselect.id : PremiumData.tournament_id

            }

            const data = await PremiumService.updatePreminumtournament(params.id, postdata).json();

            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data)
                setError('')
                //navigate('/manager/banner');
            }
        } catch (error) {
            // Handle API errors
            console.log(error)
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                ///navigate('/manager/banner');
            }
        }
    }

    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    {/* <Col md={2}>
                         {/* <MyProfileLeftNavManager /> */}
                    {/* </Col>  */}

                    <Col md={10} lg={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                <Link to="/manager/premium-tournament">Premium Tournament</Link> <FontAwesomeIcon icon={faArrowRight} /> Edit Premium Tournament
                            </Card.Header>
                            <Card.Body>
                            <Link to="/manager/premium-tournament">Back</Link>
                                <Form onSubmit={onSubmitHandler} >

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3 form-group" controlId="firstname">
                                                <Form.Label>Date*</Form.Label>
                                                <DatePicker
                                                    // selected={new Date(dateRange.startDate)}
                                                    selected={dateRange.startDate}
                                                    onChange={(date) => setDateRange({ ...dateRange, startDate: date, endDate: date })}
                                                    name="startdate"
                                                    filterDate={(date) => date.getDay() === 1}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    injectTimes={[
                                                        setHours(setMinutes(new Date(), 1), 0),
                                                        setHours(setMinutes(new Date(), 5), 12),
                                                        setHours(setMinutes(new Date(), 59), 23),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy HH:mm"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group className="mb-3 form-group" controlId="tournamentList">
                                                <Form.Label>Tournament List*</Form.Label>
                                                {/* <Form.Select
                                                    onChange={handleTournament}
                                                    defaultValue={tournamentselect}

                                                >
                                                    <option value='select'>Select Tournament</option>
                                                    {
                                                        tournament.map((element) => (
                                                            <option value={element.id}>{element.title}</option>
                                                        ))
                                                    }
                                                </Form.Select> */}
                                                <Select options={tournament}

                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={tournamentselect}
                                                    getOptionValue={(option) => option.title}
                                                    getOptionLabel={(option) => option.title}
                                                    onChange={handleTournament}

                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12} className="text-center mt-5">
                                            <Button type="submit" className=" btn btn-primary btn-submit" >Edit Premium Tournament</Button>
                                        </Col>
                                    </Row>
                                </Form>
                                {/* </div> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
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
                            {modalmessage.flag == 1 ?
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setModelShow(false)
                                        navigate('/manager/premium-tournament');
                                    }}
                                >
                                    Close
                                </Button>
                                :
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        navigate('/manager/premium-tournament');
                                        setModelShow(false)
                                    }}
                                >
                                    Close
                                </Button>
                            }
                        </Modal.Footer>
                    </>
                </Modal>
            ) : (
                ''
            )}
        </>
    )
}
export default EditPremiumTournament;