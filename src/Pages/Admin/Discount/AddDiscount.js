
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

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DiscountService from '../../../api/services/AdminService/DiscountService';
const CreateDiscount = () => {
    const [isActive, setActive] = useState(false)

    const [percentage, setpercentage] = useState(0);
    const params = useParams()
    const navigate = useNavigate()
    const [Error, setError] = useState('');
    const [modalmessage, setModalMessage] = useState('');
    const [Modalshow, setModelShow] = useState(false);
    const toggleClass = () => {
        setActive(!isActive)
    }

    useEffect(() => {

        var id = params.id
        if (localStorage.getItem('admintoken')) {

        } else {
            navigate('/')
        }
    }, [])


    const handlediscount = async (event) => {
        event.preventDefault();

        try {
            var userData = {
                start_credit: event.target.start.value,
                end_credit: event.target.end.value,
                is_percentage: percentage,
                extra_credit: event.target.extra.value
            }
            const data = await DiscountService.insert(userData).json();

            if (data.status === true) {
                setModelShow(true)
                setModalMessage(data.message)
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
                <h1 className="ms-2">Create Discount</h1>
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
                                                <Form onSubmit={handlediscount}>

                                                    <Form.Group className="form-group" controlId="">
                                                    </Form.Group>
                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Start Credit</Form.Label>
                                                        <Form.Control onWheel={(e) => e.target.blur()} type="number"
                                                            name='start'
                                                            className=''


                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>End Credit</Form.Label>
                                                        <Form.Control
                                                        
                                                        onWheel={(e) => e.target.blur()}    type="number"
                                                            name='end'
                                                            className=''

                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Is Percentage</Form.Label>
                                                        <Form.Check // prettier-ignore
                                                            type="switch"
                                                            id="custom-switch"
                                                            label=""

                                                            value={percentage}

                                                            onChange={() => {

                                                                setpercentage(percentage ? 0 : 1)

                                                            }

                                                            }

                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group" controlId="">
                                                        <Form.Label>Extra Credit</Form.Label>
                                                        <Form.Control onWheel={(e) => e.target.blur()} type="number"
                                                            name='extra'
                                                            className=''

                                                        />
                                                    </Form.Group>

                                                    <p className='error'>{Error}</p>
                                                    <Row className='mt-2'>

                                                        <Col sm={12} className='text-end'>
                                                            <Button className=" btn btn-primary btn-submit" type="submit" >Add Discount</Button>
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
                                    navigate('/admin/discount')
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

export default CreateDiscount
