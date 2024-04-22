import '../style.scss';

import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import Modal from 'react-bootstrap/Modal';


import { Row, Col, Form, Card, Button } from 'react-bootstrap';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    faBars,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DiscountService from '../../../api/services/AdminService/DiscountService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import customeStyle from '../customstyle';
import DataTable from 'react-data-table-component';
const Discount = () => {
    const [isActive, setActive] = useState(false)
    const navigate = useNavigate();
   
    const [discountList, setDiscountList] = useState([]);
    const [Error, setError] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setdeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [modalMessage, SetModalMessage] = useState('');
    const getSettingList = async () => {
        try {
            let responseData = await DiscountService.adminIndex().json()

            setDiscountList(responseData.data);
            setIsLoading(false)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    const columns = useMemo(
        () => [

            {
                name: 'Id',
                selector: discountList => discountList.id,
                sortable: true,

            },
            {
                name: 'Start Credit',
                selector: discountList => discountList.start_credit,
                sortable: true,
            },
            {
                name: 'End Credit',
                selector: discountList => discountList.end_credit,
                sortable: true,

            },
            {
                name: 'Is Percentage',
                selector: discountList => discountList.is_percentage,
                sortable: true,

            },
            {
                name: 'Extra Credit',
                selector: discountList => discountList.extra_credit,
                sortable: true,

            },

            {
                name: "Action",
                cell: (discountList) => <>
                    <td>
                        <Link className='action-link green-link mb-1' to={`/admin/editdiscount/${discountList.id}`}>Edit</Link>

                    </td>
                    <td>
                        <Link className='action-link red-link mb-1' onClick={() => { deletediscount(discountList.id) }}>Delete</Link>

                    </td>
                </>

            },
        ], [],
    );



    const toggleClass = () => {
        setActive(!isActive)
    }
    useEffect(() => {

        if (localStorage.getItem('admintoken')) {
            getSettingList();

        } else {
            navigate('/')
        }
    }, [navigate])

    const deletediscount = async (discountid) => {
        setDeleteId(discountid)
        setdeleteModal(true)

    }
    const handleDeleteUser = async () => {

        try {
            let responseData = await DiscountService.destroy(deleteId).json()
            if (responseData.status === true)
                setdeleteModal(false)
            setDeleteSuccess(true)

            SetModalMessage(responseData.message)

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
                <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
                    <FontAwesomeIcon icon={faBars} />
                </Link>
                <h1 className="ms-2">Discount</h1>
            </nav>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                Discount
                            </Card.Header>
                            <Card.Body>

                                <Row className='m-2'>
                                    <Col md={12} className='text-end'>
                                        <Button varient="primary" onClick={() => navigate('/admin/adddiscount')}>Create Discount</Button>
                                    </Col>

                                </Row>

                                <DataTable

                                    data={discountList}
                                    columns={columns}
                                    theme="dark"
                                    selectableRowsComponentProps={{ inkDisabled: true }}
                                    defaultSortFieldId={1}
                                    pagination
                                    customStyles={customeStyle}

                                />

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>



            </div>
          
            {isLoading && <LogoAnimationLoader />}
            <Modal show={deleteModal}>
                <>

                    <Modal.Header>
                        <Modal.Title>Alert</Modal.Title>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setdeleteModal(false)}
                        ></button>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete discount?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setdeleteModal(false)}>
                            Close
                        </Button>
                        <Button variant="secondary" onClick={() => handleDeleteUser()}>
                            Delete
                        </Button>
                    </Modal.Footer>


                </>
            </Modal>
            <Modal show={deleteSuccess}>
                <Modal.Header>
                    <Modal.Title>Deleted</Modal.Title>
                </Modal.Header>

                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsLoading(true)
                            getSettingList();

                            setDeleteSuccess(false)
                        }}
                    >
                        Okay
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Discount
