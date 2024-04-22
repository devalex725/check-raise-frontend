import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import InputPhoneComponent from '../../components/InputPhone/InputPhone';
import '../../assets/flag.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoomService from '../../api/services/RoomService';
import Modal from 'react-bootstrap/Modal';
import {
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
const ManagerRegistration = () => {
    const inputRef = useRef({});
    const { t, i18n } = useTranslation();
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
    const [phonecountry, setPhonecountry] = useState('');
    const [phonecode, setPhonecode] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [error, setError] = useState();
    const [pokerCity, setPokerCity] = useState("");
    const [contactCity, setContactCity] = useState("");
    const [formRefSt, setFormRefst] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [canton, setCanton] = useState('');
    const [language, setLanguage] = useState('');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState('');
    const Canton = [
        { value: 'AG', label: 'AG' },
        { value: 'AI', label: 'AI' },
        { value: 'AR', label: 'AR' },
        { value: 'BE', label: 'BE' },
        { value: 'BL', label: 'BL' },
        { value: 'BS', label: 'BS' },
        { value: 'FR', label: 'FR' },
        { value: 'GE', label: 'GE' },
        { value: 'GL', label: 'GL' },
        { value: 'GR', label: 'GR' },
        { value: 'JU', label: 'JU' },
        { value: 'LU', label: 'LU' },
        { value: 'NE', label: 'NE' },
        { value: 'NW', label: 'NW' },
        { value: 'OW', label: 'OW' },
        { value: 'SG', label: 'SG' },
        { value: 'SH', label: 'SH' },
        { value: 'SO', label: 'SO' },
        { value: 'SZ', label: 'SZ' },
        { value: 'TG', label: 'TG' },
        { value: 'TI', label: 'TI' },
        { value: 'UR', label: 'UR' },
        { value: 'VD', label: 'VD' },
        { value: 'VS', label: 'VS' },
        { value: 'ZG', label: 'ZG' },
        { value: 'ZH', label: 'ZH' }
    ]
    const options = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
    ]
    useEffect(() => {

    }, [])
    const handleCanton = (e) => {
        setCanton(e)

    }
    const handleLanguage = (e) => {
        setLanguage(e)
    }
    function handleOnChange(value, data) {
        if (!value) {
          setPhonecountry("");
          setPhonecode("");
          setPhonenumber("");
          return;
        }
        setPhonecountry(data?.countryCode || '');
        setPhonecode(data?.dialCode || '');
        setPhonenumber(value.slice(data?.dialCode?.length));
    }
    const handleZipcodeChange = async (event, type) => {
        event.preventDefault();
        var code = event.target.value;
        try {
            const res = await RoomService.getCity(code).json();
            if (type === "poker") {
                setPokerCity(res.data.city)
            } else {
                setContactCity(res.data.city)
            }
        }
        catch (error) {
            if (type === "poker") {
                setPokerCity('')
            } else {
                setContactCity('')
            }
            
        }
    }
    const setFormRef = formRef => {
        setFormRefst(formRef)
    };
    const submitForm = () => {
        formRefSt.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        )
    };
    const handleConfirmation = async (event) => {

        event.preventDefault();
        try {
            if (inputRef.current['roomname'].value === '') {
                setError("Please Fill All Fields*.");
            }
            else if (inputRef.current['dob'].value === '') {
                setError("Please Fill All Fields*.");
            }
            else if (phonenumber === '') {
                setError("Please Fill All Fields*.");
            }
            else if (inputRef.current['password'].value === '') {
               
                setError("Please Fill All Fields*.");
            }
            else if (inputRef.current['confirmpassword'].value === '') {
                setError("Please Fill All Fields*.");
            }
            else if (inputRef.current['confirmpassword'].value !== inputRef.current['password'].value) {
                setError("Password and Confirm password not same..");
            }
            else {
                const res = await RoomService.getmodalcontent(i18n.resolvedLanguage).json();
                setModalData(res);
                setShow(true);
            }

        }
        catch (error) {

            console.error("Error When Get City", error);
        }
    }

    const handleSubmit = async (event) => {
        setShow(false);
        setError("");
        event.preventDefault();
        // console.log(inputRef.current['password'].value)
        try {
            var userData = {
                username: event.target.firstname.value + event.target.lastname.value,
                firstname: event.target.firstname.value,
                lastname: event.target.lastname.value,
                email: event.target.email.value,
                password: inputRef.current['password'].value,
                dob: event.target.dob.value,
                street: event.target.street.value,
                language: language,
                city: pokerCity,
                zipcode: event.target.zipcode.value,
                phonenumber: phonenumber,
                phonecountry: phonecountry,
                phonecode: "+" + phonecode,
                room: {
                    title: event.target.title.value,
                    details:
                    {
                        street: event.target.streetroom.value,
                        city: contactCity,
                        zipcode: event.target.zipcoderoom.value,
                        canton: canton,
                        contact:event.target.email.value
                    }
                }
            }

            const data = await RoomService.create(userData).json();

            if (data.status === true) {
                navigate('/');
            }

        }
        catch (error) {
            console.log(error)
            setError("Something went wrong", error.message)

        }
    }

    return (
        <>
            <div className='wrapper managerRegister'>
                <Form name="form" onSubmit={handleSubmit} ref={ref => setFormRef(ref)}>
                    <h1 className="d-block text-center">{t('page.managerRegister.PokerRoomDetails')}</h1>
                    <div className="text-center mb-4 after-room-info">{t('page.managerRegister.AfterRoomregistration')}</div>
                    <div className='login-formwrap register-formwrap'>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.managerRegister.PokerRoomName')}*</Form.Label>
                                    <Form.Control type="text" name='title' placeholder={t('page.managerRegister.PokerRoomName')} className='' ref={el => inputRef.current['roomname'] = el} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                    <Form.Control type="text" name='streetroom' placeholder={t('page.registration.Street and number')} className='' />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                    <Form.Control type="text" onBlur={(e) => handleZipcodeChange(e, 'poker')} name='zipcoderoom' placeholder="e.g. 774843" className='' />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.City')}*</Form.Label>
                                    <Form.Control type="text" name='cityroom' onChange={(e) => setPokerCity(e.target.value)} value={pokerCity} placeholder="City" className='' />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.managerRegister.Canton')}*</Form.Label>
                                    <Select options={Canton} className="react-select-container"
                                        classNamePrefix="react-select" onChange={(e) => handleCanton(e.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>


                    <div className="h-120"></div>

                    <h3 className='text-center'>{t('page.managerRegister.Contactperson')}</h3>

                    <div className='login-formwrap register-formwrap'>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.Name')}*</Form.Label>
                                    <Form.Control type="text" name='firstname' placeholder={t('page.registration.Name')} className='' />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="surname">
                                    <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                    <Form.Control type="text" name='lastname' placeholder={t('page.registration.Surname')} className='' ref={el => inputRef.current['surname'] = el} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>{t('page.registration.E-Mail')}*</Form.Label>
                                    <Form.Control type="email" name='email' placeholder={t('page.registration.E-Mail')} className='' ref={el => inputRef.current['email'] = el} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3 position-relative" controlId="password">
                                    <Form.Label>Password*</Form.Label>

                                    <Form.Control type={passwordShown ? "text" : "password"} name="password" placeholder={t('page.registration.Password')} className='' ref={el => inputRef.current['password'] = el} />
                                    <span className='faEye-icon' >
                                        <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                    </span>

                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3 position-relative" controlId="password">
                                    <Form.Label>Repeat password*</Form.Label>

                                    <Form.Control type={passwordShown ? "text" : "password"} name="confirmpassword" placeholder={t('page.registration.Repeat password')} className='' ref={el => inputRef.current['confirmpassword'] = el} />
                                    <span className='faEye-icon' >
                                        <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                    </span>

                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.Date of birth')}*</Form.Label>
                                    <Form.Control type="date" name='dob' placeholder="DD.MM.YYYY" className='' ref={el => inputRef.current['dob'] = el} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                    <Form.Control type="text" name='street' placeholder={t('page.registration.Street and number')} className='' ref={el => inputRef.current['street'] = el} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                    <Form.Control type="text" name='zipcode' onBlur={(e) => handleZipcodeChange(e, 'contact')} placeholder="e.g. 774843" className='' ref={el => inputRef.current['zipcode'] = el} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.City')}*</Form.Label>
                                    <Form.Control type="text" name='city' onChange={(e) => setContactCity(e.target.value)} value={contactCity} placeholder="City" className='' ref={el => inputRef.current['city'] = el} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3 form-group" controlId="name">
                                    <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>

                                    <div className='flag-select custom-phone-field'>
                                        <InputPhoneComponent fn={handleOnChange} />
                                    </div>


                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                    <Select options={options} className=" react-select-container"
                                        classNamePrefix="react-select" onChange={(e) => handleLanguage(e.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-1" controlId="name">
                                    <Form.Label>&nbsp;</Form.Label>
                                    <div key="checkbox" className="mb-1 d-flex flex-wrap">

                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="name">
                                    <div key="confim" className="mb-1 d-flex">
                                        <Form.Check
                                            type="checkbox"
                                            id="confim"
                                            label={t('page.registration.I confirm that I am already 18 years old')}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <p className="error">{error}</p>
                            <Col md={12} className="text-center mt-4">
                                <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>
                                <p className="error" style={{ color: `red`, display: `none` }} >{t('page.registration.Something wrong')}</p>
                            </Col>
                            <Col md={12} className='text-center d-flex justify-content-center'>
                                <Button className='btn btn-link mx-3' type="reset">{t('page.managerRegister.Cancel')}</Button>
                                <Button varient="primary" type="button" onClick={handleConfirmation}>{t('page.managerRegister.Registration')}</Button>

                            </Col>
                        </Row>


                    </div>

                </Form>
            </div>
            <Modal show={show} >
                <Modal.Header closeButton onClick={() => setShow(false)}>
                    <Modal.Title>{modalData && modalData.data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalData && modalData.data.content}</Modal.Body>
                <Modal.Footer>
                    <Button varient="primary" onClick={submitForm}>{t('page.managerRegister.Registration')}</Button>

                    <Button variant="secondary"
                        onClick={() => {
                            setError('')
                            setShow(false)
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManagerRegistration;