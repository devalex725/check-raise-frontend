import React, { useState, useEffect, useMemo,useRef } from 'react';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import { useTranslation } from 'react-i18next';
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import customeStyle from '../../Admin/customstyle';
import DataTable from 'react-data-table-component';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from "react-csv";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import RoomService from '../../../api/services/RoomService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import moment from 'moment';

const RoomsStatistics = () => {
    const { t } = useTranslation();

    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 16));
    const [max, setMax] = useState(300);
    const [min, setMin] = useState(0);

    const [tournaments, setTournaments] = useState([])
    const [filteredList, setFilteredList] = new useState([]);
    const [exportData, SetExportData] = useState([]);
    const [roomStatistics, setRoomStatistics] = useState([])
    const [isLoading, setisloading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            getRoomStatData();
        }
        else {
            navigate('/')
        }

    }, []);
    const handleInput = (e, max) => {
        setMax(max)
        setMin(e);
    }
    const getRoomStatData = async () => {
        try {
            let responseData = await RoomService.roomStatistics().json()
            setRoomStatistics(responseData.data);
            let TournamnetData = await RoomService.tournamentList().json()
            setTournaments(TournamnetData.data)
            setFilteredList(TournamnetData.data)
            SetExportData(TournamnetData.data)


            setisloading(false)
        } catch (error) {
            setisloading(true)
        }
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
            {
                name: 'Time',
                selector: tournaments => tournaments.detail ? moment(tournaments.detail.startday).format('HH:mm') : '',
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
                selector: row => row.players ? row.players.checkin : 0,
                sortable: true,

            },
            {
                name: 'Re-entries',
                selector: row => row.detail ? row.detail.maxreentries : 0,
                sortable: true
            },
            {
                name: 'Players without check-in',
                selector: row => row.players ? row.players.registered : 0,
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
            return row.detail && moment(startDate).format('DD.MM.YYYY') <= moment(row.detail.startday).format('DD.MM.YYYY ')
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
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
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
                                {t('page.myprofile.myprofilenav.RoomStatistics.Statistics')}
                            </Card.Header>
                            <Card.Body>
                                <Form className="static">
                                    <Row>

                                        <Col md={3} className="without-date-calander">
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.StartDate')}</Form.Label>

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
                                            <Form.Group className="mb-1 mb-lg-4 form-group " controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Buy-In')}</Form.Label>
                                                <MultiRangeSlider
                                                    min={0}
                                                    max={300}
                                                    // value={min}

                                                    // onChange={({ min, max }) => {
                                                    //     // console.log(`min = ${min}, max = ${max}`)
                                                    //     handleInput
                                                    // }
                                                    //
                                                    // }
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
                                            responsive className="alltournamenttable"
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
                                    <Col md={12} className='text-end'

                                    >
                                        {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : tournaments} headers={headers}>Export</CSVLink> */}

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