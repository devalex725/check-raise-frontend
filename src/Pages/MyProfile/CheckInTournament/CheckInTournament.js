import React, { useState, useEffect } from 'react';

import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './CheckInTournament.scss';
import Select from "react-select";

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import "react-datepicker/dist/react-datepicker.css";

import TournamentService from '../../../api/services/TournamentService';
import Moment from 'moment';
import DataTable from 'react-data-table-component';

const CheckInDirectorTournament = () => {
    Moment.locale('en');
    const params = useParams()

    const navigate = useNavigate()
    const { t } = useTranslation();

    const [isLoading, setisloading] = useState(true);

    let [MaxNumberPlayer, setMaxNumberPlayer] = useState(0);
    let [ReservedPlayer, setReservedPlayer] = useState(0);
    let [currentPlayerID, setCurrentPlayerID] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState();
    const [RegisterPlayerList, setRegisterPlayerList] = useState([]);
    let [TournamentData, setTournamentData] = useState([]);
    const [show, setShow] = useState(false)


    const [RegisterPlayerData, setRegisterPlayerData] = useState([]);
    const [WaitingPlayerData, setWaitingPlayerData] = useState([]);
    const [RegistrationLog, setRegistrationLog] = useState([]);
    const [checkInDetail, setcheckInDetail] = useState([]);

    const handleSelect = async (data) => {

        if (data) {
            try {
                let responseData = await TournamentService.getRegisterPlayer(data).json();
                var listarray = [];
                responseData.data.map((element) => {
                    return (
                        listarray.push({ "label": element.name, "value": element.id })
                    )
                });
                setRegisterPlayerList(listarray)
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const handleSelectChange = async (data) => {
        if (data.value) {
            var postData = {
                "id": params.id,
                "user_id": data.value
            }
            try {
                let responseData = await TournamentService.RegisterPlayerById(postData).json();
                if (responseData.status === true) {
                    getCheckInDataByTournamnetID();
                }
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const getCheckInDataByTournamnetID = async () => {
        try {
            let responseData = await TournamentService.checkInTournament(params.id).json()

            setTournamentData(responseData.data)
            setcheckInDetail(responseData.data.detail)

            setRegisterPlayerData(responseData.data.registered)
            setWaitingPlayerData(responseData.data.waiting.data)
            setRegistrationLog(responseData.data.log.data)
            setMaxNumberPlayer(responseData.data.detail.maxplayers)
            setReservedPlayer(responseData.data.detail.reservedplayers)
            setisloading(false)

        } catch (error) {

            setisloading(false)
        }
    }

    const cancleRegistration = async (id) => {
        if (id) {
            var postData = {
                "id": params.id,
                "user_id": id
            }
            try {
                let responseData = await TournamentService.cancleRegistrationById(postData).json();
                if (responseData.status === true) {
                    getCheckInDataByTournamnetID();
                }
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const checkInById = async (id) => {
        if (id) {
            var postData = {
                "id": params.id,
                "user_id": id
            }
            try {
                let responseData = await TournamentService.checkInById(postData).json();
                if (responseData.status === true) {
                    getCheckInDataByTournamnetID();
                }
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const CancleCheckInById = async (id) => {
        if (id) {
            var postData = {
                "id": params.id,
                "user_id": id
            }
            try {
                let responseData = await TournamentService.CancleCheckInById(postData).json();
                if (responseData.status === true) {
                    getCheckInDataByTournamnetID();
                }
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const plusReBuyById = async (id, reentries) => {
        if (id) {
            if (checkInDetail.maxreentries <= reentries) {
                setCurrentPlayerID(id)
                setShow(true)
            } else {
                var postData = {
                    "id": params.id,
                    "user_id": id
                }
                try {
                    let responseData = await TournamentService.plusReBuyById(postData).json();
                    if (responseData.status === true) {
                        getCheckInDataByTournamnetID();
                    }
                    setisloading(false)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    const minusReBuyById = async (id) => {
        if (id) {
            var postData = {
                "id": params.id,
                "user_id": id
            }
            try {
                let responseData = await TournamentService.minusReBuyById(postData).json();
                if (responseData.status === true) {
                    getCheckInDataByTournamnetID();
                }
                setisloading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const plusReBuyModalTrue = async () => {

        var postData = {
            "id": params.id,
            "user_id": currentPlayerID
        }
        try {
            let responseData = await TournamentService.plusReBuyById(postData).json();
            if (responseData.status === true) {
                getCheckInDataByTournamnetID();

            }
            setisloading(false)
            setShow(false)
        } catch (error) {
            console.log(error)
            setShow(false)
        }
    }

    const checkoutTournament = async () => {
        var postData = {
            "id": params.id,
        }
        try {
            let responseData = await TournamentService.checkoutTournament(postData).json();
            if (responseData.status === true) getCheckInDataByTournamnetID();
        } catch (error) {
            console.log(error)
            setisloading(false)
        }
    }

    const plusReBuyModalFalse = async () => {
        setCurrentPlayerID(0)
        setShow(false)
    }


    const MaxNumberPlayerincNum = () => {
        setMaxNumberPlayer(Number(MaxNumberPlayer) + 1);
        updateMax_res_player();
    };
    const MaxNumberPlayerdecNum = () => {
        if (MaxNumberPlayer > 0) {
            setMaxNumberPlayer(MaxNumberPlayer - 1);
            updateMax_res_player();
        }

    }
    const ReservedPlayerincNum = () => {
        setReservedPlayer(Number(ReservedPlayer) + 1);
        updateMax_res_player();
    };
    const ReservedPlayerdecNum = () => { if (ReservedPlayer > 0) setReservedPlayer(ReservedPlayer - 1) }
    function updateMax_res_player() {
        var postData = {
            "tournament_id": params.id,
            "maxplayers": MaxNumberPlayer,
            "reservedplayers": ReservedPlayer,
        }
        try {
            let responseData = TournamentService.updateMax_res_player(postData).json();
            if (responseData.status === true) {
                getCheckInDataByTournamnetID();
            }
            setisloading(false)
        } catch (error) {
            console.log(error)
        }

    }
    const handleChangeMaxPlayerCounter = (e) => {
        setMaxNumberPlayer(e.target.value);
    }
    const handleChangeReservedPlayerCounter = (e) => {
        setReservedPlayer(e.target.value);
    }

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            getCheckInDataByTournamnetID();
        }
        else {
            navigate('/')
        }

    }, [])


    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: "16px",
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: "16px",
                padding: '0.75rem',
            },
        },
        pagination: {
            style: {
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
            }
        }
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Showing',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const RegisterPlayerColumns = [
        {
            name: 'Name',
            selector: row => row.firstname + ' ' + row.lastname,
            sortable: true,
        },
        {
            name: 'Nickname',
            selector: row => row.nickname,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phonenumber,
            sortable: true,
        },
        {
            name: 'Registration Date',
            selector: row => Moment(row.created).format('ddd d.mm.yyyy HH:mm'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => <> {TournamentData.closed == 0 ? row.ischeckedin ? <><div className='action-reentries'>Re-entries:{row.reentries} <Link className='btn btn-outline-primary' onClick={() => { plusReBuyById(row.id, row.reentries) }}>+</Link><Link className='btn btn-outline-primary' onClick={() => { minusReBuyById(row.id) }}>-</Link></div><div><Link id={row.id} className='action-link red-link mb-1' onClick={() => { CancleCheckInById(row.id) }}>Cancle Checkin</Link></div></> : <div><Link className='action-link green-link mb-1' onClick={() => { checkInById(row.id) }}>Checkin Player</Link><Link id={row.id} className='action-link red-link mb-1' onClick={() => { cancleRegistration(row.id) }}>Cancle Registration</Link></div> : '-'}</>,
        }
    ];

    const WaitingPlayerColumns = [
        {
            name: 'Name',
            selector: row => row.firstname + ' ' + row.lastname,
            sortable: true,
        },
        {
            name: 'Nickname',
            selector: row => row.nickname,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phonenumber,
            sortable: true,
        },
        {
            name: 'Registration Date',
            selector: row => Moment(row.created).format('ddd d.mm.yyyy HH:mm'),
            sortable: true,
        }
    ];

    const RegistrationLogColumns = [
        {
            name: 'Player',
            selector: row => row.player,
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => { if (row.action === 1) return 'Unregistered'; else if (row.action === 2) return 'Registered'; else return 'Waiting List'; },
            sortable: true,
        },
        {
            name: 'Datetime',
            selector: row => Moment(row.datetime).format('ddd d.mm.yyyy HH:mm'),
            sortable: true,
        }
    ];



    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    {/* <Col md={2}>
                        <MyProfileLeftNav />
                    </Col> */}
                    <Col md={10} lg={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                <Link to="/director/all-tournaments">{t('page.myprofile.myprofilenav.All tournaments.Tournaments')}</Link> <FontAwesomeIcon icon={faArrowRight} /> {TournamentData.title} <FontAwesomeIcon icon={faArrowRight} />
                                &nbsp;{t('page.myprofile.myprofilenav.All tournaments.checkIn')}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <div className='d-flex d-lg-block font-size-mobile'>
                                            <Row>
                                                <Col md={8} className='mb-1 mb-lg-3'>
                                                    Registered Players
                                                </Col>
                                                <Col md={4}>
                                                    {ReservedPlayer}/{MaxNumberPlayer}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={8} className='mb-1 mb-lg-3'>
                                                    Checked in Players
                                                </Col>
                                                <Col md={4}>
                                                    {TournamentData.checkins}/{MaxNumberPlayer}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={8} className='mb-1 mb-lg-3'>
                                                    Re-entries
                                                </Col>

                                                <Col md={4}>
                                                    {TournamentData.reentries}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className='d-flex d-lg-block font-size-mobile mt-3 mt-lg-0'>
                                            <Row>
                                                <Col md={8} className='mb-3'>
                                                    <span className='w-90'>Max Number of Players*</span>
                                                </Col>
                                                <Col md={4} className='player-info'>
                                                    <div className="input-group-prepend">
                                                        <button className="btn btn-outline-primary" type="button" onClick={MaxNumberPlayerdecNum}>-</button>
                                                    </div>
                                                    <div><input type="text" className="form-control" value={MaxNumberPlayer} onChange={handleChangeMaxPlayerCounter} /></div>
                                                    <div className="input-group-prepend">
                                                        <button className="btn btn-outline-primary" type="button" onClick={MaxNumberPlayerincNum}>+</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={8} className='mb-3'>
                                                    Reserved Places
                                                </Col>
                                                <Col md={4} className='player-info'>
                                                    <div className="input-group-prepend">
                                                        <button className="btn btn-outline-primary" type="button" onClick={ReservedPlayerdecNum}>-</button>
                                                    </div>
                                                    <div><input type="text" className="form-control" value={ReservedPlayer} onChange={handleChangeReservedPlayerCounter} /></div>
                                                    <div className="input-group-prepend">
                                                        <button className="btn btn-outline-primary" type="button" onClick={ReservedPlayerincNum}>+</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Row>
                                            <Col xs={5} md={8} className='mb-3 font-size-mobile mt-3 mt-lg-0'>
                                                Register Player
                                            </Col>
                                            <Col xs={7} md={12} className='player-info'>
                                                <Select
                                                    options={RegisterPlayerList}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Search to add"
                                                    value={selectedOptions}
                                                    onChange={(e) => { handleSelectChange(e) }}
                                                    isSearchable={true}
                                                    onInputChange={(e) => { handleSelect(e) }}

                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={4}>
                                        <div className='player-button'>
                                            <div><p><Button className="btn btn-primary" >Create a player account</Button></p>
                                                {TournamentData.closed == 0 ? <p><Button className="btn btn-primary" onClick={() => { checkoutTournament() }} >Checkout tournament</Button></p> : ''}
                                            </div><div><p><Link className="btn btn-primary" to={`/director/edit/${TournamentData.slug}`}>Edit tournament</Link></p>
                                                <p><Button className="btn btn-primary" >Show only unchecked</Button></p></div>
                                        </div>
                                    </Col>
                                </Row>
                                <h2>Registerd Players:</h2>
                                <DataTable
                                    columns={RegisterPlayerColumns}
                                    data={RegisterPlayerData.data}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}

                                />
                                {TournamentData.closed == 0 ?
                                    <>
                                        <h2 className='mb-3'>Waiting List:</h2>
                                        <DataTable
                                            className='waitingTable'
                                            columns={WaitingPlayerColumns}
                                            data={WaitingPlayerData}
                                            customStyles={customStyles}
                                            pagination
                                            paginationComponentOptions={paginationComponentOptions}
                                        />
                                    </>
                                    : ''}
                                <h2 className='mt-3'>Registration Log:</h2>
                                <DataTable
                                    columns={RegistrationLogColumns}
                                    data={RegistrationLog}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
                <Modal show={show} onHide={() => { plusReBuyModalFalse() }} size="xl">
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className="p-0">
                        <div className="tournament-description-wrap">
                            <Row className="flex-column-reverse flex-md-row">
                                <Col md={12} lg={12}>
                                    <div className="players-Template-wrap">
                                        <h3>
                                            Are you sure you want to increase the player re-entry count? Maximum numbers of re-entry already excited.
                                        </h3>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-center mt-3">
                                    <Link onClick={() => { plusReBuyModalTrue() }} className="btn btn-primary load-more-btn">
                                        <b> Yes </b>
                                    </Link>
                                    <Link onClick={() => { plusReBuyModalFalse() }} className="btn btn-primary load-more-btn ml-5">
                                        <b> No </b>
                                    </Link>
                                </Col>

                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="mb-50 d-block d-md-none text-end">
                        <Link onClick={() => { plusReBuyModalFalse() }}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.9692 0L20 1.03084L1.03076 20L0 18.9699L18.9692 0Z"
                                    fill="#F7F5F5"
                                ></path>
                                <path
                                    d="M1.03076 0L20 18.9685L18.9692 20L0 1.03153L1.03076 0Z"
                                    fill="#F7F5F5"
                                ></path>
                            </svg>
                        </Link>
                    </Modal.Footer>
                </Modal>
            </div >

            {isLoading && <LogoAnimationLoader />}
        </>
    );
};

export default CheckInDirectorTournament;