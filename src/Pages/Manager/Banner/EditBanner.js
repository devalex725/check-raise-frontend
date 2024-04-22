import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Image } from 'react-bootstrap';
import Select from 'react-select';
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
    useParams
} from 'react-router-dom';
import moment from 'moment';

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
const EditBanner = () => {

    const navigate = useNavigate()
    const [isLoading, setisloading] = useState(true);
    const [show, setShow] = useState(false);
    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');
    const [banners, setBanners] = useState([]);
    const [formRefSt, setFormRefst] = useState("");
    const params = useParams();
    const [location, setLocation] = useState('');
    const [file, setFile] = useState('');


    const [error, setError] = useState();
    const [dateRange, setDateRange] = useState({
        startDate :  setHours(setMinutes(new Date(), 30), 16)
        // startDate: setHours(setMinutes(new Date(moment().startOf("isoweek").utc()), 30), 16)
    }
        //     {
        //     startDate: new Date(moment().startOf("isoweek").utc() ),
        //     endDate: new Date(moment().endOf("week").utc())
        // }
    );

    const Location = [
        { value: '1', label: 'Top' },
        { value: '2', label: 'Center' },
    ]
    const GetBanner = async (id) => {
        try {
            let responseData = await BannerService.editBanner(id).json()
            setBanners(responseData.data);
            let selectedLocation = Location.filter(function (item) {

                return item.value === responseData.data.location.toString();
            });
            setLocation(selectedLocation)
            setisloading(false)
            setDateRange({ ...dateRange, startDate: new Date(responseData.data.startdate) })
           
            // setFile(process.env.REACT_APP_BANNER_IMAGE_URL + responseData.data.image)
            // setDateRange({ ...dateRange, startDate: new Date(moment(responseData.data.startdate).format('').startOf("isoweek").utc()) })
            // setDateRange({ ...dateRange, startDate: new Date(responseData.data.startdate).startOf("isoweek").utc() })
           
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        if (localStorage.getItem('usertype') === 'Room Manager') {

            GetBanner(params.id);
        }
        else {
            navigate('/');
        }

    }, [])
    function handleChangeImage(e) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])

        fileReader.onload = () => {
            var image = fileReader.result
            setFile(image)

        }

    }

    const setFormRef = formRef => {
        setFormRefst(formRef)
    };
    const handleLocation = location => {

        setLocation(location);

    }
    const onSubmitHandler = async (event) => {

        event.preventDefault();
        //console.log(event.target.startdate.value)
        //console.log(moment(event.target.startdate.value).format("YYYY-DD-MM HH:mm"))
        setShow(false);
        setError("")
        try {

            var postdata = {
                startdate: moment(dateRange.startDate).format('YYYY-MM-DD HH:mm'),
                // startdate: moment(event.target.startdate.value).format("YYYY-DD-MM hh:mm"),
                // moment(event.target.startdate.value).format("YYYY-MM-DD HH:mm"),
                // startdate:event.target.startdate.value,
                image: file ? file : '',
                location: location.value ? location.value : banners.location,
                url: event.target.url.value,
            }

            const data = await BannerService.updateBanner(params.id, postdata).json();

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
                                <Link to="/manager/banner">Banner</Link> <FontAwesomeIcon icon={faArrowRight} /> Edit banner
                            </Card.Header>
                            <Card.Body>
                                <Link to="/manager/banner">Back</Link>
                                <Form onSubmit={onSubmitHandler} ref={ref => setFormRef(ref)}>

                                    <Row>
                                        <Col md={12} className='without-date-calander'>
                                            <Form.Group className="mb-3 form-group" controlId="firstname">
                                                <Form.Label>Date*</Form.Label>
                                                <DatePicker
                                                    selected={dateRange.startDate}
                                                    onChange={(date) => setDateRange({ ...dateRange, startDate: date, endDate: date })}
                                                    name="startdate"
                                                    filterDate={(date) => date.getDay() === 1}
                                                   // showTimeSelect
                                                   // timeFormat="HH:mm"
                                                    injectTimes={[
                                                        setHours(setMinutes(new Date(), 1), 0),
                                                        setHours(setMinutes(new Date(), 5), 12),
                                                        setHours(setMinutes(new Date(), 59), 23),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy HH:mm"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 form-group" >
                                                <Form.Label>Banner Location</Form.Label>
                                                <Select options={Location}

                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={location}
                                                    onChange={handleLocation}

                                                />
                                            </Form.Group>

                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 form-group" >
                                                <Form.Label>URL*</Form.Label>
                                                <Form.Control type="text" name="url" className='' defaultValue={banners.url} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 form-group" controlId="">
                                                <Form.Label>Logo<span className='required'>*</span></Form.Label>
                                                <div className='image-wrap'>
                                                    <Form.Control type="file" name="logo" placeholder='' className='' onChange={handleChangeImage} />


                                                    <Image

                                                        id='canvas'
                                                        src={
                                                            file ? file : process.env.REACT_APP_BANNER_IMAGE_URL + banners.image

                                                        }
                                                        fluid
                                                    />

                                                </div>


                                            </Form.Group>
                                        </Col>
                                        <Col md={12} className="text-center mt-5">
                                            <Button type="submit" className=" btn btn-primary btn-submit" >Edit Banner</Button>
                                        </Col>
                                    </Row>
                                </Form>
                                {/* </div> */}
                            </Card.Body>
                        </Card>
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
                                        navigate('/manager/banner');
                                        setModelShow(false)
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
export default EditBanner;