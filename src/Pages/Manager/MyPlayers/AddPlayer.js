import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import InputPhoneComponent from '../../../components/InputPhone/InputPhone';
import MyPlayerService from '../../../api/services/MyPlayerService';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import RoomService from '../../../api/services/RoomService';
import {
    faEye,
    faEyeSlash,

} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
const AddPlayer = () => {
    useEffect(() => {
        if (localStorage.getItem('usertype') === 'Room Manager') {

        }
        else {
            navigate('/');
        }

    }, [])
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
    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');

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


            const data = await MyPlayerService.store(userData).json();

            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data.message)
                setError('')
                // navigate('/manager/players');
            }
        }

        catch (error) {
            // Handle API errors
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
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
                                <Link to="/manager/players">{t('page.myprofile.myprofilenav.AllPlayers')}</Link> <FontAwesomeIcon icon={faArrowRight} /> {t('page.myprofile.myprofilenav.Add Players')}
                            </Card.Header>
                            <Card.Body>
                                {/* <div className='login-formwrap register-formwrap my-profile-formwrap'> */}
                                    <Form onSubmit={onSubmitHandler} ref={ref => setFormRef(ref)}>

                                        <Row>

                                            <Col md={12} className='mt-3'>

                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="firstname">
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
                                                <Form.Group className="mb-3 form-group" controlId="date">
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
                                                <Form.Group className="mb-3 form-group" controlId="lastname">
                                                    <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                                    <Form.Control type="text" name="lastname" placeholder={t('page.registration.Surname')} className='' ref={el => inputRef.current['surname'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="street">
                                                    <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                                    <Form.Control name="street" type="text" placeholder={t('page.registration.Street and number')} className='' ref={el => inputRef.current['street'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="nickname">
                                                    <Form.Label>{t('page.registration.Nickname')}</Form.Label>
                                                    <Form.Control type="text" name="nickname" placeholder={t('page.registration.Nickname')} className='' ref={el => inputRef.current['nickname'] = el} />
                                                </Form.Group>
                                            </Col>


                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="language">
                                                    <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                                    <Select name="language" options={options} className=" react-select-container" onChange={(e) => handleLanguage(e.value)}
                                                        classNamePrefix="react-select" ref={el => inputRef.current['language'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="email">
                                                    <Form.Label>{t('page.registration.E-Mail')}*</Form.Label>
                                                    <Form.Control type="email" name="email" placeholder={t('page.registration.E-Mail')} className='' ref={el => inputRef.current['email'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>

                                                <Form.Group className="mb-3 form-group" controlId="zipcode">
                                                    <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                    <Form.Control name="zipcode" type="text" onBlur={(e) => handleZipcodeChange(e, 'poker')} placeholder="e.g. 774843" className='' ref={el => inputRef.current['zipcode'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group position-relative" controlId="password">
                                                    <Form.Label>{t('page.registration.Password')}*</Form.Label>
                                                    <Form.Control type={passwordShown ? "text" : "password"} name="password" placeholder={t('page.registration.Password')} className='' ref={el => inputRef.current['password'] = el} />
                                                    <span className='faEye-icon addplayer-icon' style={{ maxHeight: '16px', top : "57%", right: "20px" }}>
                                                        <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3  form-group" controlId="city">
                                                    <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                    <Form.Control name="city" type="text" placeholder="City" className='' onChange={(e) => setPokerCity(e.target.value)} value={pokerCity} ref={el => inputRef.current['city'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group form-group position-relative" controlId="confpassword">
                                                    <Form.Label>{t('page.registration.Repeat password')}*</Form.Label>
                                                    <Form.Control type={passwordReShown ? "text" : "password"} name="confpassword" placeholder={t('page.registration.Repeat password')} className='' ref={el => inputRef.current['confirmpassword'] = el} />
                                                    <span className='faEye-icon addplayer-icon' style={{ maxHeight: '16px', top : "57%", right: "20px" }}>
                                                        <i onClick={togglePasswordReVisiblity} >{passwordReShown ? eye : eyeSlash}</i>
                                                    </span>
                                                </Form.Group>
                                            </Col>



                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Visible detail for the other players')} *</Form.Label>
                                                    <Select name="displayoption" options={profileNameOption} className=" react-select-container"
                                                        onChange={(e) => handleProfileOption(e.value)}
                                                        classNamePrefix="react-select" ref={el => inputRef.current['displayoption'] = el} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>

                                                <Form.Group className="mb-3 form-group" controlId="name">
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
                                                <Form.Group className="mb-3 form-group" controlId="name">

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

                                        </Row>

                                    </Form>
                                {/* </div> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
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
                                    navigate('/manager/players');
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
    )
}
export default AddPlayer;