import React from 'react';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';



const Notifications = () => {
    const { t } = useTranslation();
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
                        <MyProfileLeftNav />
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
                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="NewPlayer" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewPlayer"
                                                                label={t('page.myprofile.myprofilenav.Notifications.NewPlayer')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="NewSandboxEntry" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewSandboxEntry"
                                                                label={t('page.myprofile.myprofilenav.Notifications.NewSandboxEntry')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="NewRoom" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="NewRoom"
                                                                label={t('page.myprofile.myprofilenav.Notifications.NewRoom')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="Newpayment" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="Newpayment"
                                                                label={t('page.myprofile.myprofilenav.Notifications.Newpayment')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="Newbanner" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="Newbanner"
                                                                label={t('page.myprofile.myprofilenav.Notifications.Newbanner')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="Newtournament" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="Newtournament"
                                                                label={t('page.myprofile.myprofilenav.Notifications.Newtournament')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="Newsubscription" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="Newsubscription"
                                                                label={t('page.myprofile.myprofilenav.Notifications.Newsubscription')}
                                                            />
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="">
                                                        <div key="PlayerBanned" className="mb-1 d-flex">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="PlayerBanned"
                                                                label={t('page.myprofile.myprofilenav.Notifications.PlayerBanned')}
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

export default Notifications;