import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import customeStyle from '../customstyle';
import DataTable from 'react-data-table-component';
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import { useTranslation } from 'react-i18next';
import User from '../../../api/services/User';
import moment from 'moment';
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import AdminRoomService from '../../../api/services/AdminService/AdminRoomService';
import AdminTournamentService from '../../../api/services/AdminService/AdminTournamentService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
const AllTournaments = () => {
  const { t } = useTranslation();
  const [isLoading, setisloading] = useState(true);
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [max, setMax] = useState(300);
  const [min, setMin] = useState(0);
  const [tournament, SetTournament] = useState([]);
  const [Error, setError] = useState('');
  const [RoomData, setRoomData] = useState([]);
  const [filteredList, setFilteredList] = new useState([]);
  const [deleteModal, setdeleteModal] = useState(false);
  const [selectdata, setSelectData] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [modalMessage, SetModalMessage] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [searchParam] = useState([
    'title',

  ])
  const userIndexApi = async () => {
    try {
      let responseData = await AdminTournamentService.index().json()

      SetTournament(responseData.data);
      setFilteredList(responseData.data);
      let responseData1 = await AdminRoomService.adminIndex().json()
      setRoomData(responseData1.data)
      setisloading(false)

    }
    catch (error) {

      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const filterBySearch = (event) => {
    const query = event.target.value;

    var updatedList = [...tournament];

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

    if (localStorage.getItem('admintoken')) {

      userIndexApi();
    } else {
      navigate('/')
    }
  }, []);
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL"
  };
  const columns = useMemo(
    () => [

      {
        name: 'Name',
        selector: row => row ? row.title : '',
        sortable: true,

      },
      {
        name: 'Room Name',
        selector: row => row.room ? row.room.title : '',
        sortable: true,

      },
      {
        name: 'Date',
        selector: row => row.detail ? moment(row.detail.startday).format(' DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {
        name: 'Limit of buy-in',
        selector: row => row.detail ? (parseInt(row.detail.buyin) + parseInt(row.detail.bounty))*(1+parseInt(row.detail.maxreentries)): '',
        sortable: true,

      },
      {
        name: 'Buy-in',
        selector: row => row.detail ? row.detail.buyin + '+' + row.detail.bounty + '+' + row.detail.rake : '',
        sortable: true,

      },
      {
        name: 'Players',
        selector: row => row.detail ? row.players.registered + row.detail.reservedplayers + '/' + row.detail.maxplayers : '',
        sortable: true,

      },
      {
        name: "Action",
        cell: (row) => <>
          <td>
            <Link className='action-link green-link mb-1' to={`/admin/editTournament/${row.slug}`}>Edit</Link>
            {/* <Link className='action-link green-link mb-1'>Edit Manager</Link> */}
            {/* to={`/admin/user/edit/${row.id}`} */}
            {
              row.status === 0
                ?
                <Link className='action-link blue-link mb-1' onClick={() => { updateTournamentStatus(row.id, 1) }}>Publish </Link>

                :

                <Link className='action-link blue-link mb-1' onClick={() => { updateTournamentStatus(row.id, 0) }}>Unpublish</Link>
            }

            <Link className='action-link pink-link mb-1'>Send email to RM</Link>
            <Link className='action-link red-link mb-1' onClick={() => { deletetournament(row.detail ? row.detail.tournament_id : '') }}>Delete</Link>
          </td>
        </>

      },
    ], [],
  );
  const handleInput = (e, max) => {
    setMax(max)
    setMin(e);

  }
  const handleSearch = () => {


    // var data = tournament.filter(row => { return row.detail && moment(row.detail.startday).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD') })

    // if (data.length === 0) {
    //   setFilteredList(tournament);
    // }
    // else {

    //   setFilteredList(data.filter(
    //     (element) => {
    //       return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
    //     }));
    // }
    var data = tournament.filter(row => {
      return row.detail && moment(startDate).format('DD.MM.YYYY') <= moment(row.detail.startday).format('DD.MM.YYYY')
        &&
        moment(endDate).format('DD.MM.YYYY') >= moment(row.detail.startday).format('DD.MM.YYYY')

    })


    if (data.length === 0) {
      setFilteredList(data.filter(
        (element) => {
          return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
        }));

    }
    else {


      setFilteredList(data.filter(
        (element) => {
          return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
        }));


    }



  }
  const deletetournament = async (tournamentid) => {
    setDeleteId(tournamentid)
    setdeleteModal(true)

  }
  const handleDeleteUser = async () => {

    try {
      let responseData = await AdminTournamentService.destroy(deleteId).json()
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
  const updateTournamentStatus = async (tounamanetid, status) => {
    var postData = {
      "id": tounamanetid,
      "status": status
    }
    try {
      let responseData = await AdminTournamentService.updatestatus(postData).json()
      if (responseData.status === true) {


        setisloading(true)
        userIndexApi();
      }


    }
    catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const handleRoom = async (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectData(oldArray => [...oldArray, e.target.value]);
      var updatedList = [...selectdata, e.target.value];

      let responseData = await User.roomids(updatedList).json()
      // console.log(e.target.value)
      setFilteredList(responseData.data)
    }
    else {
      setSelectData(current => [...selectdata.filter(val => val !== value)])
      var updatedList = [...selectdata.filter(val => val !== value)];

      let responseData = await User.roomids(updatedList).json()

      setFilteredList(responseData.data)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <h1 className="ms-2">All Tournaments</h1>
      </nav>
      <div className='wrapper my-profile-wrapper'>
        <Row className='my-5'>

          <Col md={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                {t('page.myprofile.myprofilenav.All tournaments.Tournaments')}
              </Card.Header>
              <Card.Body>
                <Form className="static">
                  <Row>

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
                          //showTimeSelect
                          //timeFormat="HH:mm"
                          injectTimes={[
                            setHours(setMinutes(new Date(), 1), 0),
                            setHours(setMinutes(new Date(), 5), 12),
                            setHours(setMinutes(new Date(), 59), 23),
                          ]}
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
                          //showTimeSelect
                          //timeFormat="HH:mm"
                          injectTimes={[
                            setHours(setMinutes(new Date(), 1), 0),
                            setHours(setMinutes(new Date(), 5), 12),
                            setHours(setMinutes(new Date(), 59), 23),
                          ]}
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
                  <Row>
                    <Col md={3}>

                      <Link className="btn btn-primary" role="button" to="/admin/addtournament">
                        {t('page.myprofile.myprofilenav.All tournaments.Addtournament')}
                      </Link>

                    </Col>

                    <Col md={12}>
                     
                      <Form.Group className="mb-2 aside-pokerroom mt-20" controlId="" >
                        <Form.Label>{t('page.tournaments.filter.Poker Room')}</Form.Label>
                        <div className='d-flex flex-wrap'>
                        <Form.Check className='me-3 mb-3' type="checkbox" label={t('page.tournaments.filter.All')} onChange={handleRoom} defaultChecked={false} value={'all'} />
                        {
                          RoomData.map((element) => {
                            return (
                              <Form.Check className='me-3 mb-3' type="checkbox" label={element.title} onChange={handleRoom} defaultChecked={false} value={element.id} />
                            )
                          })
                        }
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                </Form>
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
                  selectableRowsComponentProps={{ inkDisabled: true }}
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
          <Modal.Body>Are you sure you want to delete tournament?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setdeleteModal(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteUser()}>
              Delete
            </Button>
          </Modal.Footer>


        </>
      </Modal >
      <Modal show={deleteSuccess}>
        <Modal.Header>
          <Modal.Title>Deleted</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setisloading(true)
              userIndexApi();
              // setdeleteModal(false)
              setDeleteSuccess(false)
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