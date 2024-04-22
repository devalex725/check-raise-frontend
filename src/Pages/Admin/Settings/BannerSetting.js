import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Table, Button } from 'react-bootstrap';

import './Settings.scss';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import { useNavigate, Link } from 'react-router-dom';
import AdminSettingService from '../../../api/services/AdminService/AdminSettingService';
import {
    faBars,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const BannerSetting = () => {
   
    const navigate = useNavigate();
    
    const [settingTable, setSettingTable] = useState([]);
    const [Error, setError] = useState('');
    const [isLoading, setisloading] = useState(true);
    const getSettingList = async () => {
        try {
            let responseData = await AdminSettingService.adminIndex().json()

            setSettingTable(responseData.data);

          

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
                                Banner Settings
                            </Card.Header>
                            <Card.Body>

                                <>
                                    <Form>

                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th className="width-auto text-center">

                                                    </th>
                                                    <th className="width-auto text-center">
                                                        Credit per day
                                                    </th>
                                                    <th className="width-auto text-center text-nowrap">
                                                        Credit per day with discount(after X days)
                                                    </th>
                                                    <th className="width-auto text-center text-nowrap">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    settingTable.map((element) => {

                                                        return (
                                                            <tr style={{ textAlign: 'center' }}>
                                                                <td>

                                                                    {
                                                                        element.key === "top_banner"
                                                                            ?
                                                                            "Top Banner"
                                                                            : ''
                                                                    }
                                                                    {
                                                                        element.key === "bottom_banner"
                                                                            ?
                                                                            " Bottom Banner"
                                                                            : ''
                                                                    }
                                                                    {
                                                                        element.key === "premium_tournament"
                                                                            ?
                                                                            "  Premium Tournament"
                                                                            : ''
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {element.perday}
                                                                </td>
                                                                <td>
                                                                    {element.discount}
                                                                </td>
                                                                <td>
                                                                    <Link className='action-link green-link mb-1' to={`/admin/editsetting/${element.id}`}>
                                                                        Edit
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </Table>

                                    </Form>
                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Number of days for discount: (default 5)</Form.Label>

                                                    </Form.Group>
                                </>


                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
            {isLoading && <LogoAnimationLoader />}
        </>
    );
};

export default BannerSetting;