import React, { useEffect, useState } from 'react';

import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';

import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import RoomService from '../../../api/services/RoomService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';

const AllRooms = () => {
    const navigate = useNavigate();
    const [isLoading, setisloading] = useState(true);
    const [rooms, setRooms] = useState([])
    useEffect(() => {

        if (localStorage.getItem('usertoken')) {
            getRoomIndex()
        } else {
            navigate('/')
        }

    }, [])
    const getRoomIndex = async () => {
        try {

            let responseData = await RoomService.index().json()
            setRooms(responseData.data);

            setisloading(false)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteroom = async (e) => {
        try {


            let responseData = await RoomService.destroy(e).json()
            if (responseData.status === true) {
                getRoomIndex();
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>

                         {/* <MyProfileLeftNavManager /> */}

                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                All Rooms
                            </Card.Header>
                            <Card.Body>
                                <div className='d-flex justify-content-between mb-3'>
                                    <Link className="btn btn-primary" to="/manager/add-room" role="button">Add Room</Link>
                                </div>
                                <Table responsive className="alltournamenttable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>

                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((element, index) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        {index + 1}.
                                                    </td>
                                                    <td>
                                                        {element.title}
                                                    </td>
                                                    <td>
                                                        <Link className='action-link green-link mb-1' to={`/manager/my-room/${element.id}`}>Edit</Link>
                                                        <Link className='action-link red-link mb-1' onClick={(e) => deleteroom(element.id)}>Delete</Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}


                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
            {isLoading && <LogoAnimationLoader />}
        </>
    );
};

export default AllRooms;