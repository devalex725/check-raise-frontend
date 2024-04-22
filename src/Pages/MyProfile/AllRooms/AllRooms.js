import React from 'react';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const AllPlayersRoom = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNav />
                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.All Rooms.My poker rooms')}
                            </Card.Header>
                            <Card.Body>
                                <Table responsive className='profile-table'>
                                    <thead>
                                        <tr>
                                            <th>{t('page.myprofile.myprofilenav.All Rooms.Name')}</th>
                                            <th>{t('page.myprofile.myprofilenav.All Rooms.Status')}</th>
                                            <th>{t('page.myprofile.myprofilenav.All Rooms.Actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>fripoker</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Active')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>fripoker</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Active')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>Test Room</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Suspended')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>


                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>fripoker</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Active')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>fripoker</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Active')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="mw-3"><span className='text-truncate w-100'>Test Room</span></td>
                                            <td>{t('page.myprofile.myprofilenav.All Rooms.Suspended')}</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='/edit-rooms' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Editbtn')}</Link>
                                                    <Link to='/edit-manager' className="badge badge-success">{t('page.myprofile.myprofilenav.All Rooms.Edit Manager')}</Link>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>

        </>
    );
};

export default AllPlayersRoom;