import React, { useState } from 'react';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";



const PlayersStatistics = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState(new Date());
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

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
                                {t('page.myprofile.myprofilenav.RoomStatistics.Statistics')}
                            </Card.Header>
                            <Card.Body>
                                <Form className="static">
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-5 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Player')}</Form.Label>
                                                <Select options={options} className="react-select-container"
                                                    classNamePrefix="react-select" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-5 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Date')}</Form.Label>
                                                {/* https://reactdatepicker.com/ */}
                                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} calendarStartDay={1} />
                                            </Form.Group>

                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-5 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Buy-In')}</Form.Label>
                                                <MultiRangeSlider
                                                    min={0}
                                                    max={300}
                                                    onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-5 form-group text-end" controlId="">
                                                <Form.Label className='d-block'>&nbsp;</Form.Label>
                                                <Button varient="parimary">{t('page.myprofile.myprofilenav.RoomStatistics.Search')}</Button>
                                            </Form.Group>
                                        </Col>

                                        <Col md={3} className=''>
                                            <Form.Group className="mb-3 form-group p-0" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.PokerRoom')}</Form.Label>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="all" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="all"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.All')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="anotherPoker" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="anotherPoker"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.AnotherPokerBasel')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="B13" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="B13"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.B13')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="Devienscroupier" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="Devienscroupier"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.Devienscroupier')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="fripoker" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="fripoker"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.fripoker')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="FulledgePokerclub" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="FulledgePokerclub"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.FulledgePokerclub')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="GoldringPoker" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="GoldringPoker"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.GoldringPoker')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="GruyèrePokerRoom" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="GruyèrePokerRoom"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.GruyèrePokerRoom')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="HeavenPoker" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="HeavenPoker"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.HeavenPoker')}
                                                    />
                                                </div>
                                            </Form.Group>


                                            <Form.Group className="mb-3" controlId="">
                                                <div key="LeclubpokerFJ" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="LeclubpokerFJ"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.LeclubpokerFJ')}
                                                    />
                                                </div>
                                            </Form.Group>


                                            <Form.Group className="mb-3" controlId="">
                                                <div key="PRCchaux-de-fonds" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="PRCchaux-de-fonds"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.PRCchaux-de-fonds')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="RPRRogersPokerrom" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="RPRRogersPokerrom"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.RPRRogersPokerrom')}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="">
                                                <div key="Smaggypoker" className="mb-1 d-flex">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="Smaggypoker"
                                                        label={t('page.myprofile.myprofilenav.RoomStatistics.Smaggypoker')}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>

                                <Row>
                                    <Col md={12}>
                                        <h3>{t('page.myprofile.myprofilenav.RoomStatistics.RoomStatistics')}</h3>
                                    </Col>

                                    <Col md={12}>
                                        <ul className='list-group list-group-flush'>

                                            <li className="list-group-item">
                                                Number of players - 9693        </li>
                                            <li className="list-group-item">
                                                Number of tournaments - 336        </li>
                                            <li className="list-group-item">
                                                Average number of players          <br className="mobile-show" />per tournament - 28.8        </li>
                                            <li className="list-group-item">
                                                Average number of players          <br className="mobile-show" />per week - 745.6        </li>
                                            <li className="list-group-item">
                                                Average number of players          <br className="mobile-show" />per month - 4846.5        </li>
                                            <li className="list-group-item">
                                                Average number of players          <br className="mobile-show" />per year - 9693        </li>
                                            <li className="list-group-item">
                                                Cumulated Buy-in+Bounty - 979180        </li>
                                            <li className="list-group-item">
                                                Cumulated Rakes - 208975        </li>
                                        </ul>
                                    </Col>
                                </Row>

                                <Row className='my-3'>
                                    <Col md={12}>
                                        <h3>{t('page.myprofile.myprofilenav.RoomStatistics.Tournaments')}</h3>

                                        <Table responsive className="alltournamenttable">
                                            <thead>
                                                <tr>
                                                    <th>Date / Time</th>
                                                    <th>Tournament Name</th>
                                                    <th>Buy-in +Bounty</th>
                                                    <th>Rake</th>
                                                    <th>Players</th>
                                                    <th>Total Buy-in<br /> +Total Bounty</th>
                                                    <th>Total Rake</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/">Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                                <tr>
                                                    <td>19.06.2021, 13:00</td>
                                                    <td>
                                                        <Link to="/" className='text-truncate w-100'>Inauguration fripoker</Link>
                                                    </td>
                                                    <td><span className="badge">90+0</span></td>
                                                    <td><span className="badge">10</span></td>
                                                    <td><span className="badge">62</span></td>
                                                    <td><span className="badge">5580</span></td>
                                                    <td><span className="badge">180</span></td>
                                                </tr>
                                            </tbody>
                                        </Table>


                                    </Col>

                                    <Col md={12} className='text-end'>  <Button varient="primary">Export</Button></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>


            </div>

        </>
    );
};

export default PlayersStatistics;