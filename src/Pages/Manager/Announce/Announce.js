
import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import customeStyle from '../../Admin/customstyle';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Form, Card, Button, Table, Modal } from 'react-bootstrap';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import DataTable from 'react-data-table-component';

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import AnnouncementService from '../../../api/services/AnnouncementService';
const Announce = () => {


    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState([]);

    const [Modalshow, setModelShow] = useState(false);

    const [Error, setError] = useState('');

    const [isLoading, setisloading] = useState(true);

    const [DeleteId, setDeleteId] = useState('')

    const [modalmessage, setModalMessage] = useState('');
    const [Delete, setDelete] = useState(false)

    const getAnnouncement = async () => {
        try {
            let responseData = await AnnouncementService.getlaterbyroom().json()
            setAnnouncement(responseData.data);

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
            getAnnouncement();

        }
        else {
            navigate('/');
        }

    }, [navigate])

    const columns = useMemo(
        () => [

            {

                name: 'No',
                selector: (row, index) => index + 1,
                sortable: true,

            },
            {

                name: 'Tournament Name',
                cell: (row) => row ? row.title :'',
                selector: row => row ? row.title :'',
                sortable: true,

            },
            {

                name: 'FirstName',
                cell: (row) => row ? row.firstname :'',
                selector: row => row ? row.firstname :'',
                sortable: true,

            },
            {

                name: 'LastName',
                cell: (row) => row ? row.lastname :'',
                selector: row =>row ? row.lastname :'',
                sortable: true,

            },

            {

                name: 'Time',
                cell: (row) => row ? row.latetime  :'',
                selector: row => row ? row.latetime  :'',
                sortable: true,

            },
            {
                name: "Action",
                cell: (row) => <>
                    <td>
                        <Link className='action-link green-link mb-1' to={`/manager/editannounce/${row.id}`}>Edit</Link>
                        <Link className='action-link red-link mb-1' onClick={(e) => handleDelete(row.id)}>Delete</Link>
                    </td>
                </>
            }

        ], [],
    );
    const handleDelete = (e) => {
        setDeleteId(e)
        setModelShow(true)
    }
    const handleDeleteBanner = async () => {
        try {

            let responseData = await AnnouncementService.destroy(DeleteId).json()
            if (responseData.status === true) {

                setModalMessage(responseData.message)

                setModelShow(false)
                setDelete(true)
            }

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
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
                                Announce Late Reg
                            </Card.Header>
                            <Card.Body>
                                <Form>

                                    <Row className='m-2'>
                                        <Col md={4} sm={12}>

                                        </Col>
                                        <Col md={4} sm={12}>
                                        </Col>
                                    </Row>
                                   
                                </Form>
                                <DataTable

                                    data={announcement}
                                    columns={columns}
                                    theme="dark"
                                    selectableRowsComponentProps={{ inkDisabled: true }}
                                    defaultSortFieldId={1}
                                    pagination
                                    paginationPerPage={100}
                                    customStyles={customeStyle}

                                />


                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            {isLoading && <LogoAnimationLoader />}
            {Delete ? (
                <Modal show={Delete}>
                    <>
                        <Modal.Header>
                            <Modal.Title>Deleted</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>{modalmessage}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    getAnnouncement()
                                    setDelete(false)
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
            <Modal show={Modalshow}>
                <>
                    <Modal.Header>
                        <Modal.Title>Alert</Modal.Title>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setModelShow(false)}
                        ></button>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete announcement?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModelShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() =>
                             handleDeleteBanner()
                             }>
                            Delete
                        </Button>
                    </Modal.Footer>
                </>
            </Modal>
        </>
    )
}

export default Announce
