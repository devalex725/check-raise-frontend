
import React, {
    useEffect,
    useState,

} from 'react';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Modal
} from 'react-bootstrap';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TransactionService from '../../../api/services/AdminService/TransactionService';
const EditTransaction = () => {
    const [isActive, setActive] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const [Error, setError] = useState('');
    const [modalmessage, setModalMessage] = useState('');
    const [Modalshow, setModelShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionData, SetTransactionData] = useState([]);

    const toggleClass = () => {
        setActive(!isActive)
    }
    const getTransactionList = async (id) => {
        try {
            let responseData = await TransactionService.edit(id).json()
            SetTransactionData(responseData.data)

            setIsLoading(false)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {

        var id = params.id
        if (localStorage.getItem('admintoken')) {
            getTransactionList(id)
        } else {
            navigate('/')
        }
    }, [])


    const handletransaction = async (event) => {
        event.preventDefault();
       
        try {
            var userData = {
                description: event.target.description.value,
                amount: event.target.amount.value,

            }
            const data = await TransactionService.update(params.id, userData).json();

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
                <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
                    <FontAwesomeIcon icon={faBars} />
                </Link>
                <h1 className="ms-2">Edit Transaction</h1>
            </nav>
            <main>
                <div className="wrapper contact-wrapper">
                    <Container>
                        <Row>
                            <Col lg={12}>

                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>
                                                <Form onSubmit={handletransaction}>

                                                    <Form.Group className="form-group" controlId="">
                                                    </Form.Group>
                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control type="text"
                                                            name='description'
                                                            className=''
                                                            defaultValue={transactionData.description}

                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Amount</Form.Label>

                                                        <Form.Control // prettier-ignore
                                                           onWheel={(e) => e.target.blur()} type="number"
                                                            name='amount'
                                                            label=""
                                                            min={0}
                                                            defaultValue={transactionData.amount}



                                                        />
                                                    </Form.Group>

                                                    <p className='error'>{Error}</p>
                                                    <Row className='mt-2'>

                                                        <Col sm={12} className='text-end'>
                                                            <Button className=" btn btn-primary btn-submit" type='submit' >Edit Transaction</Button>
                                                        </Col>
                                                    </Row>

                                                </Form>

                                            </Col>

                                        </Row>
                                    </Card.Body>
                                </Card>
                                {/* </div>   */}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </main>
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
                                    navigate('/admin/transaction')
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
    )
}

export default EditTransaction
