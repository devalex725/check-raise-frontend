import React, { useEffect, useState } from 'react';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Card, Table, Form, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import './TournamentDirectors.scss';
import TournamentService from '../../../api/services/TournamentService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';


const TournamentDirectors = () => {
    const { t } = useTranslation();
    const [directorData, setDirectorData] = useState([]);
    const [isLoading, setisloading] = useState(true);
    const [checkVal, setCheckVal] = useState([]);
    const [Error, setError] = useState('');
    const [modalmessage, setModalMessage] = useState('');
    const [DeleteId, setDeleteId] = useState('')


    const [ModelUpdateShow, setModelUpdateShow] = useState(false);
    const [Delete, setDelete] = useState(false)
    const [Modalshow, setModelShow] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState('');

    const DirectorApicall = async () => {
        try {
            let responseData = await TournamentService.director().json()
            setisloading(false)
            setDirectorData(responseData.data);


        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {

        if (localStorage.getItem('usertoken')) {
            DirectorApicall();
        }
        else {

            navigate('/')
        }

    }, [])
    const handleCheck = (val, caps) => {
        return caps.some(item => val === item.cap);
    }
    const handlecheckvalue = (e) => {

        const { value, checked } = e.target;

        if (checked) {

            setCheckVal(current => [...current, value])


        }
        else {
            if (checkVal.length === 0) {
                setCheckVal(current => [...current.filter(val => val !== value)])
            }
            else {
                setCheckVal(current => [...checkVal.filter(val => val !== value)])
            }


        }
    }

    const handleDelete = (e) => {
        setDeleteId(e)
        setModelShow(true)
    }

    const handleDeleteUser = async () => {
        try {

            let responseData = await TournamentService.destroyDirector(DeleteId).json()
            if (responseData.status === true) {
                setisloading(true)
                // setModalMessage(responseData.message)
                setModalMessage("Delete director Successfully!!!")
                setModelShow(false)

                setDelete(true)
                DirectorApicall()
            }

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }

    }

    const handleUpdateUser = async (e) => {


        try {
            var capabilitiesData = e.capabilities.map(({ cap }) => { return cap })


            const arr2 = [...capabilitiesData];
            var userData = {
                user_id: e.id,
                password: password,
                capabilities: checkVal.length === 0 ? arr2 : checkVal

            }

            const data = await TournamentService.directorUpdate(userData).json();
            if (data.status === true) {

                setModalMessage("Setting save Successfully!!!")
                // setModalMessage(data.message)
                setModelUpdateShow(true)

            }

        }
        catch (error) {
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
                    {/* <Col md={2}>
                         {/* <MyProfileLeftNavManager /> */}
                 {/* </Col>  */}
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.Manager.TournamentdirectorsTitle')}
                            </Card.Header>
                            <Card.Body>
                                <Row className='my-4'>
                                    <Col md={12}>
                                        <Form >
                                            <Table responsive className='profile-table table-bordered tournament-directors-table'>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">{t('page.Manager.Tournamentdirectors.ID')}</th>
                                                        <th className="text-center no-wrap">{t('page.Manager.Tournamentdirectors.Password')}</th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Create')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Edit')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Publish')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.UndoPublish')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span className="cml-1 ">{t('page.Manager.Tournamentdirectors.RegisterUnregister')}</span>
                                                                <span className="cml-1 ">{t('page.Manager.Tournamentdirectors.Players')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span className="cml-1 ">{t('page.Manager.Tournamentdirectors.RegisterUnregister')}</span>
                                                                <span className="cml-1 ">{t('page.Manager.Tournamentdirectors.Playersnotin')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Sendemail')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Checkin')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Checkout')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.UndoCheckout')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Archive')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Delete')}</span>
                                                            </div>
                                                        </th>
                                                        <th className="vertical-text">
                                                            <div>
                                                                <span>{t('page.Manager.Tournamentdirectors.Export')}</span>
                                                            </div>
                                                        </th>
                                                        <th>

                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                       directorData && directorData.map((element, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{element.email}</td>
                                                                    { }
                                                                    <td>
                                                                        <div className='form-group p-0'>
                                                                            <Form.Control type="password"
                                                                                name="password"

                                                                                className=''
                                                                                onChange={(e) => setPassword(e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <Form.Check

                                                                            type="checkbox"
                                                                            id="create_tournament"
                                                                            label=''
                                                                            name='create_tournament'
                                                                            defaultChecked={handleCheck("create_tournament", element.capabilities)}
                                                                            value="create_tournament"

                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }


                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Check

                                                                            type="checkbox"
                                                                            id="edit_tournament"
                                                                            label=''
                                                                            name='edit_tournament'
                                                                            value="edit_tournament"
                                                                            defaultChecked={handleCheck("edit_tournament", element.capabilities)}

                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />

                                                                    </td>
                                                                    <td>
                                                                        <Form.Check

                                                                            type="checkbox"
                                                                            id="publish_tournament"
                                                                            label=''
                                                                            name='publish_tournament'
                                                                            value="publish_tournament"
                                                                            defaultChecked={handleCheck("publish_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="undo_publish_tournament"
                                                                            label=''
                                                                            name='undo_publish_tournament'
                                                                            value="undo_publish_tournament"
                                                                            defaultChecked={handleCheck("undo_publish_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element,)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="register_players"
                                                                            label=''
                                                                            name='register_players'
                                                                            value='register_players'
                                                                            defaultChecked={handleCheck("register_players", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="draft_tournament"
                                                                            label=''
                                                                            name='draft_tournament'
                                                                            value='draft_tournament'
                                                                            defaultChecked={handleCheck("draft_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="send_email"
                                                                            label=''
                                                                            name='send_email'
                                                                            value='send_email'
                                                                            defaultChecked={handleCheck("send_email", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="checkin_tournament"
                                                                            label=''
                                                                            name='checkin_tournament'
                                                                            value='checkin_tournament'
                                                                            defaultChecked={handleCheck("checkin_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="checkout_tournament"
                                                                            label=''
                                                                            name='checkout_tournament'
                                                                            value='checkout_tournament'
                                                                            defaultChecked={handleCheck("checkout_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="undo_checkout_tournament"
                                                                            label=''
                                                                            name='undo_checkout_tournament'
                                                                            value='undo_checkout_tournament'
                                                                            defaultChecked={handleCheck("undo_checkout_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="archive_tournament"
                                                                            label=''
                                                                            name='archive_tournament'
                                                                            value='archive_tournament'
                                                                            defaultChecked={handleCheck("archive_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="delete_tournament"
                                                                            label=''
                                                                            name='delete_tournament'
                                                                            value='delete_tournament'
                                                                            defaultChecked={handleCheck("delete_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="export_tournament"
                                                                            label=''
                                                                            name='export_tournament'
                                                                            value='export_tournament'
                                                                            defaultChecked={handleCheck("export_tournament", element.capabilities)}
                                                                            onChange={(e) => {
                                                                                var capabilitiesData = element.capabilities.map(({ cap }) => { return cap })
                                                                                setCheckVal(capabilitiesData)
                                                                                handlecheckvalue(e, element)
                                                                            }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Link onClick={

                                                                            (e) => handleUpdateUser(element)
                                                                        } className='btn btn-link'>{t('page.Manager.Tournamentdirectors.Save')}</Link>
                                                                    </td>
                                                                    <td>
                                                                        <Link onClick={(e) => handleDelete(element.id)} className='btn btn-link'>{t('page.Manager.Tournamentdirectors.Delete')}</Link>
                                                                    </td>


                                                                </tr>
                                                            )
                                                        })



                                                    }

                                                </tbody>
                                            </Table>
                                        </Form>
                                    </Col>

                                </Row>
                                <Col>
                                    <p className="error">{Error}</p>
                                </Col>
                                <Row>

                                    <Col md={8}>
                                        <p>{t('page.Manager.Tournamentdirectors.Tournamentdirectorsareyour')}.<br />
                                            {t('page.Manager.Tournamentdirectors.Itisuptoyoutodefine')}.</p>
                                    </Col>
                                    <Col md={4} className='text-end'>
                                        <Link to="/manager/tournament-directors/add-new-tournament-director" className='btn btn-primary'>{t('page.Manager.Tournamentdirectors.NewTournamentDirector')}</Link>
                                    </Col>
                                </Row>


                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
            {isLoading && <LogoAnimationLoader />}

            <Modal show={Modalshow}>
                <>
                    <Modal.Header>
                        <Modal.Title>Alert</Modal.Title>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setModelShow(false)}
                        ></button>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete tournament director?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setModelShow(false)}>
                            Close
                        </Button>
                        <Button variant="secondary" onClick={() => handleDeleteUser()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </>
            </Modal>
            {Delete ? (
                <Modal show={Delete}>
                    <>
                        <Modal.Header>
                            <Modal.Title>Deleted</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>{modalmessage}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    DirectorApicall()
                                    setDelete(false)
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

            <Modal show={ModelUpdateShow}>
                <>
                    <Modal.Header>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>{modalmessage}</Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                DirectorApicall()
                                setModelUpdateShow(false)
                            }}
                        >
                            Okay
                        </Button>
                    </Modal.Footer>
                </>
            </Modal>

        </>
    );
};

export default TournamentDirectors;