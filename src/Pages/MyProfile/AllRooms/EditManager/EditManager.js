import React, { useState ,useEffect } from 'react';

import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import ReactFlagsSelect from 'react-flags-select';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import '../EditRooms/EditRooms.scss';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import MyProfileService from '../../../../api/services/MyProfileService';
import MyProfileLeftNav from '../../../../components/MyProfileLeftNav/MyProfileLeftNav';


const EditManager = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
  
    const options = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
    ]
    const profileNameOption = [
        { value: 'public', label: 'Name Surname' },
        { value: 'private', label: 'Nickname (If applicable)' },
        { value: 'anonymous', label: 'Anonymous' }
    ]
  
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [passwordReShown, setPasswordReShown] = useState(false);
    const togglePasswordReVisiblity = () => {
        setPasswordReShown(passwordReShown ? false : true);
    };
    const [selectedOption, setSelectedOption] = useState('')
    const [userData, setUserData] = useState({
            firstname: '',
            lastname:'',
            city:'',
            zipcode:'',
            oldpassword:'',
            password:'',
            enterprise:'',
            street:'',
            language:'',
            email:'',
            dob:'',
            displayoption:'',
            phonenumber:'',
            nickname:'',
            phonecode:'+91',
            phonecountry:'',   
           
      })
    const getProfileList = async () => {
        
        try {
          
          let responseData = await MyProfileService.Show().json()
          setUserData(responseData.data)
          
         
        } catch (error) {
            console.log(error)
        }
      }
    useEffect(() => {
       
        if (localStorage.getItem('usertoken')) {
            getProfileList()
        } else {
            navigate('/')
        }
       
      },[navigate])

      const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
   };
      const handleLanguage = (e) =>{
        userData.language = e;
      }
      const handleProfileOption = (e) =>{
        userData.displayoption = e ;
      }
    const handleProfile = async (event)=>{
        event.preventDefault();
           
        try {
                const data = await MyProfileService.update(
                    {
                        firstname:event.target.firstname.value,
                        lastname:event.target.lastname.value,
                        dob: event.target.dob.value,
                        street:event.target.street.value,
                        language:userData.language,
                        nickname:event.target.nickname.value,
                        city: event.target.city.value,
                        zipcode:event.target.zipcode.value,
                        displayoption: userData.displayoption,
                        phonecode:"+91",
                        phonecountry: userData.phonecountry,
                        phonenumber: event.target.phonenumber.value,
                        enterprise: event.target.enterprise.value,
                    }
                               
                            ).json();
                
                        if(data.status === true)
                        {
                            navigate('/')
                        }
            }
        catch (error) {
                // Handle API errors
                console.error("error 48",error);
                // serError(error)
                
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
                    <Col md={2}>
                   
                            <MyProfileLeftNav/>
                     
                    </Col>
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
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Surname')}*</Form.Label>
                                            <Form.Control type="text" placeholder={t('page.registration.Surname')} className=''
                                                    name="lastname"
                                                    defaultValue={userData.lastname} 
                                                    
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                    <Form.Control type="text" placeholder="Bucharest" className='' 
                                                        name="city"
                                                        defaultValue={userData.city} 
                                                        
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                    <Form.Control type="text" placeholder="e.g. 774843" className='' 
                                                            name="zipcode"
                                                            defaultValue={userData.zipcode} 
                                                            
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group position-relative" controlId="name">
                                            <Form.Label>{t('page.registration.OldPassword')}*</Form.Label>
                                            <Form.Control type={passwordShown ? "text" : "password"} placeholder={t('page.registration.OldPassword')} className='' 
                                                    name="oldpassword"
                                                    defaultValue={userData.oldpassword} 
                                                    
                                            />
                                            <span className='faEye-icon' >
                                                <i onClick={togglePasswordVisiblity} >{passwordShown ? eye : eyeSlash}</i>
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group position-relative" controlId="name">
                                            <Form.Label>{t('page.registration.Newpassword')}*</Form.Label>
                                            <Form.Control type={passwordReShown ? "text" : "password"} placeholder={t('page.registration.Newpassword')} className='' 
                                                name="password"
                                                defaultValue={userData.password} 
                                                
                                            
                                            />
                                            <span className='faEye-icon'>
                                                <i onClick={togglePasswordReVisiblity} >{passwordReShown ? eye : eyeSlash}</i>
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.managerRegister.Enterprise')}*</Form.Label>
                                            <Form.Control type="text" placeholder={t('page.managerRegister.Enterprise')} className=''
                                             name="enterprise"
                                             defaultValue={userData.enterprise} 
                                             
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
                                            <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                            <Form.Control type="text" placeholder={t('page.registration.Street and number')} className='' 
                                            name="street"
                                            defaultValue={userData.street} 
                                            
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                            <Select options={options} className="react-select-container"
                                                classNamePrefix="react-select" onChange={(e)=>handleLanguage(e.value)}/>
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
                                            <Form.Label>{t('page.registration.Date of birth')}*</Form.Label>
                                            <Form.Control type="date" placeholder="DD.MM.YYYY" className='' 
                                                name="dob"
                                                defaultValue={userData.dob} 
                                                
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Display name in your profile')} *</Form.Label>
                                            <Select options={profileNameOption} 
                                                
                                                className="react-select-container"
                                                classNamePrefix="react-select" 
                                                onChange={(e)=>handleProfileOption(e.value)}
                                                />
                                        </Form.Group>
                                        
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 form-group" controlId="name">
                                            <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>

                                            <div className='d-flex w-100 flex-wrap flex-lg-nowrap'>
                                                <div className='flag-select'>
                                                    {/* https://github.com/ekwonye-richard/react-flags-select/tree/master */}
                                                    <ReactFlagsSelect 
                                                      selected={selectedOption}
                                                      onSelect={handleChange}
                                                      value={selectedOption}
                                                    
                                                    />
                                                </div>
                                                <div className='flag-nput'>
                                                    <Form.Control type="text" className='' 
                                                      name="phonenumber"
                                                      defaultValue={userData.phonenumber} 
                                                      
                                                    
                                                    />
                                                </div>
                                            </div>

                                        </Form.Group>
                                    </Col>
                                    <Col md={12} className="text-center mt-1">
                                        <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>
                                        <p className="error" style={{ color: `red`, display: `none` }} >{t('page.registration.Something wrong')}</p>

                                        <Button  type="submit" className=" btn btn-primary btn-submit" >{t('page.registration.Save')}</Button>
                                    </Col>

                                </Row>

                            </Form>
                        </div>
                    </Col>

                </Row>
            </div>

        </>
    );
};

export default EditManager;