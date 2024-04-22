import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BannerService from '../../../api/services/BannerService';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import moment from 'moment';
const AddBanner = () => {
    useEffect(() => {
        if (localStorage.getItem('usertype') === 'Room Manager') {
            getCredit()
            getBannerWeekly()
            getUserCredit()
        }
        else {
            navigate('/');
        }
    }, [])
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');
    const [location, setLocation] = useState(1);
    const [credit, setCredit] = useState([]);
    const [bannerweekly, setBannerweekly] = useState([]);
    
    //const [checkboxbottom, setcheckboxbottom] = useState(0);
    let checkboxbottom=0;
    const [formRefSt, setFormRefst] = useState("");
    const [file, setFile] = useState('');
    const [error, setError] = useState();
    const [bannerDate,setBannerDate]= useState('');
    const [usercredit,setUsercredit]= useState(0);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(moment().startOf("isoweek").utc()),
        endDate: new Date(moment().endOf("week").utc())
    });
    function handleTopDate(event) {
        var str=event.target.value
        var strArray=str.split('_');
        setBannerDate(strArray[0])
        setLocation(strArray[1])
    }
    function handleChangeImage(e) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])
        fileReader.onload = () => {
            var image = fileReader.result
            setFile(image)

        }

    }
    const getUserCredit = async () => {
        try {
            let responseData = await BannerService.getuserCredit().json()
            setUsercredit(responseData.balance);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }
    const getCredit = async () => {
        try {
            let responseData = await BannerService.getcredit().json()

            setCredit(responseData.data);
            console.log(responseData.data)
            
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }
    const getBannerWeekly = async () => {
        try {
            let responseData = await BannerService.getbannerweekly().json()
            setBannerweekly(responseData);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    }
    const submitForm = () => {
        formRefSt.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        )
    };
    const setFormRef = formRef => {
        setFormRefst(formRef)
    };
    const handleConfirmation = async (event) => {
        event.preventDefault();
        try {
            setShow(true);
        }
        catch (error) {
            console.error( error);
        }
    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if(bannerDate===""){
            setShow(false);
            setError("Please Select Banner!!!");
            return;
        }
        if(file===""){
            setShow(false);
            setError("Please Select Image!!!");
            return;
        }
        setShow(false);
        setError("")
        console.log(bannerDate)
        console.log(location)
        try {
            var postdata = {
                startdate: moment(bannerDate).format('YYYY-MM-DD HH:mm'),
                image: file ? file : '',
                location: location,
                url: event.target.url.value,
            }
            const data = await BannerService.store(postdata).json();
            console.log(data)
            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data)
                setError('')
                //navigate('/manager/banner');
            }
        } catch (error) {
            // Handle API errors
            console.log(error)
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                ///navigate('/manager/banner');
            }
        }
    }
    const handleChange=(value) => {
        setLocation(value)
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
                                <Link to="/manager/banner">Banner</Link> <FontAwesomeIcon icon={faArrowRight} /> Add banner
                            </Card.Header>
                            <Card.Body>
                            <Link to="/manager/banner">Back</Link>
                               
                               <p>Max Number of TOP banners per week (all rooms): {bannerweekly && bannerweekly.max_number_top}</p>
                               <p>Max Number of TOP banners per week (your room): {bannerweekly.roomdetails && bannerweekly.roomdetails.maxnumberoftopbanner}</p>
                               <p>Max Number of CENTRAL banners per week (all rooms): {bannerweekly && bannerweekly.max_number_bottom}</p>
                               <p>Max Number of CENTRAL banners per week (your room): {bannerweekly.roomdetails && bannerweekly.roomdetails.maxnumberofbottombanner}</p>
                               <p>Price per week (TOP banner):  
                                {credit&&credit.map((element) => (
	                                element.key=="top_banner"?" "+element.perday:''
                                ))}
                                </p>
                               <p>Price per week (CENTRAL banner):  
                               {credit&&credit.map((element) => (
	                                element.key=="bottom_banner"?" "+element.perday:'' 
                                ))}
                               </p>
                               <p>My credits: {usercredit}</p>
                                <div className='row'>
                                        <div className='col-md-6'>
                                        <p>Top Banners</p>
                                <div className='d-flex col-md-12 justify-content-between'>
                                   <div>
                                    <div>
                                        <p>Week Number</p>
                                        {
                                            bannerweekly.week && bannerweekly.week.map((element) => {
                                                return(<p>{element}</p>)
                                            }) 
                                        }
                                    </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>Start (Mo 0:00)</p>
                                            {
                                                bannerweekly.startdates && bannerweekly.startdates.map((element) => {
                                                    return(<p>{element? moment(element).format('DD.MM.YYYY') : ''}</p>)
                                                }) 
                                            }
                                        </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>End (Su 23:59)</p>
                                            {
                                                bannerweekly.enddates && bannerweekly.enddates.map((element) => {
                                                    return(<p>{element? moment(element).format('DD.MM.YYYY') : ''}</p>)
                                                }) 
                                            }
                                        </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>Rent (All)</p>
                                            
                                            {bannerweekly.toprentall && bannerweekly.toprentall.map((element,index) => {
                                                return(
                                                    <p className='d-flex'>
                                                        <><span className='me-2'>{element} / {bannerweekly.max_number_top}</span> 
                                                        </>
                                                    </p>
                                                )
                                                }
                                            ) 
                                            }
                                        </div>
                                        
                                   </div>
                                   <div>
                                            <p>Rent (You)</p>
                                            
                                            {bannerweekly.toprent && bannerweekly.toprent.map((element,index) => {
                                                return(
                                                    <p className='d-flex' style={{marginBottom:"14px"}}>
                                                        <><span className='me-2'>{element} / {bannerweekly.roomdetails.maxnumberoftopbanner}</span> 
                                                        {element >= bannerweekly.roomdetails.maxnumberoftopbanner?"":
                                                        bannerweekly.toprentall[index]<bannerweekly.max_number_top?
                                                         <Form.Check 
                                                            type="radio"
                                                            id="default-radio"
                                                            name="topbanner"
                                                            label="Select"
                                                            value={bannerweekly.startdates[index]+"_"+1}
                                                            onChange={handleTopDate}
                                                        />:''
                                                        }</>
                                                    </p>
                                                )
                                                }) 
                                            }
                                        </div>  
                                   </div>
                                        </div>
                                        {/* <div className='col-md-1'></div> */}
                                        <div className='col-md-6'>
                                        <p>Central Banners</p>
                                <div className='d-flex col-md-12 justify-content-between'>
                                   
                                   <div>
                                    <div>
                                        <p>Week Number</p>
                                        {
                                            bannerweekly.week && bannerweekly.week.map((element) => {
                                                return(<p>{element}</p>)
                                            }) 
                                        }
                                    </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>Start (Mo 0:00)</p>
                                            {
                                                bannerweekly.startdates && bannerweekly.startdates.map((element) => {
                                                    return(<p>{element? moment(element).format('DD.MM.YYYY') : ''}</p>)
                                                }) 
                                            }
                                        </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>End (Su 23:59)</p>
                                            {
                                                bannerweekly.enddates && bannerweekly.enddates.map((element) => {
                                                    return(<p>{element? moment(element).format('DD.MM.YYYY') : ''}</p>)
                                                }) 
                                            }
                                        </div>
                                   </div>
                                   <div>
                                        <div>
                                            <p>Rent (All)</p>
                                            {bannerweekly.bottomrentall && bannerweekly.bottomrentall.map((element,index) => {
                                                return(
                                                    <p className='d-flex' >
                                                        <><span className='me-2'>{element} / {bannerweekly.max_number_bottom}</span>
                                                        </>
                                                    </p>
                                                )
                                                }) 
                                            }
                                        </div>
                                           
                                   </div>
                                   <div>
                                            <p>Rent (You)</p>
                                            {bannerweekly.bottomrent && bannerweekly.bottomrent.map((element,index) => {
                                                return(
                                                    <p className='d-flex' style={{marginBottom:"14px"}}>
                                                        <><span className='me-2'>{element} / {bannerweekly.roomdetails.maxnumberofbottombanner}</span>
                                                       
                                                        {element >= bannerweekly.roomdetails.maxnumberofbottombanner?"":
                                                            bannerweekly.bottomrentall[index]<bannerweekly.max_number_bottom?
                                                            <Form.Check 
                                                                type="radio"
                                                                id="default-radio"
                                                                name="topbanner"
                                                                label="Select"
                                                                value={bannerweekly.startdates[index]+"_"+2}
                                                                onChange={handleTopDate}
                                                            />:''
                                                            
                                                        }
                                                    </>
                                                    
                                                    </p>
                                                )
                                                }) 
                                                
                                            }
                                            
                                        </div> 
                                  
                                     </div>
                                    </div>
                                </div>
                                 

                                 
                                <Form onSubmit={onSubmitHandler} ref={ref => setFormRef(ref)}>
                                    <Row>
                                        {/* <Col md={12} className='without-date-calander'>
                                            <Form.Group className="mb-3 form-group" controlId="firstname">
                                                <Form.Label>Date*</Form.Label>
                                                <DatePicker
                                                    className='without-date-calander'
                                                    selected={new Date(dateRange.startDate)}
                                                    onChange={(date) => setDateRange({ ...dateRange, startDate: date, endDate: date })}
                                                    name="startdate"
                                                    filterDate={(date) => date.getDay() === 1}
                                                    //showTimeSelect
                                                    //timeFormat="HH:mm"
                                                    injectTimes={[
                                                        setHours(setMinutes(new Date(), 1), 0),
                                                        setHours(setMinutes(new Date(), 5), 12),
                                                        setHours(setMinutes(new Date(), 59), 23),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy HH:mm"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>
                                        </Col> */}
                                        {/* <Col md={6}>
                                            <Form.Group className="mb-3 form-group" >
                                                <Form.Label>Banner Location</Form.Label>
                                                <select name="location" onChange={e => handleChange(e.target.value)} style={{ appearance: 'none' }}>
                                                    <option value="1">Top</option>
                                                    <option value="2">Center</option>
                                                </select>
                                            </Form.Group>
                                        </Col> */}
                                        <Col md={12}>
                                            <Form.Group className="mb-3 form-group" >
                                                <Form.Label>URL*</Form.Label>
                                                <Form.Control type="text" name="url" className='' />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="">
                                                <Form.Label>Logo<span className='required'>*</span></Form.Label>
                                                <div className='image-wrap'>
                                                    <Form.Control type="file" name="logo" placeholder='' className='' onChange={handleChangeImage} />
                                                    {file ? <Image
                                                        id='canvas'
                                                        src={file ? file : ''}
                                                        fluid
                                                    /> : ""}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12} className="text-center mt-5">
                                            <Button type="submit" onClick={handleConfirmation}  className=" btn btn-primary btn-submit" >Create Banner</Button>
                                        </Col>
                                        {error}
                                    </Row>
                                </Form>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            {show ? (
                <Modal show={show} >
                <Modal.Header closeButton onClick={() => setShow(false)}>
                    <Modal.Title>Create Banner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    
                    credit&&credit.map((element) => (
                        location==1?element.key=="top_banner"?<p>You have to pay {element.perday} for TOP banner per week.</p>:'':location==2?element.key=="bottom_banner"?<p>You have to pay {element.perday} for Central banner per week.</p>:'':''
                        
                    ))
                }
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setError('')
                        setShow(false)
                    }}>
                        Cancel
                    </Button>
                    <Button varient="primary" onClick={submitForm}>Submit</Button>
                </Modal.Footer>
            </Modal>
            ) : (
                ''
            )}
            {Modalshow ? (
                <Modal show={Modalshow}>
                    <>
                        <Modal.Header>
                            <Modal.Title>Saved</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{modalmessage.message}</Modal.Body>
                        <Modal.Footer>
                            {modalmessage.flag == 1 ?
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setModelShow(false)
                                        navigate('/manager/banner');
                                    }}
                                >
                                    Close
                                </Button>
                                :
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setModelShow(false)
                                        navigate('/manager/banner');
                                    }}
                                >
                                    Close
                                </Button>
                            }
                        </Modal.Footer>
                    </>
                </Modal>
            ) : (
                ''
            )}
        </>
    )
}
export default AddBanner;