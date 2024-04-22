import React from 'react';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';




const AllPlayers = () => {

    return (
        <>
            <div className='wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNav />
                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff"><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                My poker rooms
                            </Card.Header>
                            <Card.Body>
                                <Table responsive className='profile-table'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>fripoker</td>
                                            <td>Active</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='' className="badge badge-success">Edit</Link>
                                                    <Link to='' className="badge badge-success">Edit Manager</Link>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>fripoker</td>
                                            <td>Active</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='' className="badge badge-success">Edit</Link>
                                                    <Link to='' className="badge badge-success">Edit Manager</Link>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>fripoker</td>
                                            <td>Active</td>
                                            <td>
                                                <div className="action-badge">
                                                    <Link to='' className="badge badge-success">Edit</Link>
                                                    <Link to='' className="badge badge-success">Edit Manager</Link>
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

export default AllPlayers;