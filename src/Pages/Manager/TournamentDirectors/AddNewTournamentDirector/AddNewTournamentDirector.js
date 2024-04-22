import React, { useState, useEffect } from 'react';
import MyProfileLeftNavManager from '../../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import TournamentService from '../../../../api/services/TournamentService';
const AddNewTournamentDirector = () => {
    const { t } = useTranslation();
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [Error, setError] = useState('');
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const handleRegister = async (event) => {
        event.preventDefault();
        var userData = {
            name: event.target.firstname.value,
            surname: event.target.surname.value,
            email: event.target.email.value,
            password: event.target.password.value,
        }

        if (userData.name === '') {
            setError("Please Fill All Fields*.");
        }
        else if (userData.surname === '') {
            setError("Please Fill All Fields*.");
        }

        else if (userData.email === '') {
            setError("Please Fill All Fields*.");
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.email)) {
            setError("Please Enter Valid Email*.");
        }
        else if (userData.password === '') {
            setError("Please Fill All Fields*.");
        }
        else {
            try {
                var userData = {
                    name: event.target.firstname.value,
                    surname: event.target.surname.value,
                    email: event.target.email.value,
                    password: event.target.password.value,
                }
                let responseData = await TournamentService.storeDirector(userData).json()
                if (responseData.status == true) {
                    setModelShow(true)
                    setModalMessage(responseData.message)
                    setError('')

                }
            } catch (error) {
                if (error.name === 'HTTPError') {
                    const errorJson = await error.response.json();
                    console.log(errorJson)
                    setError("Player name already used..");

                }
            }
        }


    }
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {

            // getRoomPlayer();
        }
        else {
            navigate('/')
        }

    }, [])
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
                                <Link to="/manager/tournament-directors" className=''>{t('page.Manager.TournamentdirectorsTitle')}</Link> <FontAwesomeIcon icon={faArrowRight} /> {t('page.Manager.Tournamentdirectors.AddNewTournamentDirectorTitle')}
                            </Card.Header>
                            <Card.Body>
                                <Row className='my-4'>
                                    <Col md={6}>
                                        <Form onSubmit={handleRegister}>
                                            <Form.Group className="mb-3 form-group p-0" controlId="">
                                                <Form.Label>{t('page.Manager.Tournamentdirectors.Name')}<span className='required'>*</span></Form.Label>
                                                <Form.Control name='firstname' type="text" className='' placeholder={t('page.Manager.Tournamentdirectors.Name')} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group p-0" controlId="">
                                                <Form.Label>{t('page.Manager.Tournamentdirectors.Surname')}<span className='required'>*</span></Form.Label>
                                                <Form.Control name='surname' type="text" className='' placeholder={t('page.Manager.Tournamentdirectors.Surname')} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group p-0" controlId="">
                                                <Form.Label>{t('page.Manager.Tournamentdirectors.E-MailAddress')}<span className='required'>*</span></Form.Label>
                                                <Form.Control type="text" className='' name='email' placeholder={t('page.Manager.Tournamentdirectors.E-MailAddress')} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group p-0 position-relative password-icon-align" controlId="formBasicPassword">
                                                <Form.Label>{t('page.login.Password')}</Form.Label>
                                                <Form.Control type={passwordShown ? "text" : "password"} name='password' placeholder={t('page.login.Password')} />
                                                <span className='faEye-icon' >
                                                    <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                                </span>
                                            </Form.Group>

                                            <Form.Group className="mb-3 form-group p-0" controlId="">

                                                <p className="error">{Error}</p>

                                                <Button to="" className='btn btn-primary' type='submit'> {t('page.Manager.Tournamentdirectors.Register')}</Button>
                                            </Form.Group>


                                        </Form>


                                    </Col>
                                </Row>




                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
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
                                    navigate('/manager/tournament-directors')
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

export default AddNewTournamentDirector;