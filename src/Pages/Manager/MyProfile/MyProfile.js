import React, { useState, useEffect } from 'react';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import InputPhoneComponent from '../../../components/InputPhone/InputPhone';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './MyProfile.scss';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import MyProfileService from '../../../api/services/MyProfileService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import RoomService from '../../../api/services/RoomService';
import Modal from 'react-bootstrap/Modal';
import { getClearPhoneNumber } from "../../../utils";
const MyProfile = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [Error, setError] = useState('');
    const [modalmessage, setModalMessage] = useState('');
    const [Modalshow, setModelShow] = useState(false);
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
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
    const [isLoading, setisloading] = useState(true);
    const [passwordShown, setPasswordShown] = useState(false);
    const [selectedLanguange, setSelectedLanguange] = useState('');
    const [displayoption, setDisplayoption] = useState('');


    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [passwordReShown, setPasswordReShown] = useState(false);
    const togglePasswordReVisiblity = () => {
        setPasswordReShown(passwordReShown ? false : true);
    };
    const [phonecountry, setPhonecountry] = useState("");
    const [phonecode, setPhonecode] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [phonedisplay, setPhoneDisplay] = useState("");
    const [userData, setUserData] = useState([])
    const [pokerCity, setPokerCity] = useState("");
    const getProfileList = async () => {

        try {

            let responseData = await MyProfileService.Show().json()
            setUserData(responseData.data)
            let selectedlanguage = options.filter(function (item) {

                return item.value === responseData.data.language;
            });
            setSelectedLanguange(selectedlanguage)
            let selectedProfileNameOption = profileNameOption.filter(function (item) {

                return item.value === responseData.data.displayoption;
            });
            setDisplayoption(selectedProfileNameOption)

            const clearPhoneNumber = getClearPhoneNumber(responseData.data.phonenumber || '');
            setPokerCity(responseData.data.city)
            setPhoneDisplay(responseData.data.phonecode + clearPhoneNumber);
            setPhoneNumber(clearPhoneNumber);


            setisloading(false)

        } catch (error) {
            console.log(error)
        }
    }
    const handleZipcodeChange = async (event, type) => {
        event.preventDefault();
        var code = event.target.value;
        try {
            const res = await RoomService.getCity(code).json();
            if (type === "poker") {
                setPokerCity(res.data.city)
            }
        }
        catch (error) {
            if (type === "poker") {
                setPokerCity('')
            }

        }
    }
    useEffect(() => {

        if (localStorage.getItem('usertoken')) {
            getProfileList()
        } else {
            navigate('/')
        }

    }, [])

    function handleOnChange(value, data) {
        if (!value) {
          setPhonecountry("");
          setPhonecode("");
          setPhoneNumber("");
          return;
        }
        setPhonecountry(data?.countryCode || '');
        setPhonecode(data?.dialCode || '');
        setPhoneNumber(value.slice(data?.dialCode?.length));

    }
    const handleLanguage = selectedLanguange => {
        setSelectedLanguange(selectedLanguange);

    }
    const handleProfileOption = displayoption => {
        setDisplayoption(displayoption);

    }

    const handleProfile = async (event) => {
        event.preventDefault();
        if (event.target.password.value !== event.target.confirmpassword.value) {
            setError("Password and Confirm password not same..");
        }
        else {
            try {
                const data = await MyProfileService.update(
                    {
                        firstname: event.target.firstname.value,
                        lastname: event.target.lastname.value,
                        dob: event.target.dob.value,
                        street: event.target.street.value,
                        language: selectedLanguange.value ? selectedLanguange.value : userData.language,
                        nickname: event.target.nickname.value,
                        city: event.target.city.value,
                        zipcode: event.target.zipcode.value,
                        displayoption: displayoption.value ? displayoption.value : userData.displayoption,
                        phonecountry: phonecountry ? phonecountry : userData.phonecountry,
                        phonecode: phonecode ? phonecode : userData.phonecode,
                        phonenumber: phonenumber ? phonenumber : userData.phonenumber,
                        newpassword: event.target.password.value
                    }

                ).json();

                if (data.status === true) {
                    setModelShow(true)
                    setModalMessage(data.message)
                    setError('')
                }
                else {
                    setError("Please Fill All Fields* ")
                }
            }
            catch (error) {
                if (error.name === 'HTTPError') {
                    const errorJson = await error.response.json();

                    setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                }
            }
        }
    }
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='d-none d-md-flex'>
                    <Col className='text-center'>
                        <h1 className="d-block">{t('page.changeprofile')}</h1>
                    </Col>
                </Row>
                <Row className=''>
                    {/* <Col md={2}>
                        <MyProfileLeftNavManager />
                    </Col> */}
                    <Col md={10} lg={12}>
                        <Row className='d-flex d-md-none'>
                            <Col className='text-center'>
                                <h1 className="d-block">{t('page.changeprofile')}</h1>
                            </Col>
                        </Row>
                        <div className='login-formwrap register-formwrap my-profile-formwrap'>
                            <Form onSubmit={handleProfile}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Name')}*</Form.Label>
                                            <Form.Control type="text" placeholder={t('page.registration.Name')} className=''
                                                name="firstname"
                                                defaultValue={userData.firstname}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group email-group" controlId="name">
                                            <Form.Label>{t('page.registration.E-Mail')}*
                                                <OverlayTrigger
                                                    key="top"
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id="tooltip-top">
                                                            {t('page.registration.Bychangingemailaddress')}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                                </OverlayTrigger></Form.Label>
                                            <Form.Control type="email" placeholder={t('page.registration.E-Mail')} className=''
                                                name="email"
                                                defaultValue={userData.email}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t('page.registration.Surname')}
                                                className=''
                                                name="lastname"
                                                defaultValue={userData.lastname}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>

                                            <div className='flag-select'>
                                                <InputPhoneComponent fn={handleOnChange} phonecode={phonedisplay} />
                                            </div>



                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t('page.registration.Street and number')}
                                                className=''
                                                name="street"
                                                defaultValue={userData.street}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group position-relative" controlId="name">
                                            <Form.Label>{t('page.registration.Newpassword')}*</Form.Label>
                                            <Form.Control type={passwordReShown ? "text" : "password"} placeholder={t('page.registration.Newpassword')} className=''
                                                name="password"

                                            />
                                            <span className='faEye-icon'>
                                                <i onClick={togglePasswordReVisiblity} >{passwordReShown ? eye : eyeSlash}</i>
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                    <Form.Control onWheel={(e) => e.target.blur()} type="number" placeholder="e.g. 774843" className=''
                                                        name="zipcode"
                                                        defaultValue={userData.zipcode}
                                                        onBlur={(e) => handleZipcodeChange(e, 'poker')}
                                                        pattern="[0-9]"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                    <Form.Control type="text" placeholder="City" className=''
                                                        name="city"
                                                        defaultValue={pokerCity}
                                                        onChange={(e) => setPokerCity(e.target.value)} value={pokerCity}
                                                    />
                                                </Form.Group>
                                            </Col>

                                        </Row>
                                    </Col>


                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group position-relative" controlId="name">
                                            <Form.Label>{t('page.registration.Confirm password')}*</Form.Label>
                                            <Form.Control type={passwordShown ? "text" : "password"} placeholder={t('page.registration.Confirm password')} className=''
                                                name="confirmpassword"


                                            />
                                            <span className='faEye-icon' >
                                                <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                            </span>
                                        </Form.Group>

                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Date of birth')}*</Form.Label>
                                            <Form.Control type="date" placeholder="DD.MM.YYYY" className=''
                                                name="dob"
                                                defaultValue={userData.dob}

                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.managerRegister.Nickname')}*</Form.Label>
                                            <Form.Control type="text" placeholder={t('page.managerRegister.Enterprise')} className=''
                                                name="nickname"
                                                defaultValue={userData.nickname}

                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                            <Select
                                                options={options}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                value={selectedLanguange}
                                                onChange={handleLanguage}
                                            />
                                        </Form.Group>
                                    </Col>




                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Visible detail for the other players')} *</Form.Label>
                                            <Select options={profileNameOption}

                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                value={displayoption}
                                                onChange={handleProfileOption}

                                            />
                                        </Form.Group>

                                    </Col>


                                    <Col md={12} className="text-center mt-1">
                                        <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>
                                        {
                                            Error ?

                                                <p className="error" style={{ color: `red` }} >{Error}</p>
                                                : ''
                                        }


                                        <Button type="submit" className=" btn btn-primary btn-submit" >{t('page.registration.Save')}</Button>
                                    </Col>

                                </Row>

                            </Form>
                        </div>
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

                        <Modal.Body>{modalmessage}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {

                                    setModelShow(false)
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

export default MyProfile;