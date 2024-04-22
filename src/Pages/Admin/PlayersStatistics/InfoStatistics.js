import React, { useState, useEffect, useMemo } from 'react';

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import customeStyle from '../../Admin/customstyle';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import './PlayersStatistics.scss'
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';

import AdminPlayerService from '../../../api/services/AdminService/AdminPlayerService';
import moment from 'moment';
const InfoStatistics = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const [isLoading, setisloading] = useState(false);
    const [statisticswith, setStatisticsWith] = useState([]);
    const [statisticswithout, setStatisticsWithout] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [roommembers, setRoomMember] = useState([]);
    const [max, setMax] = useState(300);
    const [min, setMin] = useState(0);
    const [tournaments, setTournaments] = useState([])
    const params = useParams()
    const navigate = useNavigate();
    const handleInput = (e, max) => {
        setMax(max)
        setMin(e);

    }
    const getPlayerstatistics = async (id) => {
        try {
            let responseDatas = await AdminPlayerService.infoStatistics(id).json()
            console.log(responseDatas)
            setisloading(false);

            setStatisticsWith(responseDatas.statistics_with_checkin)

            setStatisticsWithout(responseDatas.statistics_without_checkin)
            setRoomMember(responseDatas.room_memeber);
            let TournamnetData = await AdminPlayerService.tournamentList().json()
            setTournaments(TournamnetData.data)
            setFilteredList(TournamnetData.data)
        } catch (error) {
            setisloading(false)
        }
    }


    useEffect(() => {

        var id = params.id
        if (localStorage.getItem('admintoken')) {
            getPlayerstatistics(id);

        }
        else {
            navigate('/')
        }

    }, [])
    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: "ALL"
    };
    const columns = useMemo(
        () => [

            {
                name: 'Date',
                selector: tournaments => tournaments.detail ? moment(tournaments.detail.startday).format(' DD.MM.YYYY') : '',
                sortable: true,

            },
            {
                name: 'Time',
                selector: tournaments => tournaments.detail ? moment(tournaments.detail.startday).format('HH:MM') : '',
                sortable: true,
            },
            {
                name: 'Tournament Name',
                selector: row => row ? row.title : '',
                sortable: true,

            },
            {
                name: 'Buy-in',
                selector: row => row.detail ? row.detail.buyin : '',
                sortable: true,

            },
            {
                name: 'Bounty',
                selector: row => row.detail ? row.detail.bounty : '',
                sortable: true,

            },
            {
                name: 'Players with check-in',
                selector: row => row.players ? row.players.checkin : '',
                sortable: true,

            },
            {
                name: 'Re-entries',
                selector: row => row.detail ? row.detail.maxreentries : '',
                sortable: true
            },

            {
                name: 'Cumulated Buy-in bounty Re-entries',
                selector: row => row.cumulated,
                sortable: true
            },
            {
                name: 'Rake',
                selector: row => row.detail ? row.detail.rake : '',
                sortable: true
            },
            {
                name: 'Re-entry rake',
                selector: row => row.reentry ? row.reentry : '',
                sortable: true
            },
            {
                name: 'Cumulated rakes',
                selector: row => row.cumulated ? row.cumulated : '',
                sortable: true
            },

        ], [],
    );
    const handleSearch = () => {
        var data = tournaments.filter(row => { return row.detail && moment(row.detail.startday).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD') })

        if (data.length === 0) {
            setFilteredList(tournaments);
        }
        else {

            setFilteredList(data.filter(
                (element) => {
                    return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
                }));
        }

    }


    return (
        <>

            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>

                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.RoomStatistics.Statistics')}
                            </Card.Header>
                            <Card.Body>
                                <Form className="static">

                                    <Row>

                                        {/* <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-4 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Date')}</Form.Label>
                                                
                                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                                            </Form.Group>

                                        </Col> */}
                                        <Col md={3} className="without-date-calander">
                                            <Form.Group className="mb-1 mb-lg-4 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.StartDate')}</Form.Label>
                                                {/* https://reactdatepicker.com/ */}
                                                {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}  dateFormat="dd.MM.yyyy"/> */}
                                                <DatePicker
                                                    selectsStart
                                                    selected={startDate}
                                                    onChange={date => setStartDate(date)}
                                                    startDate={startDate}
                                                    // showTimeSelect
                                                    // timeFormat="HH:mm"
                                                    // injectTimes={[
                                                    //     setHours(setMinutes(new Date(), 1), 0),
                                                    //     setHours(setMinutes(new Date(), 5), 12),
                                                    //     setHours(setMinutes(new Date(), 59), 23),
                                                    // ]}
                                                    dateFormat="dd.MM.yyyy"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>

                                        </Col>
                                        <Col md={3} className="without-date-calander">
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.EndDate')}</Form.Label>

                                                <DatePicker
                                                    selectsEnd
                                                    selected={endDate}
                                                    onChange={date => setEndDate(date)}
                                                    endDate={endDate}
                                                    // showTimeSelect
                                                    // timeFormat="HH:mm"
                                                    // injectTimes={[
                                                    //     setHours(setMinutes(new Date(), 1), 0),
                                                    //     setHours(setMinutes(new Date(), 5), 12),
                                                    //     setHours(setMinutes(new Date(), 59), 23),
                                                    // ]}
                                                    dateFormat="dd.MM.yyyy"
                                                    calendarStartDay={1}
                                                />
                                            </Form.Group>

                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-4 form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Buy-In')}</Form.Label>
                                                <MultiRangeSlider
                                                    min={0}
                                                    max={300}
                                                    onChange={({ min, max }) => handleInput(min, max)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-5 form-group text-end" controlId="">
                                                <Form.Label className='d-block'>&nbsp;</Form.Label>
                                                <Button varient="parimary" onClick={handleSearch}>{t('page.myprofile.myprofilenav.RoomStatistics.Search')}</Button>
                                            </Form.Group>
                                        </Col>


                                    </Row>
                                </Form>
                                <Row>
                                {roommembers.length>0?
                                    <>
                                    <h4>Room List</h4>
                                    <table style={{margin:"12px"}}>
                                    <th style={{paddingBottom:"10px"}}>Name</th>
                                    <th>Expiry</th>
                                    {roommembers.map((rm) => {
                                        return (
                                        <>
                                        <tr>
                                            <td style={{width:"20%"}}>{rm.title}</td>
                                            <td>{rm.expiry}</td>
                                        </tr>
                                        </>
                                        )
                                    })}
                                    </table>
                                    </>:''}
                                </Row>
                                <Row>



                                    <Col md={12}>
                                        {/* <p>df</p> */}
                                        <h4>Statistics on finished tournaments for player without check-in:</h4>
                                    </Col>
                                    <Col md={12}>
                                        <ul className='list-group list-group-flush'>

                                            {
                                                statisticswithout

                                                    .map((element) => {
                                                        return (
                                                            <>
                                                                <li className="list-group-item">
                                                                    Last registration without check-in &nbsp; &nbsp;  &nbsp;&nbsp;&nbsp;
                                                                    {element.last_registration_without_check_in_date
                                                                        ? element.last_registration_without_check_in_date
                                                                            .created_at : ''}
                                                                </li>
                                                                <li className="list-group-item">
                                                                    Number of registration without check-in  &nbsp; &nbsp;  &nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {element.number_of_registrations_without_check_in

                                                                        ? element.number_of_registrations_without_check_in

                                                                            .last_week : ''}

                                                                    &nbsp; &nbsp; Last month :&nbsp;
                                                                    {element.number_of_registrations_without_check_in

                                                                        ? element.number_of_registrations_without_check_in

                                                                            .last_month : ''}
                                                                    &nbsp; &nbsp; Last 6 months :&nbsp;
                                                                    {element.number_of_registrations_without_check_in

                                                                        ? element.number_of_registrations_without_check_in

                                                                            .last_six_month : ''}
                                                                    &nbsp; &nbsp;Last 12 months :&nbsp;
                                                                    {element.number_of_registrations_without_check_in

                                                                        ? element.number_of_registrations_without_check_in

                                                                            .twelve_month : ''}
                                                                    &nbsp; &nbsp;Ever:&nbsp;
                                                                    {element.number_of_registrations_without_check_in

                                                                        ? element.number_of_registrations_without_check_in

                                                                            .ever : ''}

                                                                </li>

                                                            </>
                                                        )
                                                    })
                                            }
                                        </ul>

                                    </Col>
                                    <Col md={12}>
                                        <h4>Statistics on finished tournaments for player with check-in:</h4>
                                    </Col>
                                    <Col md={12}>
                                        <ul className='list-group list-group-flush'>
                                            {
                                                statisticswith

                                                    .map((element) => {
                                                        return (
                                                            <>
                                                                <li className="list-group-item">
                                                                    Last registration with check-in
                                                                    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;  {element.last_registration_with_check_in_date
                                                                        ? element.last_registration_with_check_in_date
                                                                            .created_at : ''}
                                                                </li>
                                                                <li className="list-group-item">
                                                                    Number of registration with check-in &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {
                                                                        element.number_of_registrations_with_check_in

                                                                            ? element.number_of_registrations_with_check_in.last_week : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last month :&nbsp;
                                                                    {
                                                                        element.number_of_registrations_with_check_in

                                                                            ? element.number_of_registrations_with_check_in

                                                                                .last_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 6 month :&nbsp;
                                                                    {
                                                                        element.number_of_registrations_with_check_in

                                                                            ? element.number_of_registrations_with_check_in

                                                                                .last_six_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 12 months :&nbsp;
                                                                    {
                                                                        element.number_of_registrations_with_check_in

                                                                            ? element.number_of_registrations_with_check_in

                                                                                .twelve_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Ever :&nbsp;
                                                                    {
                                                                        element.number_of_registrations_with_check_in

                                                                            ? element.number_of_registrations_with_check_in

                                                                                .ever : ''
                                                                    }

                                                                </li>
                                                                <li className="list-group-item">
                                                                    Average Buy-in + Bounty  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.last_week : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last month :&nbsp;

                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount

                                                                                .last_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 6 months  :&nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.last_six_month : ''
                                                                    }
                                                                    &nbsp; &nbsp;
                                                                    Last 12 months :&nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.twelve_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Ever :  &nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.ever : ''}</li>
                                                                <li className="list-group-item">
                                                                    Number of Re-entries &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.last_week
                                                                            : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last month :&nbsp;

                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.last_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 6 months  :&nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.last_six_month : ''
                                                                    }
                                                                    &nbsp; &nbsp;
                                                                    Last 12 months :&nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.twelve_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Ever :  &nbsp;
                                                                    {
                                                                        element.average_buy_in_bount

                                                                            ? element.average_buy_in_bount.ever : ''}</li>
                                                                <li className="list-group-item">
                                                                    Cumulated  Buy-in + Bounty + Re-entries
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {
                                                                        element.cumulated_buy_in_bounty_re_entries

                                                                            ? element.cumulated_buy_in_bounty_re_entries.
                                                                                last_week : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last month :&nbsp;

                                                                    {
                                                                        element.cumulated_buy_in_bounty_re_entries

                                                                            ? element.cumulated_buy_in_bounty_re_entries.last_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 6 months  :&nbsp;
                                                                    {
                                                                        element.cumulated_buy_in_bounty_re_entries

                                                                            ? element.cumulated_buy_in_bounty_re_entries.last_six_month : ''
                                                                    }
                                                                    &nbsp; &nbsp;
                                                                    Last 12 months :&nbsp;
                                                                    {
                                                                        element.cumulated_buy_in_bounty_re_entries

                                                                            ? element.cumulated_buy_in_bounty_re_entries.twelve_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Ever :  &nbsp;
                                                                    {
                                                                        element.cumulated_buy_in_bounty_re_entries

                                                                            ? element.cumulated_buy_in_bounty_re_entries.ever : ''}</li>
                                                                <li className="list-group-item">
                                                                    Cumulated Rakes &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Last week :&nbsp;

                                                                    {
                                                                        element.cumulated_rakes

                                                                            ? element.cumulated_rakes.
                                                                                last_week : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last month :&nbsp;

                                                                    {
                                                                        element.cumulated_rakes

                                                                            ? element.cumulated_rakes.last_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Last 6 months  :&nbsp;
                                                                    {
                                                                        element.cumulated_rakes

                                                                            ? element.cumulated_rakes.last_six_month : ''
                                                                    }
                                                                    &nbsp; &nbsp;
                                                                    Last 12 months :&nbsp;
                                                                    {
                                                                        element.cumulated_rakes

                                                                            ? element.cumulated_rakes.twelve_month : ''
                                                                    }
                                                                    &nbsp; &nbsp; Ever :  &nbsp;
                                                                    {
                                                                        element.cumulated_rakes

                                                                            ? element.cumulated_rakes.ever : ''}</li>
                                                            </>
                                                        )
                                                    })}



                                        </ul>
                                    </Col>
                                    {/* <Col md={12}>
                                        <h3>{t('page.myprofile.myprofilenav.RoomStatistics.Tournaments')}</h3>
                                    </Col>
                                    <Col md={12}>
                                        <DataTable
                                            // responsive className="alltournamenttable"
                                            // data={filteredList}
                                            // columns={columns}
                                            // theme="dark"
                                            // selectableRowsComponentProps={{ inkDisabled: true }}
                                            // defaultSortFieldId={1}
                                            // pagination
                                            // customStyles={customeStyle}
                                            data={filteredList}
                                            columns={columns}
                                            theme="dark"
                                            selectableRowsComponentProps={{ inkDisabled: true }}
                                            defaultSortFieldId={1}
                                            pagination
                                            customStyles={customeStyle}
                                            paginationPerPage={100}
                                            paginationComponentOptions={paginationComponentOptions}
                                            paginationRowsPerPageOptions={[10, 50, 100]}
                                        />

                                    </Col> */}
                                </Row>


                            </Card.Body>
                        </Card>
                    </Col>

                </Row>


            </div>

            {isLoading && <LogoAnimationLoader />}

        </>
    );
};

export default InfoStatistics;