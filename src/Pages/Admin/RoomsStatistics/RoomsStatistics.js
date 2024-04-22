import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import { useTranslation } from 'react-i18next';
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import customeStyle from '../customstyle';
import DataTable from 'react-data-table-component';
import AdminRoomService from '../../../api/services/AdminService/AdminRoomService';
import setMinutes from "date-fns/setMinutes";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import setHours from "date-fns/setHours";
import {
    faBars,

} from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from "react-csv";
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
const RoomsStatistics = () => {
    const { t } = useTranslation();
    const [isActive, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const toggleClass = () => {
        setActive(!isActive)
    }
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const navigate = useNavigate();
    const [max, setMax] = useState(300);
    const [min, setMin] = useState(0);

    const [exportData, SetExportData] = useState([]);

    const [loadData, setLoadData] = useState([]);
    const [roomStatistics, setRoomStatistics] = useState([])
    const [tournaments, setTournaments] = useState([])
    const [filteredList, setFilteredList] = new useState([]);
    const getroomIndex = async () => {
        try {
            let responseData = await AdminRoomService.adminIndex().json()
            setIsLoading(false);
            setLoadData(responseData.data)


        } catch (error) {
            setIsLoading(true)
        }
    }
    useEffect(() => {
        if (localStorage.getItem('admintoken')) {
            getroomIndex()

        }
        else {
            navigate('/')
        }

    }, [])
    const handleInput = (e, max) => {
        setMax(max)
        setMin(e);
    }
    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: "ALL"
    };
    const columns = useMemo(
        () => [

            {
                name: 'Date',
                selector: tournaments => tournaments.detail ? moment(tournaments.detail.startday).format('DD.MM.YYYY HH:mm') : '',
                sortable: true,

            },
            // {
            //     name: 'Time',
            //     selector: tournaments => tournaments.detail ? moment(tournaments.detail.startday).format('HH:mm') : '',
            //     sortable: true,
            // },
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
                name: 'Players without check-in',
                selector: row => row.players ? row.players.registered : '',
                sortable: true
            },
            {
                name: 'Prize Pool',
                selector: row => row.detail ? (row.detail.buyin + row.detail.bounty) * (row.players.checkin) : 0,
                sortable: true
            },
            {
                name: 'Rake',
                selector: row => row.detail ? row.detail.rake : '',
                sortable: true
            },
            {
                name: 'Re-entry rake',
                selector: row => row.reentry ? row.reentry : 0,
                sortable: true
            },
            {
                name: 'Cumulated rakes',
                selector: row => row.cumulated ? row.cumulated : 0,
                sortable: true
            },

        ], [],
    );

    const handleSearch = () => {

        var data = tournaments.filter(row => {
            return row.detail && moment(startDate).format('DD.MM.YYYY') <= moment(row.detail.startday).format('DD.MM.YYYY')
                &&
                moment(endDate).format('DD.MM.YYYY') >= moment(row.detail.startday).format('DD.MM.YYYY ')

        })


        if (data.length === 0) {
            setFilteredList(data.filter(
                (element) => {
                    return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
                }));
            SetExportData(data.filter(
                (element) => {
                    return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
                }))
        }
        else {


            setFilteredList(data.filter(
                (element) => {
                    return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
                }));
            SetExportData(data.filter(
                (element) => {
                    return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
                }))


        }


    }
    const headers = [
        { label: 'Date', key: 'detail.startday' },
        { label: 'Time', key: 'detail.startday' },
        { label: 'Tournament Name', key: 'title' },
        { label: 'Buy-in', key: 'detail.buyin' },
        { label: 'Bounty', key: 'detail.bounty' },
        { label: 'Players with check-in', key: 'players.checkin' },
        { label: 'Re-entries', key: 'detail.maxreentries' },
        { label: 'Players without check-in', key: 'players.registered' },
        { label: 'Prize Pool', key: 'players.checkin' },
        { label: 'Rake', key: 'detail.rake' },
        { label: 'Re-entry rake', key: 'reentry' },
        { label: 'Cumulated rakes', key: 'cumulated' },

    ];
    const handleroom = async (e) => {

        try {
            let responseData = await AdminRoomService.getstatisticsbyroomid(e).json()
            setRoomStatistics(responseData.data);
            let TournamnetData = await AdminRoomService.gettournamentlistbyroomId(e).json()
            setTournaments(TournamnetData.data)
            setFilteredList(TournamnetData.data)
            SetExportData(TournamnetData.data)

        } catch (error) {
            setIsLoading(true)
        }
    }
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const header = [
        'Date',
        'Tournament Name',
        'Buy-in',
        'Bounty',
        'Players with check-in',
        'Re-entries',
        'Players without check-in',
        'Prize Pool',
        'Rake',
        'Re-entry rake',
        'Cumulated rakes'


    ];
    function handleDownloadExcel() {
        downloadExcel({
            fileName: "Check-Raise",
            sheet: "PlayerStatistics",
            tablePayload: {
                header,
                // accept two different data structures
                // body: filteredList.filter((element) => { return element.firstname }),
                body: filteredList
            },
        });
    }
    return (

        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
                <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
                    <FontAwesomeIcon icon={faBars} />
                </Link>
                <h1 className="ms-2">Room Statistics</h1>
            </nav>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>

                    <Col md={12}>
                        <Card>

                            <Card.Body>
                                <Form className="static">
                                    <Row>
                                        <Col md={3} className="without-date-calander">
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.StartDate')}</Form.Label>

                                                <DatePicker

                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}

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
                                        <Col md={3} className="without-date-calander">
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.EndDate')}</Form.Label>
                                                {/* https://reactdatepicker.com/ */}
                                                <DatePicker
                                                    selectsEnd
                                                    selected={endDate}
                                                    onChange={date => setEndDate(date)}
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
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Buy-In')}</Form.Label>
                                                <MultiRangeSlider
                                                    min={0}
                                                    max={300}

                                                    onChange={({ min, max }) => handleInput(min, max)}

                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-1 mb-lg-4 form-group  text-end" controlId="">
                                                <Form.Label className='d-block'>&nbsp;</Form.Label>
                                                <Button varient="parimary" onClick={handleSearch}>{t('page.myprofile.myprofilenav.RoomStatistics.Search')}</Button>
                                            </Form.Group>
                                        </Col>


                                    </Row>
                                </Form>

                                <Row>
                                    <Row md={12} style={{ marginBottom: 30 }}>
                                        <Col md={3}>
                                            <h3 style={{ marginTop: 10 }}>Please Select Room:</h3>
                                        </Col>

                                        <Col md={3}>
                                            <Form.Select
                                                onChange={(e) => handleroom(e.target.value)}>
                                                <option value=''>Select Room</option>
                                                {
                                                    loadData.map((element) => (
                                                        <option value={element.id}>{element.title}</option>
                                                    ))
                                                }

                                            </Form.Select>
                                        </Col>
                                    </Row>

                                    <Col md={12}>
                                        <h3>Room Statistics on finished tournaments without reservations:</h3>
                                    </Col>
                                    <Col md={12}>
                                        <ul className='list-group list-group-flush'>

                                            <li className="list-group-item">
                                                Different players - {roomStatistics ? roomStatistics.tournament_different_player : 0}</li>
                                            <li className="list-group-item">
                                                Registered players - {roomStatistics ? roomStatistics.tournament_registered_player : 0}</li>
                                            <li className="list-group-item">
                                                Number of tournaments -
                                                &nbsp; &nbsp;
                                                Last Week : &nbsp;{roomStatistics ? roomStatistics.number_tournament_last_week : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Last month : &nbsp;{roomStatistics ? roomStatistics.number_tournament_last_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Last 12 months : &nbsp;{roomStatistics ? roomStatistics.number_tournament_last_year : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Ever: {roomStatistics ? roomStatistics.number_of_tournament : 0}
                                            </li>
                                            <li className="list-group-item">
                                                Average number of tournaments -
                                                &nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.avg_number_tournament_last_week : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.avg_number_tournament_last_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year : &nbsp;{roomStatistics ? roomStatistics.avg_number_tournament_last_year : 0}
                                            </li>

                                        </ul>
                                    </Col>
                                    <Col md={12}>
                                        <h3>Room Statistics on finished tournaments without reservations, for players with/without check-in:</h3>
                                    </Col>
                                    <Col md={12}>
                                        <ul className='list-group list-group-flush'>

                                            <li className="list-group-item">
                                                Players with check-in - {roomStatistics ? roomStatistics.player_with_checkin_number : ''} and &nbsp;{roomStatistics ? roomStatistics.player_with_checkin_per + " / " + roomStatistics.tournament_registered_player : 0} </li>
                                            <li className="list-group-item">
                                                Players without check-in - {roomStatistics ? roomStatistics.player_without_checkin_number : ''} and &nbsp;{roomStatistics ? roomStatistics.tournament_without_checkin_player_per + " / " + roomStatistics.tournament_registered_player : 0} </li>
                                            <li className="list-group-item">
                                                Average number of players -
                                                &nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.avg_player_per_week : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.avg_player_per_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year : &nbsp;{roomStatistics ? roomStatistics.avg_player_per_year : 0}</li>
                                            <li className="list-group-item">
                                                Average Prize pool -&nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.avg_price_pool_weak : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.avg_price_pool_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year : &nbsp;{roomStatistics ? roomStatistics.avg_price_pool_year : 0}</li>
                                            <li className="list-group-item">
                                                Average Rakes  -&nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.avg_rake_weak : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.avg_rake_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year : &nbsp;{roomStatistics ? roomStatistics.avg_rake_year : 0}</li>
                                            <li className="list-group-item">
                                                Cumulated Prize pools -&nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.com_prize_pool_weak : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.com_prize_pool_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year: &nbsp;{roomStatistics ? roomStatistics.com_prize_pool_year : 0}</li>
                                            <li className="list-group-item">
                                                Cumulated Rakes -&nbsp; &nbsp;
                                                Per week : &nbsp;{roomStatistics ? roomStatistics.com_rake_weak : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per month : &nbsp;{roomStatistics ? roomStatistics.com_rake_month : 0}
                                                &nbsp;&nbsp;&nbsp;
                                                Per year : &nbsp;{roomStatistics ? roomStatistics.com_rake_year : 0}</li>
                                        </ul>
                                    </Col>
                                </Row>

                                <Row className='my-3'>
                                    <Col md={12} ref={componentRef}>
                                        <h3>{t('page.myprofile.myprofilenav.RoomStatistics.Tournaments')}</h3>

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

                                    </Col>

                                    <Col md={12} className='text-end'>
                                        {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : tournaments} headers={headers}>Export</CSVLink> */}
                                        <Col md={12} className='text-end'>
                                            <Button variant="primary"
                                                onClick={handlePrint}
                                            >
                                                Print
                                            </Button>

                                            &nbsp;
                                            <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : tournaments} headers={headers}>Download</CSVLink>
                                            &nbsp;
                                            <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : tournaments} headers={headers}>Save CSV</CSVLink>
                                            &nbsp;
                                            <button varient="primary" class="btn btn-primary" onClick={handleDownloadExcel}>Save Excel</button>
                                        </Col>
                                    </Col>
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

export default RoomsStatistics;