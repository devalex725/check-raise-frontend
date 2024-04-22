import React,{useEffect} from 'react';
import MyProfileLeftNavPlayers from '../../../components/MyProfileLeftNav/MyProfileLeftNavPlayers';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';



const PlayerNotifications = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('usertype')=== 'Player')
        {
            // PlayerIndexApi();
        }
        else{
            navigate('/')
        }
   
   },[navigate])
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row>
                    <Col md={12} className='d-none d-md-block text-center'>
                        <h1 className="d-block">{t('page.myprofile.myprofilenav.notifi')}</h1>
                    </Col>
                </Row>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNavPlayers />
                    </Col>
                    <Col lg={10}>
                        <Row>
                            <Col md={12} className='d-block d-md-none'>
                                <h1 className="d-block d-md-none text-center">{t('page.myprofile.myprofilenav.notifi')}</h1>
                            </Col>
                            <Col lg={6}>
                                <Card className='mb-4 mb-lg-0'>
                                    <Card.Body>

                                        <Row>
                                            <Col md={12}>
                                                <Form>
                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewPlayer" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewPlayer"
                                                                label='Registering to a tournament ( warning if in the waiting list )'
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewSandboxEntry" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewSandboxEntry"
                                                                label="Unregistering to a tournament"
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewRoom" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewRoom"
                                                                label='Entering the tournament from the waiting list'
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewRoom" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewRoom"
                                                                label='Tournament change details notification'
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                    <div className='text-center mt-4'>
                                                        <Button varient="primary">{t('page.myprofile.myprofilenav.Notifications.Save')}</Button>
                                                    </div>


                                                </Form>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card className='mb-4 mb-lg-0'>
                                    <Card.Body>

                                        <Row>
                                            <Col md={12}>
                                                <Form>
                                                <Form.Group className="mb-2" controlId="">
                                                        <div key="NewPlayer" className="mb-1 d-flex">
                                                           Newsletters
                                                        </div>
                                                    </Form.Group>
                                                    <br/>
                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewPlayer" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewPlayer"
                                                                label='Newsletter from CheckRise'
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                    <br/>
                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewPlayer" className="mb-1 d-flex">
                                                           Other rooms newsletters:
                                                        </div>
                                                    </Form.Group>
                                                    <br/>
                                                    <br/>
                                                    <br/>
                                                    <Form.Group  controlId="">
                                                        
                                                           <p>Other rooms newsletters:</p>
                                                        
                                                    </Form.Group>
                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewSandboxEntry" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewSandboxEntry"
                                                                label='Newsletter from'
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-2" controlId="">
                                                        <div key="NewRoom" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewRoom"
                                                                label={t('page.Manager.Notifications.NewsletterfromWebsite')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <div className='text-center mt-4'>
                                                        <Button varient="primary">{t('page.myprofile.myprofilenav.Notifications.Save')}</Button>
                                                    </div>


                                                </Form>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                    </Col>

                </Row>


            </div>

        </>
    );
};

export default PlayerNotifications;