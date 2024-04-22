import React, { useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import ReactFlagsSelect from 'react-flags-select';
import '../../../../assets/flag.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MyProfileLeftNav from '../../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './EditManager.scss';

const EditManager = () => {
    const { t } = useTranslation();
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
    const options = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
    ]
    const profileNameOption = [
        { value: 'namesurname', label: 'Name Surname' },
        { value: 'nickname', label: 'Nickname (If applicable)' },
        { value: 'anonymous', label: 'Anonymous' }
    ]
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [passwordReShown, setPasswordReShown] = useState(false);
    const togglePasswordReVisiblity = () => {
        setPasswordReShown(passwordReShown ? false : true);
    };

    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNav />
                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.AllRooms')} <FontAwesomeIcon icon={faArrowRight} /> {t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}

                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <h4>Edit Manager Profile</h4>
                                    </Col>
                                </Row>
                                <div className=''>
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Name')}*</Form.Label>
                                                    <Form.Control type="text" placeholder={t('page.registration.Name')} className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                                    <Form.Control type="text" placeholder={t('page.registration.Surname')} className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3 form-group" controlId="name">
                                                            <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                            <Form.Control type="text" placeholder="Bucharest" className='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3 form-group" controlId="name">
                                                            <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                            <Form.Control type="text" placeholder="e.g. 774843" className='' />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                                    <Form.Control type="text" placeholder={t('page.registration.Street and number')} className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3  form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Password')}*</Form.Label>
                                                    <div className='position-relative'>
                                                        <Form.Control type={passwordShown ? "text" : "password"} placeholder={t('page.registration.Password')} className='' />
                                                        <span className='faEye-icon' >
                                                            <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 position-relative form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Repeat password')}*</Form.Label>
                                                    <div className='position-relative'>
                                                        <Form.Control type={passwordReShown ? "text" : "password"} placeholder={t('page.registration.Repeat password')} className='' />
                                                        <span className='faEye-icon'>
                                                            <i onClick={togglePasswordReVisiblity} >{passwordReShown ? eye : eyeSlash}</i>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Enterprise</Form.Label>
                                                    <Form.Control type="text" placeholder='' className='' />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                                    <Select options={options} className="react-select-container"
                                                        classNamePrefix="react-select" />
                                                </Form.Group>
                                            </Col>


                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.E-Mail')}*</Form.Label>
                                                    <Form.Control type="email" placeholder={t('page.registration.E-Mail')} className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Date of birth')}*</Form.Label>
                                                    <Form.Control type="date" placeholder="DD.MM.YYYY" className='' />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Display name in your profile')} *</Form.Label>
                                                    <Select options={profileNameOption} className="react-select-container"
                                                        classNamePrefix="react-select" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>

                                                    <div className='d-flex w-100 flex-wrap flex-lg-nowrap'>
                                                        <div className='flag-select'>
                                                            {/* https://github.com/ekwonye-richard/react-flags-select/tree/master */}
                                                            <ReactFlagsSelect />
                                                        </div>
                                                        <div className='flag-nput'>
                                                            <Form.Control type="text" className='' />
                                                        </div>
                                                    </div>

                                                </Form.Group>
                                            </Col>



                                            <Col md={12} className="text-center mt-5">
                                                <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>
                                                <p className="error" style={{ color: `red`, display: `none` }} >{t('page.registration.Something wrong')}</p>

                                                <Button type="button" className=" btn btn-primary btn-submit">{t('page.registration.Create account')}</Button>
                                            </Col>

                                        </Row>

                                    </Form>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>

        </>
    );
};

export default EditManager;