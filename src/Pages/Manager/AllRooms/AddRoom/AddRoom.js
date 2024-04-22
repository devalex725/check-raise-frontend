import React, { useState,useEffect } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import InputPhoneComponent from '../../../../components/InputPhone/InputPhone';
import '../../../../assets/flag.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MyProfileLeftNav from '../../../../components/MyProfileLeftNav/MyProfileLeftNav';
import MyProfileLeftNavManager from '../../../../components/MyProfileLeftNav/MyProfileLeftNavManager';

import './AddRoom.scss';
import RoomService from '../../../../api/services/RoomService';
const AddRoom = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [language, setLanguage] = useState('');
    const [userId, setUserId] = useState('');
    const [canton, setCanton] = useState('');
    const [pokerCity, setPokerCity] = useState("");
    const [contactCity, setContactCity] = useState("");
    const [phonecountry,setPhonecountry] = useState('');
    const [phonecode, setPhonecode] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [ error ,serError] = useState();
    const [file, setFile] = useState();
    
    const options = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
    ]
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
    const [isManagerLogin ,setIsManagerLogin] = useState(true);
  
    useEffect(()=>{
        if (localStorage.getItem('usertoken')) {
            
            var userdata =JSON.parse(localStorage.getItem("user"));
            setUserId(userdata.id)
            localStorage.getItem('usertype') == 'Room Manager' ?      
            setIsManagerLogin(true)
            :
            setIsManagerLogin(false)
             
        } else {
            navigate('/')
        }
       
},[])
function handleOnChange( value, data) {
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
  const handleZipcodeChange = async(event,type)=>{
    event.preventDefault();
    var code=event.target.value;
    try {
        const res = await RoomService.getCity(code).json();
        if(type==="poker"){
            setPokerCity(res.data.city)
        }else{
            setContactCity(res.data.city)
        }
    }       
    catch (error) {
        if(type==="poker"){
            setPokerCity('')
        }else{
            setContactCity('')
        }
    
    }
}

   
function handleChangeImage(e) {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = () => {
      var image = fileReader.result
      setFile(image)
    }
    //setFile(e.target.files[0].name);
}
const createRoom = async(event) =>{
    console.log(file)
    event.preventDefault();
    try {
        var userData= {
            title: event.target.title.value,
            slug: event.target.slug.value,
            user_id: userId,
            street: event.target.street.value,
            language: language,
            description: event.target.description.value,
            logo:file ? file : '',
            town: event.target.town.value,
            canton: canton,
            phone: phonenumber,
            phonecountry: phonecountry,
            phonecode: "+"+phonecode,
            website: event.target.website.value,
            contact: event.target.contact.value,
            city:pokerCity,
            zipcode:event.target.zipcode.value
        }
      
        const data = await RoomService.store(userData).json();
        console.log(data);
        if(data.status === true)
        {
            navigate('/manager/all-rooms');
        }
    }
    catch (error) {
        // Handle API errors
        console.error("error 48",error);
        serError("Please Fill All Fields*.",error)
        
    }
}
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                     {
                            isManagerLogin === false? 
                            <MyProfileLeftNav />
                            :
                            <MyProfileLeftNavManager/>
                        }
                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {/* {t('page.myprofile.myprofilenav.AllRooms')} <FontAwesomeIcon icon={faArrowRight} /> {t('page.myprofile.myprofilenav.All Rooms.Edit Manager')} */}

                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <h4>Add Room</h4>
                                    </Col>
                                </Row>
                                <div className=''>
                                    <Form onSubmit={createRoom}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Title*</Form.Label>
                                                    <Form.Control type="text" name="title" placeholder={t('page.registration.Name')} className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Slug*</Form.Label>
                                                    <Form.Control type="text" name="slug" placeholder={t('page.registration.Surname')} className='' />
                                                </Form.Group>
                                            </Col>
                                            
                                            <Col md={6}>
                                                     <Form.Group className="mb-3 form-group" controlId="name">
                                                            <Form.Label>{t('page.registration.ZIP code')}*</Form.Label>
                                                            <Form.Control type="text" name ="zipcode" placeholder="e.g. 774843" className='' 
                                                            onBlur={(e)=>handleZipcodeChange(e,'poker')}
                                                            />
                                                    </Form.Group>
                                                   
                                            </Col>
                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                   
                                                   <Form.Label>{t('page.registration.Street and number')}*</Form.Label>
                                                   <Form.Control type="text" name ="street" placeholder={t('page.registration.Street and number')} className='' />
                                               </Form.Group>
                                                
                                            </Col>
                                            
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                     <Form.Label>{t('page.registration.City')}*</Form.Label>
                                                    <Form.Control type="text" placeholder="Bucharest" className='' 
                                                        name="city"
                                                        onChange={(e)=>setPokerCity(e.target.value)} value={pokerCity} 
                                                    />
                                                </Form.Group>
                                                
                                            </Col>
                                            
                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Language')}*</Form.Label>
                                                    <Select options={options} className="react-select-container"
                                                        classNamePrefix="react-select" onChange={(e)=>setLanguage(e.value)}/>
                                                </Form.Group>
                                            </Col>
                                           
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control type="text" name ="description" placeholder='' className='' />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Logo</Form.Label>
                                                    <Form.Control type="file" name ="logo" placeholder='' className='' onChange={handleChangeImage} />
                                                </Form.Group>
                                            </Col>


                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Town*</Form.Label>
                                                    <Form.Control type="text" name ="town" placeholder='' className='' />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Canton *</Form.Label>
                                                    <Select options={Canton} className="react-select-container"
                                                        classNamePrefix="react-select" onChange={(e)=>setCanton(e.value)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>{t('page.registration.Phone Number')}*</Form.Label>

                                                    <div className='d-flex w-100 flex-wrap flex-lg-nowrap'>
                                                        <div className='flag-select'>
                                                            {/* https://github.com/ekwonye-richard/react-flags-select/tree/master */}
                                                            {/* <ReactFlagsSelect  
                                                                 selected={selectedOption}
                                                                 onSelect={handleChange}
                                                                 value={selectedOption}
                                                                /> */}
                                                                 <InputPhoneComponent fn={handleOnChange} /> 
                                                        </div>
                                                        {/* <div className='flag-nput'>
                                                            <Form.Control type="text" className='' name ="phonenumber"/>
                                                        </div> */}
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                    <Form.Label>Website *</Form.Label>
                                                    <Form.Control type="text" className='' name ="website"/>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="name">
                                                     <Form.Label>Contact*</Form.Label>
                                                    <Form.Control type="text" placeholder="Bucharest" className='' 
                                                        name="contact"
                                                        
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="text-center mt-5">
                                                <p className="success" style={{ color: `white`, display: `none` }}>{t('page.registration.Success')}</p>
                                                <p className="error">{error}</p>

                                                <Button type="submit" className=" btn btn-primary btn-submit">Create Room</Button>
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

export default AddRoom;