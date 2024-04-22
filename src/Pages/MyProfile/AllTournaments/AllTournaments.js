import React, { useEffect, useState, useMemo } from 'react';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import { Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import customeStyle from '../../Admin/customstyle';

import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Editor } from "@tinymce/tinymce-react";
import DirectorService from '../../../api/services/DirectorService';
const AllTournaments = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setisloading] = useState(true);
    const [directorData, setDirectorData] = useState([]);
    const [Delete, setDelete] = useState(false);
    const [modalmessage, setModalMessage] = useState('');
    const [sendEmailModal, setSendEmailModal] = useState(false);
    var userdata = localStorage.getItem('user')
    var newData = JSON.parse(userdata)

    const [DeleteId, setDeleteId] = useState('')
    const [sendModal, setSendModal] = useState(false);
    const [sendEmailMessage, SetSendEmailMessage] = useState('');
    const [filteredList, setFilteredList] = useState([]);
    const [modelshow, setModelShow] = useState(false)
    const [Senddata, SetSenddata] = useState('')
    const [content, setContent] = useState([])

    const getTournament = async () => {
        try {
            let responseData = await DirectorService.index().json()

            setDirectorData(responseData.data);

            setFilteredList(responseData.data)
            setisloading(false)



        }
        catch (error) {
            console.log(error)
        }
    }
    const [searchParam] = useState([
        'title',

    ])
    const filterBySearch = (event) => {
        const query = event.target.value;

        var updatedList = [...directorData];

        updatedList = updatedList.filter((item) => {
            return searchParam.some((newItem) => {
                return (
                    item[newItem].toLowerCase().indexOf(query.toLowerCase()) !== -1

                )

            })

        });

        setFilteredList(updatedList);
    };
    useEffect(() => {
        getTournament();
        if (localStorage.getItem('usertoken')) {

            localStorage.getItem('usertype') === 'Player' ?
                navigate('/player/my-profile')

                :
                getTournament();
        } else {
            navigate('/')


        }

    }, []);
    const handleDelete = (e) => {
        setDeleteId(e)
        setModelShow(true)
    }
    const deleteTournament = async () => {
        try {
            let responseData = await DirectorService.destroyDirector(DeleteId).json()
            if (responseData.status === true) {
                getTournament();
                setModalMessage(responseData.message)
                setModelShow(false)
                setDelete(true)
            }

            setisloading(false)



        }
        catch (error) {
            console.log(error)
        }
    }
    const handleEditorChange = (e) => {

        setContent(e.target.getContent());
    }
    const handleTournament = (e) => {
        SetSenddata(e)
        setSendEmailModal(true)

    }
    const handleSendEmail = async (event) => {

        event.preventDefault();
        let userData = {
            tournament_id: Senddata,
            subject: event.target.subject.value,
            content: content
        }

        try {
            let responseData = await DirectorService.sendemail(userData).json()
            if (responseData.status === true) {
                setSendModal(true)
                SetSenddata('');
                setContent('')
                setSendEmailModal(false)
                SetSendEmailMessage(responseData.message)
                    (responseData.message)

            }





        }
        catch (error) {
            console.log(error)
        }
    }

    const handleExport = async (e) => {
        try {
            let responseData = await DirectorService.exportcsv(e).json()
            const link = document.createElement('a');
            link.download = 'Example-PDF-File';

            link.href = `https://api.checkraise.ch/${responseData.file}`;

            link.click();

        }
        catch (error) {
            console.log(error);
        }
    }

    const updateTournamentStatus = async (tounamanetid) => {

        try {
            let responseData = await DirectorService.updatetournamentstatus(tounamanetid).json()
            if (responseData.status === true)
                setisloading(true)
            getTournament();
            // setisloading(false)

        }
        catch (error) {
            console.log(error);
        }
    }

    const updatearchivetournamentStatus = async (tounamanetid) => {

        try {
            let responseData = await DirectorService.archivetournament(tounamanetid).json()
            if (responseData.status === true)

                setisloading(true)
            getTournament();
            // setisloading(false)

        }
        catch (error) {
            console.log(error);
        }
    }
    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: "ALL"
    };
    const columns = useMemo(
        () => [

            {
                name: 'Name',
                selector: directorData => directorData.title,
                sortable: true,

            },
            {
                name: 'Date',
                selector: directorData => directorData.detail ? moment(directorData.detail.startday).format('DD.MM.YYYY HH:mm') : '',
                sortable: true,
            },
            {
                name: 'BuyIn',
                selector: directorData => directorData.detail ? directorData.detail.buyin : '',
                sortable: true,

            },
            {
                name: 'Players',
                selector: directorData => directorData.players ? directorData.players.registered : '',
                sortable: true,

            },
            {
                name: 'Room',
                selector: directorData => directorData.room ? directorData.room.title : '',
                sortable: true,

            },

            {
                name: 'Status',
                selector: directorData => directorData.status === 1 ? <Link className='action-link green-link mb-1' >Active</Link> : <Link className='action-link red-link mb-1' >Deactive</Link>,
                sortable: true,

            },

            {
                name: "Action",
                cell: (row) => <>
                    <td>
                        {
                            newData &&
                            newData.directory_capabilities.map((element) => {
                                return (
                                    <>

                                        {
                                            element.capability === "edit_tournament"
                                                ?
                                                <Link className='action-link green-link mb-1'
                                                    to={`/director/edit/${row.slug}`}>Edit</Link>
                                                : ''
                                        }
                                        {
                                            element.capability === "delete_tournament"
                                                ?
                                                <Link className='action-link red-link mb-1'
                                                    onClick={() => handleDelete(row.id)}

                                                >Delete</Link>
                                                : ''
                                        }
                                        {
                                            element.capability === "publish_tournament"
                                                ?

                                                row.status === 1
                                                    ?
                                                    <Link className='action-link gray-link mb-1'
                                                        onClick={() => { updateTournamentStatus(row.id, 0) }}>
                                                        Undo Publish
                                                    </Link>
                                                    :

                                                    <Link className='action-link green-link mb-1'
                                                        onClick={() => { updateTournamentStatus(row.id, 1) }}>
                                                        Publish
                                                    </Link>

                                                : ''
                                        }

                                        {
                                            element.capability === "archive_tournament"
                                                ?
                                                row.archived === 0
                                                    ?

                                                    <Link className='action-link blue-link mb-1' onClick={() => { updatearchivetournamentStatus(row.id) }}>Archive</Link>
                                                    : ""


                                                : ''
                                        }
                                        {
                                            element.capability === "send_email"
                                                ?
                                                <Link className='action-link pink-link mb-1' onClick={() => handleTournament(row.id)}

                                                >Send e-mail</Link>
                                                : ''
                                        }
                                        {
                                            element.capability === "export_tournament"
                                                ?
                                                <Link className='action-link pink-link mb-1' onClick={() => handleExport(row.id)}>
                                                    Export
                                                </Link >
                                                : ''
                                        }
                                        {
                                            element.capability === "checkin_tournament"
                                                ?
                                                <Link className=' action-link blue-link mb-1'
                                                    to={`/director/checkin/${row.id}`}

                                                >Checkin</Link>
                                                :
                                                ''
                                        }

                                    </>
                                )
                            })
                        }

                    </td>
                </>

            },
        ], [],
    );

    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    {/* <Col md={2}>
                        <MyProfileLeftNav />
                    </Col> */}
                    <Col md={10} lg={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.All tournaments.Tournaments')}
                            </Card.Header>
                            <Card.Body>

                                <Row>
                                    <Col md={6}>

                                        <Link className="btn btn-primary" to="/director/addTournament" role="button">
                                            {t('page.myprofile.myprofilenav.All tournaments.Addtournament')}
                                        </Link>

                                    </Col>

                                </Row>
                                <Row className='my-3'>
                                    <Col md={6}></Col>
                                    <Col md={6} className='text-end'>
                                        <Form.Group className="mb-5 form-group text-end d-flex align-items-center justify-content-end p-0" controlId="">
                                            <Form.Label className='d-block me-2'>Search :</Form.Label>

                                            <Form.Control type="text" className='player-statistics-search'
                                                onChange={filterBySearch}
                                            />
                                        </Form.Group>

                                    </Col>
                                </Row>
                                <DataTable

                                    data={filteredList}
                                    columns={columns}
                                    theme="dark"
                                    defaultSortFieldId={1}
                                    pagination
                                    customStyles={customeStyle}
                                    paginationPerPage={100}
                                    paginationComponentOptions={paginationComponentOptions}
                                    paginationRowsPerPageOptions={[10, 50, 100]}

                                />

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
            {isLoading && <LogoAnimationLoader />}

            <Modal show={modelshow}>
                <>
                    <Modal.Header>
                        <Modal.Title>Alert</Modal.Title>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setModelShow(false)}
                        ></button>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete tournament?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModelShow(false)}>
                            Close
                        </Button>
                        <Button variant="secondary" onClick={() => deleteTournament()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </>
            </Modal>
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
                                    getTournament()
                                    setDelete(false)
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



            <Modal show={sendEmailModal}>

                <Modal.Header>
                    <Modal.Title>Send Email</Modal.Title>
                    <button
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setSendEmailModal(false)}
                    ></button>
                </Modal.Header>
                <Form onSubmit={handleSendEmail}>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>

                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>


                                                <Form.Group className="form-group" controlId="">
                                                    <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Subject')}</Form.Label>
                                                    <Form.Control type="text" className='' name='subject' />
                                                </Form.Group>
                                                <Form.Group className="form-group" controlId="">
                                                    <Editor apiKey={process.env.REACT_APP_EDITOR_KEY}
                                                        i initialValue={content}
                                                        name="content"
                                                        onChange={handleEditorChange} />
                                                </Form.Group>




                                            </Col>

                                        </Row>

                                    </Card.Body>
                                </Card>

                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSendEmailModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>



            </Modal>


            <Modal show={sendModal}>
                <Modal.Header>
                    <Modal.Title>Saved</Modal.Title>
                </Modal.Header>

                <Modal.Body>{sendEmailMessage}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {


                            getTournament()
                            setSendModal(false)

                        }}
                    >
                        Okay
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AllTournaments;