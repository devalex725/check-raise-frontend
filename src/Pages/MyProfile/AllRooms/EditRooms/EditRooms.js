
import React,{useEffect,useState,useRef} from 'react';

import { Row, Col, Card, Form, Image, Button } from 'react-bootstrap';
import ReactFlagsSelect from 'react-flags-select';
import '../../../../assets/flag.css';
import { Editor } from "@tinymce/tinymce-react";
import { useTranslation } from 'react-i18next';
import MyProfileLeftNav from '../../../../components/MyProfileLeftNav/MyProfileLeftNav';
import MyProfileLeftNavManager from '../../../../components/MyProfileLeftNav/MyProfileLeftNavManager';

const EditRooms = () => {
    const editorRef = useRef(null);
    const [isManagerLogin ,setIsManagerLogin] = useState(true);
    const { t } = useTranslation();
    useEffect(()=>{
        localStorage.getItem('usertype') === 'Room Manager' ?      
        setIsManagerLogin(true)
        :
        setIsManagerLogin(false)
        
},[])
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
                                {t('page.myprofile.myprofilenav.All Rooms.My poker rooms')}
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Title')} <span className='required'>*</span></Form.Label>
                                        <Form.Control type="text" className='' />
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Logo')} </Form.Label>
                                        <div className='image-wrap'>
                                            <div className='action-hover'>
                                                <span className='action-edit'><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill='#fff'><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" /></svg></span>
                                                <span className='action-remove'><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill='#fff'><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg></span>
                                            </div>
                                            <Image src={require('../../../../assets/images/fripoker-9-300x171.png')} fluid />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Street and number')} <span className='required'>*</span></Form.Label>
                                        <Form.Control type="text" className='' />
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Postcode and Town')} <span className='required'>*</span></Form.Label>
                                        <Form.Control type="text" className='' />
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Canton')}  <span className='required'>*</span></Form.Label>
                                        <Form.Select>
                                            <option value="AG">AG</option><option value="AI">AI</option><option value="AR">AR</option><option value="BE">BE</option><option value="BL">BL</option><option value="BS">BS</option><option value="FR" selected="selected" data-i="0">FR</option><option value="GE">GE</option><option value="GL">GL</option><option value="GR">GR</option><option value="JU">JU</option><option value="LU">LU</option><option value="NE">NE</option><option value="NW">NW</option><option value="OW">OW</option><option value="SG">SG</option><option value="SH">SH</option><option value="SO">SO</option><option value="SZ">SZ</option><option value="TG">TG</option><option value="TI">TI</option><option value="UR">UR</option><option value="VD">VD</option><option value="VS">VS</option><option value="ZG">ZG</option><option value="ZH">ZH</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Phone Number')}*</Form.Label>
                                        <div className='d-flex w-100 flex-wrap flex-lg-nowrap'>
                                            <div className='flag-select'>
                                                {/* https://github.com/ekwonye-richard/react-flags-select/tree/master */}
                                                <ReactFlagsSelect />
                                            </div>
                                            <div className='flag-nput'>
                                                <Form.Control type="text" className='' />
                                            </div>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Website')}</Form.Label>
                                        <Form.Control type="text" className='' />
                                    </Form.Group>

                                    <Form.Group className="border-bottom form-group" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Contact')} ({t('page.myprofile.myprofilenav.All Rooms.Edit.Email')})</Form.Label>
                                        <Form.Control type="text" className='' />
                                    </Form.Group>

                                    <Form.Group className="form-group mb-2" controlId="">
                                        <Form.Label>{t('page.myprofile.myprofilenav.All Rooms.Edit.Description of the poker room')}</Form.Label>
                                        <Editor  apiKey={process.env.REACT_APP_EDITOR_KEY} onInit={(event, editor) => editorRef.current = editor} />
                                    </Form.Group>
                                    <Form.Group className="form-group text-end" controlId="">
                                        <Button className='btn btn-primary'>{t('page.myprofile.myprofilenav.All Rooms.Edit.Save')}</Button>
                                    </Form.Group>

                                    <Form.Group className="form-group text-end" controlId="">
                                        <Button variant="danger" className='btn-sm d-lg-inline-block mb-2'>{t('page.myprofile.myprofilenav.All Rooms.Edit.Delete')}</Button>
                                        <Button variant="warning" className='btn-sm ms-lg-2 d-lg-inline-block mb-2'>{t('page.myprofile.myprofilenav.All Rooms.Edit.Suspend')}</Button>
                                        <Button variant="warning" className='btn-sm ms-lg-2  d-lg-inline-block mb-2'>{t('page.myprofile.myprofilenav.All Rooms.Edit.Deactivate')}</Button>
                                    </Form.Group>
                                    <Row>
                                        <Col md={12}>
                                            <p>{t('page.myprofile.myprofilenav.All Rooms.Edit.The information on this page is visible to players')}.<br />
                                                {t('page.myprofile.myprofilenav.All Rooms.Edit.If you deactivate your room, players will no longer see your tournaments or your room, but nothing will be lost. You just have to reactivate it and everything will be visible again')}
                                                .</p>
                                        </Col>
                                    </Row>


                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>

        </>
    );
};

export default EditRooms;