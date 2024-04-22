import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';

import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import AnnouncementService from '../../../api/services/AnnouncementService';

import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom';

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
const EditAnnoucement = () => {

    const navigate = useNavigate()
    const [isLoading, setisloading] = useState(true);
  
    const [Modalshow, setModelShow] = useState(false);
    const [modalmessage, setModalMessage] = useState('');
    const [banners, setBanners] = useState([]);
   
    const params = useParams();
   

    const [error, setError] = useState();
   
    const GetBanner = async (id) => {
        try {
            let responseData = await AnnouncementService.getlatearrivalbyid(id).json()
            setBanners(responseData.data);
            
            setisloading(false)
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
  

   
  
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        setError("")
        try {

            var postdata = {
                latetime: event.target.timing.value
            }
            const data = await AnnouncementService.updatelatearrival(params.id, postdata).json();

            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data)
                setError('')
                //navigate('/manager/banner');
            }
        } catch (error) {
          
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
                                <Link to="/manager/announce">Annoucement</Link> <FontAwesomeIcon icon={faArrowRight} /> Edit Annoucement
                            </Card.Header>
                            <Card.Body>

                                <Form onSubmit={onSubmitHandler} >

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3 form-group" controlId="firstname">
                                                <Form.Label>Time*</Form.Label>
                                                <Form.Control type="time" className='' name='timing' defaultValue={banners.latetime}/>
                                            </Form.Group>
                                        </Col>

                                        <p className="error">{error}</p>

                                        <Col md={12} className="text-center mt-5">
                                            <Button type="submit" className=" btn btn-primary btn-submit" >Edit Announcement</Button>
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

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    navigate('/manager/announce');
                                    setModelShow(false)
                                }}
                            >
                                Close
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
export default EditAnnoucement;