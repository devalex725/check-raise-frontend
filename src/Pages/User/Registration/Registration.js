import '../../../assets/flag.css';
import './Registration.scss';
import React, { useState, useRef } from 'react';

import {
    Button,
    Col,
    Row,
} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputPhoneComponent from '../../../components/InputPhone/InputPhone';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import PlayerRegistration from '../../../api/services/RegisterService';
import {
    faEye,
    faEyeSlash,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoomService from '../../../api/services/RoomService';
const Registration = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

    const [language, setLanguage] = useState('');
    const [profineName, setProfileName] = useState('');
    const options = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
    ]
    const profileNameOption = [
        { value: 'public_nic', label: 'Name Surname' },
        { value: 'private', label: 'Nickname (If applicable)' },
        { value: 'anonymous', label: 'Anonymous' }
    ]
    const inputRef = useRef({});
    const [show, setShow] = useState(false);
    const [formRefSt, setFormRefst] = useState("");
    const [modalData, setModalData] = useState('');
    const [pokerCity, setPokerCity] = useState("");
    const [phonecode, setPhonecode] = useState("");
    const [phonecountry, setPhonecountry] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [phonenumber, setPhonenumber] = useState("");
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [passwordReShown, setPasswordReShown] = useState(false);
    const togglePasswordReVisiblity = () => {
        setPasswordReShown(passwordReShown ? false : true);
    };
    const [error, setError] = useState();
    const handleLanguage = (e) => {

        setLanguage(e)
    }
    const handleProfileOption = (e) => {

        setProfileName(e);
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
    const handleZipcodeChange = async (event) => {
        event.preventDefault();
        var code = event.target.value;
        try {
            const res = await RoomService.getCity(code).json();

            setPokerCity(res.data.city)

        }
        catch (error) {

            setPokerCity('')

            console.error("Error When Get City", error);
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
            if (inputRef.current['firstname'].value === '') {
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

    const onSubmitHandler = async (event) => {

        setShow(false);
        setError("")
        event.preventDefault();

        try {
            var userData = {
                username: event.target.firstname.value + event.target.lastname.value,
                email: event.target.email.value,
                password: event.target.password.value,
                firstname: event.target.firstname.value,
                lastname: event.target.lastname.value,
                dob: event.target.dob.value,
                street: event.target.street.value,
                language: language,
                city: pokerCity,
                nickname: event.target.nickname.value,
                zipcode: event.target.zipcode.value,
                phonecode: "+" + phonecode,
                phonecountry: phonecountry,
                phonenumber: phonenumber,
                displayoption: profineName,
            }


            const data = await PlayerRegistration.create(userData).json();

            if (data.status === true) {
                navigate('/login');
            }
        }

        catch (error) {
            // Handle API errors
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }

    return (
        <>
            <main>
                <div className='wrapper'>
                    <Row className='justify-content-center'>
                         <Col md={10} lg={12}> 

                            <h1 className="text-center">{t('page.registration.Create player account')}</h1>
                            <div className='login-formwrap register-formwrap'>
                                <Form name="form" onSubmit={onSubmitHandler} ref={ref => setFormRef(ref)}>
                                    <Row>

                                        <Col md={12} className='mt-3'>
                                            <div className='general-info'>
                                                <p>{t('page.registration.The fields must match the information on the ID that you will need to present when you arrive at the tournaments')}.</p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="firstname">
                                                <Form.Label>{t('page.registration.Name')}*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstname"
                                                    placeholder={t('page.registration.Name')}
                                                    ref={el => inputRef.current['firstname'] = el}
                                                    className='' />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="date">
                                                <Form.Label>{t('page.registration.Date of birth')}*</Form.Label>
                                                <Form.Control
                                                    name="dob"
                                                    type="date"
                                                    placeholder="DD.MM.YYYY"
                                                    ref={el => inputRef.current['dob'] = el}
                                                    className='' />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="lastname">
                                                <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                                <Form.Control type="text" name="lastname" placeholder={t('page.registration.Surname')} className='' ref={el => inputRef.current['surname'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="street">
                                                <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                                <Form.Control name="street" type="text" placeholder={t('page.registration.Street and number')} className='' ref={el => inputRef.current['street'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="nickname">
                                                <Form.Label>{t('page.registration.Nickname')}*</Form.Label>
                                                <Form.Control type="text" name="nickname" placeholder={t('page.registration.Nickname')} className='' ref={el => inputRef.current['nickname'] = el} />
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="language">
                                                <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                                <Select name="language" options={options} className=" react-select-container" onChange={(e) => handleLanguage(e.value)}
                                                    classNamePrefix="react-select" ref={el => inputRef.current['language'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>{t('page.registration.E-Mail')}*</Form.Label>
                                                <Form.Control type="email" name="email" placeholder={t('page.registration.E-Mail')} className='' ref={el => inputRef.current['email'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>

                                            <Form.Group className="mb-3" controlId="zipcode">
                                                <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                <Form.Control name="zipcode" type="text" onBlur={(e) => handleZipcodeChange(e, 'poker')} placeholder="e.g. 774843" className='' ref={el => inputRef.current['zipcode'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 position-relative" controlId="password">
                                                <Form.Label>{t('page.registration.Password')}*</Form.Label>
                                                <Form.Control type={passwordShown ? "text" : "password"} name="password" placeholder={t('page.registration.Password')} className='' ref={el => inputRef.current['password'] = el} />
                                                <span className='faEye-icon' >
                                                    <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                                </span>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="city">
                                                <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                <Form.Control name="city" type="text" placeholder="City" className='' onChange={(e) => setPokerCity(e.target.value)} value={pokerCity} ref={el => inputRef.current['city'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 position-relative" controlId="confpassword">
                                                <Form.Label>{t('page.registration.Repeat password')}*</Form.Label>
                                                <Form.Control type={passwordReShown ? "text" : "password"} name="confpassword" placeholder={t('page.registration.Repeat password')} className='' ref={el => inputRef.current['confirmpassword'] = el} />
                                                <span className='faEye-icon'>
                                                    <i onClick={togglePasswordReVisiblity} >{passwordReShown ? eye : eyeSlash}</i>
                                                </span>
                                            </Form.Group>
                                        </Col>



                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>{t('page.registration.Visible detail for the other players')} *</Form.Label>
                                                <Select name="displayoption" options={profileNameOption} className=" react-select-container"
                                                    onChange={(e) => handleProfileOption(e.value)}
                                                    classNamePrefix="react-select" ref={el => inputRef.current['displayoption'] = el} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>

                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>


                                                <div className='flag-select custom-phone-field'>
                                                    <InputPhoneComponent fn={handleOnChange} />
                                                </div>



                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-1" controlId="name">
                                                <Form.Label>&nbsp;</Form.Label>
                                                <div key="checkbox" className="mb-1 d-flex flex-wrap">


                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="name">

                                            </Form.Group>
                                        </Col>

                                        <Col md={12} className="text-center mt-5">
                                            <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>

                                            <p className="error">{error}</p>
                                            <div key="confim" className="mb-1 d-flex justify-content-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="confim"
                                                    label={t('page.registration.I confirm that I am already 18 years old')}
                                                />
                                            </div>
                                            <Button type="submit" className=" btn btn-primary btn-submit" onClick={handleConfirmation}>{t('page.registration.Create account')}</Button>
                                        </Col>
                                        <Col md={12} className='text-center mt-5 d-flex justify-content-center'>
                                            <p className="mb-0">{t('page.registration.Already have an account')}?</p>&nbsp;   <Link to='/login' className='ms-1'>{t('page.registration.Login here')}</Link>
                                        </Col>
                                    </Row>

                                </Form>
                            </div>
                        </Col>
                    </Row>

                    <Modal show={show} >
                        <Modal.Header closeButton onClick={() => setShow(false)}>
                            <Modal.Title>{modalData && modalData.data.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{modalData && modalData.data.content}</Modal.Body>
                        <Modal.Footer>
                            <Button varient="primary" onClick={submitForm}>{t('page.managerRegister.Registration')}</Button>

                            <Button variant="secondary" onClick={() => {
                                setError('')
                                setShow(false)
                            }}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </main >
        </>
    );
};

export default Registration;