import React, {
    useRef,
    useState,
    useEffect
} from 'react';
import MyProfileLeftNav from '../../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import '../AddTournament/AddTournament.scss';
import { Tab, Tabs } from 'react-bootstrap';
import TableRow from "./Table";
import { Editor } from "@tinymce/tinymce-react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import RoomService from '../../../../api/services/RoomService';
import DirectorService from '../../../../api/services/DirectorService';
import LogoAnimationLoader from '../../../../components/Loading/LogoAnimationLoader';
import moment from 'moment';

const EditDirectorTournament = () => {
    const apiResponse = useRef();
    const apiResponses = useRef();
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const [count, setCount] = React.useState(0);
    const [RoomId, setRoomId] = useState('');
    const [structureData, setStructureData] = useState([]);
    const [Type, setType] = useState();
    const [Dealers, setDealers] = useState('');
    const [isLoading, setisloading] = useState(true);
    const [startDate, setStartDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );
    const params = useParams()
    const [modalmessage, setModalMessage] = useState('');
    const [Modalshow, setModelShow] = useState(false);
    const [Error, setError] = useState('');
    const [endDate, setEndDate] = useState(
        // setHours(setMinutes(new Date(), 30), 16)
    );

    const [tournament, setTournament] = useState([])
    const [description, setDescription] = useState([])

    const [horthanded, sethorthanded] = useState(0);
    const [Championship, setChampionship] = useState(0);
    const [bonusDate, setBonusDate] = useState(
        // setHours(setMinutes(new Date(), 30), 16)
    );
    const handleChange = (e) => {
        const element = document.getElementsByClassName('custom-error-message-chr')[0];
        const elementTwo = document.getElementsByClassName('custom-error-message-capital')[0];
        let newtext = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

        if (e.target.value.length >= 34) {

            element.classList.add('d-block');
        }
        else {
            element.classList.remove('d-block');
        }

        if ((newtext.match(/[A-Z]/g) || []).length >= 7) {
            elementTwo.classList.add('d-block');
        }
        else {
            elementTwo.classList.remove('d-block');
        }

        setCount(e.target.value.length);
    }
    const languageValue = i18n
    const [checked, setSelected] = useState("checked");

    const changeHandler = e => {
        setSelected(e.target.value);
    };

    const getTournamentData = async (id) => {
        try {

            let responseData = await DirectorService.show(id).json()
            setTournament(responseData.data);
            setCount(responseData.data.title.length)
            setStructureData(responseData.data.structure);
            sethorthanded(responseData.data.detail ? responseData.data.detail.isshorthanded : '')
            setStartDate(new Date(responseData.data.detail ? responseData.data.detail.startday === '0000-00-00 00:00:00' ? new Date() : responseData.data.detail.startday : new Date()))
            // setEndDate(new Date(responseData.data.detail ? responseData.data.detail.lastday === '' ? '' : responseData.data.detail.lastday : new Date()))
            setEndDate(responseData.data ? responseData.data.detail.lastday === null || responseData.data.detail.lastday === '0000-00-00 00:00:00' ? '' : new Date(responseData.data.detail.lastday) : '')
            setBonusDate(responseData.data ? responseData.data.detail.bounusdeadline === null || responseData.data.detail.bounusdeadline === '0000-00-00 00:00:00' ? '' : new Date(responseData.data.detail.bounusdeadline) : '')
            // setStartDate(new Date(responseData.data.detail ? responseData.data.detail.startday === '0000-00-00 00:00:00' ? new Date() : responseData.data.detail.startday : new Date()))
            // setEndDate(new Date(responseData.data.detail ? responseData.data.detail.lastday === '0000-00-00 00:00:00' ? new Date() : responseData.data.detail.lastday : new Date()))
            // setBonusDate(responseData.data ? responseData.data.detail.bounusdeadline === null || responseData.data.detail.bounusdeadline === '0000-00-00 00:00:00' ? '' : new Date(responseData.data.detail.bounusdeadline) : '')
            setChampionship(responseData.data.detail ? responseData.data.detail.ischampionship : '')
            setisloading(false)
            let description = responseData.data.description.filter(function (item) {
                return item.language === languageValue.languages[0];
            });
            if (description[0].description)

                setDescription(description[0].description);

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)

            }
        }
    }

    apiResponses.current = getTournamentData;
    useEffect(() => {

        if (localStorage.getItem('usertoken')) {

            apiResponses.current(params.id)
        }
        else {
            navigate('/')
        }


    }, [params.id])
    const handleCallback = (childData) => {
        // Update the name in the component's state
        setStructureData(childData)


    }
    const handleEditorChange = (e) => {

        setDescription(e.target.getContent());
    }
    const handleSubmit = async (event) => {

        event.preventDefault();


        try {
            var userData = {

                tournament: {
                    title: event.target.title.value,
                    room_id: tournament.room ? tournament.room.id : '',
                    id: tournament.id
                },
                details: {
                    type: Type ? Type : tournament.detail ? tournament.detail.type : '',

                    isshorthanded: horthanded,
                    ischampionship: Championship,
                    dealertype: Dealers ? Dealers : tournament.detail ? tournament.detail.dealertype : '',
                    buyin: event.target.buyin.value,
                    bounty: event.target.bounty.value,
                    rake: event.target.rake.value,
                    maxreentries: event.target.maxreentries.value,
                    startday: moment(startDate).format('YYYY-MM-DD HH:mm'),
                    // startday: moment(startDate).format('YYYY-MM-DD HH:mm'),
                    // lastday: moment(endDate).format('YYYY-MM-DD HH:mm'),
                    // bounusdeadline: moment(bonusDate).format('YYYY-MM-DD HH:mm') === 'Invalid date' ? '' : moment(bonusDate).format('YYYY-MM-DD HH:mm'),  /*endDate*/
                    lastday: endDate ? moment(endDate).format('YYYY-MM-DD HH:mm') : '',   /*endDate*/
                    bounusdeadline: moment(bonusDate).format('YYYY-MM-DD HH:mm') === 'Invalid date' ? '' : moment(bonusDate).format('YYYY-MM-DD HH:mm'),
                    lateregformat: checked ? checked : tournament.detail ? tournament.detail.lateregformat : '',
                    lateregtime: event.target.lateregtime.value,
                    latereground: event.target.latereground.value,
                    startingstack: event.target.startingstack.value,
                    level_duration: event.target.level_duration.value,
                    maxplayers: event.target.maxplayers.value,
                    reservedplayers: event.target.reservedplayers.value
                },
                descriptions: [
                    {

                        language: languageValue.languages[0] ? languageValue.languages[0] : '',
                        description: description.length === 0 ? '' : description
                    }
                ],

                structure: structureData ? structureData : tournament.structure
            }

            let responseData = await DirectorService.update(userData).json()

            if (responseData.status === true) {
                setModelShow(true)
                setModalMessage(responseData.message)
                setError('')
                //
            }

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                if (errorJson.message === 'Undefined array key "structure"') {
                    setError("Please Fill Structure *")
                }
                else {
                    setError(errorJson.message)
                }
            }
        }
    }
    const handleSaveTemplate = async (event) => {

        var userData = {
            id: tournament.room ? tournament.room.id : '',
            title: tournament.room ? tournament.room.title : '',
            structure: structureData
        }
        try {

            let responseData = await DirectorService.save_template(userData).json()
            setModelShow(true)
            setModalMessage(responseData.message)
            setError('')
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }

    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>

                    <Col md={10} lg={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                <Link to="/director/all-tournaments">{t('page.myprofile.myprofilenav.All tournaments.Tournaments')}</Link> <FontAwesomeIcon icon={faArrowRight} /> {t('page.myprofile.myprofilenav.All tournaments.Edittournament')}

                            </Card.Header>
                            <Card.Body>

                                <Form onSubmit={handleSubmit}>

                                    <Form.Group className="form-group" controlId="">


                                        <p className="description mb-10">Select Room <span className='required'>*</span></p>
                                        <Form.Control type="text" className='' name='roomtitle'
                                            defaultValue={tournament.room ? tournament.room.title : ''}
                                            disabled
                                        />

                                    </Form.Group>
                                    <Form.Group className="form-group" controlId="">


                                        <p className="description mb-10">{t('page.myprofile.myprofilenav.All tournaments.addtournament.description')}</p>
                                        <Form.Control type="text" className='' maxLength={34} name='title'
                                            defaultValue={tournament.title}
                                            onChange={handleChange}
                                        />
                                        <span className='span-append'>{t('page.myprofile.myprofilenav.All tournaments.addtournament.Characters')}:  <span id="rchars">{count}</span> / 34</span>
                                        <span className="custom-error-message-capital">{t('page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycapital')}</span>
                                        <span className="custom-error-message-chr">{t('page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycharacters')}</span>
                                    </Form.Group>
                                    <Tabs
                                        defaultActiveKey="tournamentdetails"
                                        id="uncontrolled-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="tournamentdata" title="Tournament data">
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Type')}  <span className='required'>*</span></Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    value={Type ? Type : tournament.detail ? tournament.detail.type : ''}
                                                    onChange={(e) => setType(e.target.value)}>
                                                    <option value="Holdem">Holdem</option>
                                                    <option value="Omaha">Omaha</option>
                                                    <option value="Horse">Horse</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.ShortHanded?')}</Form.Label>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch"
                                                    label=""
                                                    checked={horthanded}
                                                    value={horthanded}

                                                    onChange={() => {

                                                        sethorthanded(horthanded ? 0 : 1)

                                                    }

                                                    }

                                                />
                                            </Form.Group>
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>Championship?</Form.Label>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch123"
                                                    label=""
                                                    checked={Championship}
                                                    value={Championship}

                                                    onChange={() => setChampionship(Championship ? 0 : 1)}


                                                />
                                            </Form.Group>
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Dealers?')}<span className='required'>*</span></Form.Label>
                                                <Form.Select aria-label="Default select example" value={Dealers ? Dealers : tournament.detail ? tournament.detail.dealertype : ''} onChange={(e) => setDealers(e.target.value)}>
                                                    <option value="Dealers" selected="selected" data-i="0">{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Dealers')}</option>
                                                    <option value="Self">{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Self-dealing')}</option>
                                                    <option value="Partly">{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Partlyself-dealing')}</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Buy-in')}<span className='required'>*</span></Form.Label>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='buyin' defaultValue={tournament.detail ? tournament.detail.buyin : ''} />
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Bounty')}<span className='required'>*</span></Form.Label>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='bounty' defaultValue={tournament.detail ? tournament.detail.bounty : ''} />
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Rake')}<span className='required'>*</span></Form.Label>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='rake' defaultValue={tournament.detail ? tournament.detail.rake : ''} />
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.MaxNumber')}<span className='required'>*</span></Form.Label>
                                                <p>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.if')}</p>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='maxreentries' defaultValue={tournament.detail ? tournament.detail.maxreentries : ''} />
                                            </Form.Group>


                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentStartDateTime')}<span className='required'>*</span></Form.Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
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
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label> Bonus registration deadline<span className='required'></span></Form.Label>
                                                <DatePicker
                                                    selected={bonusDate}
                                                    onChange={(date) => setBonusDate(date)}
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
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentEndDate')}</Form.Label>
                                                <p>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Addthisonly')}</p>
                                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}
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

                                            <Form.Group className="border-bottom p-0" controlId="">
                                                <Row>
                                                    <Col md={6}>
                                                        <div className='form-group h-100'>
                                                            <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegFormat')}</Form.Label>
                                                            <Form.Check // prettier-ignore
                                                                type="radio"
                                                                id="default-radio"
                                                                name="lateRegFormat"
                                                                label={t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.WithoutLateRegistration')}
                                                                value="checked"

                                                                checked={checked === "checked"}
                                                                onChange={changeHandler}
                                                            />

                                                            <Form.Check // prettier-ignore
                                                                type="radio"
                                                                id="default-radio1"
                                                                name="lateRegFormat"
                                                                label={t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Time')}
                                                                value="time"
                                                                checked={checked === "time"}
                                                                onChange={changeHandler}
                                                            />

                                                            <Form.Check // prettier-ignore
                                                                type="radio"
                                                                id="default-radio2"
                                                                name="lateRegFormat"
                                                                label={t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Round')}
                                                                value="round"
                                                                checked={checked === "round"}
                                                                onChange={changeHandler}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>

                                                        <Form.Group className="form-group lateRegTime h-100" controlId="" aria-hidden={checked !== "time" ? true : false}>
                                                            <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegTime')}</Form.Label>
                                                            <Form.Control type="text" className='' name='lateregtime' />
                                                        </Form.Group>

                                                        <Form.Group className="form-group lateRegRound h-100" controlId="" aria-hidden={checked !== "round" ? true : false}>
                                                            <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegRound')}</Form.Label>
                                                            <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='latereground' />
                                                        </Form.Group>

                                                    </Col>
                                                </Row>
                                            </Form.Group>

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Startingstack')}<span className='required'>*</span></Form.Label>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='startingstack' defaultValue={tournament.detail ? tournament.detail.startingstack : ''} />
                                            </Form.Group>


                                            <Form.Group className=" form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LevelDuration')}<span className='required'>*</span></Form.Label>
                                                <p>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Ifyourstructure')}</p>
                                                <Form.Control type="text" className='' name='level_duration' defaultValue={tournament.detail ? tournament.detail.level_duration : ''} />
                                            </Form.Group>

                                        </Tab>
                                        <Tab eventKey="players" title="Players">

                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.MaxNumberofplayers')}<span className='required'>*</span></Form.Label>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='maxplayers' defaultValue={tournament.detail ? tournament.detail.maxplayers : ''} />
                                            </Form.Group>

                                            <Form.Group className="form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.NumberofReservedPlaces')}</Form.Label>
                                                <p>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.Thisnumber')}</p>
                                                <Form.Control onWheel={(e) => e.target.blur()} type="number" className='' name='reservedplayers' defaultValue={tournament.detail ? tournament.detail.reservedplayers : ''} min="0" max={tournament.detail ? tournament.detail.maxplayers : 0} />
                                            </Form.Group>
                                        </Tab>
                                        <Tab eventKey="tournamentdetails" title="Tournament details">
                                            <h4>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Structure')}</h4>
                                            <div className='d-flex justify-content-end'>

                                            </div>

                                            <TableRow structure={structureData} parentCallback={handleCallback} />

                                            <div className='border-bottom my-3'></div>

                                            <h4 className='mb-4'>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Tournamentdescription')}</h4>

                                            <Editor
                                                apiKey={process.env.REACT_APP_EDITOR_KEY}
                                                initialValue={description}
                                                name="description"
                                                onChange={handleEditorChange}

                                            />

                                            <div className="mb-4"></div>






                                        </Tab>



                                    </Tabs>
                                    <p className='error'>{Error}</p>
                                    <Form.Group className="form-group text-end" controlId="">
                                        <Button className='me-1' variant='primary' type='submit'>save</Button>

                                        <Button className='me-1' variant='primary' onClick={handleSaveTemplate}>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.SaveasTemplate')}</Button>
                                        <Button variant='secondary'>Cancel</Button>
                                    </Form.Group>


                                </Form>

                            </Card.Body>
                        </Card>

                    </Col>

                </Row>
            </div >
            {isLoading && <LogoAnimationLoader />}
            {Modalshow ? (
                <Modal show={Modalshow}>
                    <>
                        <Modal.Header>
                            <Modal.Title>Saved</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>{modalmessage}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {

                                    setModelShow(false)
                                    navigate('/director/all-tournaments')
                                }}
                            >
                                Okay
                            </Button>
                        </Modal.Footer>
                    </>
                </Modal>
            ) : (
                ''
            )}
        </>
    );
};

export default EditDirectorTournament;