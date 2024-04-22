import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './Settings.scss';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import { useNavigate, Link } from 'react-router-dom';
import AdminSettingService from '../../../api/services/AdminService/AdminSettingService';
import {
    faBars,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AdminSetting = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [modalmessage, setModalMessage] = useState('');
    const [Modalshow, setModelShow] = useState(false);
    const [settingList, setSettingList] = useState([]);
    const [is_banner_0, setis_banner_0] = useState(0);
    const [is_banner_1, setis_banner_1] = useState(0);
    const [is_banner_2, setis_banner_2] = useState(0);
    const [is_banner_3, setis_banner_3] = useState(0);
    const [Error, setError] = useState('');
    const [isLoading, setisloading] = useState(true);
    const getSettingList = async () => {
        try {


            let getsettingresponse = await AdminSettingService.SettingIndex().json()
            setSettingList(getsettingresponse.data);
            setis_banner_0(getsettingresponse.data[0].is_banner_0)
            setis_banner_1(getsettingresponse.data[0].is_banner_1)
            setis_banner_2(getsettingresponse.data[0].is_banner_2)
            setis_banner_3(getsettingresponse.data[0].is_banner_3)
            setisloading(false)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }

    useEffect(() => {

        if (localStorage.getItem('admintoken')) {

            getSettingList();
        } else {
            navigate('/')
        }
    }, []);
    const handleSetting = async (event) => {
        event.preventDefault();
        console.log("settingList",);
        try {
            var userData = {

                is_important_message_banner: settingList[0].top_banner_credit,
                en_msg_banner: settingList[0].en_msg_banner,
                fr_msg_banner: settingList[0].fr_msg_banner,
                db_msg_banner: settingList[0].db_msg_banner,
                adv_top_banner: settingList[0].adv_top_banner,
                adv_bottom_banner: settingList[0].adv_bottom_banner,
                is_premium_tournament: settingList[0].is_premium_tournament,
                is_paypal: settingList[0].is_paypal,
                paypal_link: settingList[0].paypal_link,

                top_banner_credit: settingList[0].top_banner_credit,
                top_banner_credit_discount: settingList[0].top_banner_credit_discount,
                bottom_banner_credit: settingList[0].bottom_banner_credit,
                bottom_banner_credit_discount: settingList[0].bottom_banner_credit_discount,
                premium_banner_credit: settingList[0].premium_banner_credit,
                premium_banner_credit_discount: settingList[0].premium_banner_credit_discount,
                is_banner_0: is_banner_0,
                is_banner_1: is_banner_1,
                is_banner_2: is_banner_2,
                is_banner_3: is_banner_3

            }
            const data = await AdminSettingService.Settingupdate(settingList[0].id, userData).json();

            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data.msg)
                setError('')

            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }

        }

    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
                <Link className=" d-inline-block d-lg-none p-2">
                    <FontAwesomeIcon icon={faBars} />
                </Link>
                <h1 className="ms-2">Settings Page</h1>
            </nav>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>

                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                Settings
                            </Card.Header>
                            <Card.Body>
                                {
                                    settingList.map((element) => {
                                        return (
                                            <>
                                                <Form onSubmit={handleSetting}>

                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Group className="form-group" controlId="">
                                                            <Form.Label>Check-Raise banner Settings</Form.Label>

                                                        </Form.Group>
                                                        <Form.Group className="border-bottom form-group" controlId="">
                                                            <Form.Label>Number of rented banners 0</Form.Label>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label=""
                                                                checked={is_banner_0}
                                                                value={is_banner_0}
                                                                onChange={() => {

                                                                    setis_banner_0(is_banner_0 ? 0 : 1)

                                                                }}

                                                            />

                                                        </Form.Group>
                                                        <Form.Group className="border-bottom form-group" controlId="">
                                                            <Form.Label>Number of rented banners 1</Form.Label>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label=""
                                                                checked={is_banner_1}
                                                                value={is_banner_1}
                                                                onChange={() => {

                                                                    setis_banner_1(is_banner_1 ? 0 : 1)

                                                                }}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="border-bottom form-group" controlId="">
                                                            <Form.Label>Number of rented banners 2</Form.Label>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label=""
                                                                checked={is_banner_2}
                                                                value={is_banner_2}
                                                                onChange={() => {

                                                                    setis_banner_2(is_banner_2 ? 0 : 1)

                                                                }}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="border-bottom form-group" controlId="">
                                                            <Form.Label>Number of rented banners 3</Form.Label>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label=""
                                                                checked={is_banner_3}
                                                                value={is_banner_3}
                                                                onChange={() => {

                                                                    setis_banner_3(is_banner_3 ? 0 : 1)

                                                                }}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="border-bottom form-group" controlId="">
                                                            <Form.Label>Default Banner</Form.Label>
                                                            <div className='image-wrap'>
                                                                <Form.Control type="file" name="logo" placeholder='' className='' 
                                                                // onChange={handleChangeImage} 
                                                                />
                                                                {/* {file ? <Image
                                                                    id='canvas'
                                                                    src={file ? file : ''}
                                                                    fluid
                                                                /> : ""} */}


                                                            </div>
                                                        </Form.Group>

                                                    </Form.Group>
                                                    <Col sm={12} className='text-end'>
                                                        <Button type="submit" className=" btn btn-primary btn-submit">{t('page.myprofile.myprofilenav.Newsletters.Save')}</Button>
                                                    </Col>
                                                </Form>
                                            </>
                                        )
                                    })
                                }

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

                        <Modal.Body>{modalmessage}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {

                                    setModelShow(false)
                                    navigate('/admin/settings')
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

export default AdminSetting;