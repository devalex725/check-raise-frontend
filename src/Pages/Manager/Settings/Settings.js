import React,{useEffect ,useState} from 'react';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Card, Form} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import './Settings.scss';

import { useNavigate } from 'react-router-dom';




const Settings = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );
    useEffect(()=>{
        if (localStorage.getItem('usertoken')) 
        {
            // getRoomPlayer();
        }
        else
        {
            navigate('/')
        }
        
    },[])
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
                                Setting
                            </Card.Header>
                            <Card.Body>
                            <Form >
                                    <Form.Group className="form-group" controlId="">
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>MemberShip</Form.Label>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch"
                                                    label=""
                                                   
                                                    // onChange={() => setIsshorthanded(prev => !prev)}
                                                   
                                                />
                                            </Form.Group>
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>Late Arrival</Form.Label>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch"
                                                    label=""
                                                   
                                                    // onChange={() => setIsshorthanded(prev => !prev)}
                                                   
                                                />
                                            </Form.Group>
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>Deadline Date<span className='required'>*</span></Form.Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    injectTimes={[
                                                        setHours(setMinutes(new Date(), 1), 0),
                                                        setHours(setMinutes(new Date(), 5), 12),
                                                        setHours(setMinutes(new Date(), 59), 23),
                                                    ]}
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>
                                    </Form.Group>
                            </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>

        </>
    );
};

export default Settings;