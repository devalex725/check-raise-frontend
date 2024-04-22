import './RoomTournamentTable.scss';

import React, {

  useState,
} from 'react';

import {
  Button,
  Col,
  Image,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import {
  Link,
  useNavigate,
} from 'react-router-dom';


const RoomTournamentsTable = () => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const navigate = useNavigate()

  const handleCloseRedirect = () => {
    setShow(false)
  }
 
  return (
    <>
      <div className="table-container d-none d-md-block">
        <Table responsive>
          <thead>
            <tr>
              <th className="width-auto text-center" style={{ width: '140px' }}>
                {t('page.tournaments.tournamentstable.Date')}
              </th>
              <th className="width-auto text-nowrap">
                {t('page.tournaments.tournamentstable.Tournament Name')}
              </th>
              <th className="width-auto text-center text-nowrap">
                {t('page.tournaments.tournamentstable.Poker Room')}
              </th>
              <th className="width-auto text-center d-md-none d-lg-table-cell">
                {t('page.tournaments.tournamentstable.Canton')}
              </th>
              <th className="width-auto text-nowrap">
                {t('page.tournaments.tournamentstable.Type')}
              </th>
              <th className="width-auto text-nowrap">
                {t('page.tournaments.tournamentstable.Buy-in')}
              </th>
              <th className="width-auto text-nowrap" colSpan={2}>
                {t('page.tournaments.tournamentstable.Players')}
              </th>
              <th className="width-auto text-nowrap" colSpan={2}>
                {t('page.tournamentsdetails.Registration')}
              </th>
            </tr>
          </thead>
          <tbody>
            
                <tr>
                  <td className="align-middle">
                    <p className="tournament-date text-nowrap">
                      Th 01.06.2023 19:00
                     
                     
                    </p>
                    <p className="tournament-late-reg text-nowrap">
                    Late Reg:19:00
                     
                
                    </p>
                  </td>
                  <td className="align-middle">
                  
                    <Link to={`/tournaments-details/`}>
                      <b>#Sit&go – NLH – PRC</b>
                    </Link>
                  </td>
                  <td className="align-middle">
                    <Link
                      to="/room"
                      className="align-middle text-truncate w-100 room-logo"
                    >
                      <Image
                        src={""}
                        
                        fluid
                      />
                    </Link>
                  </td>
                  <td className="text-center align-middle d-md-none d-lg-table-cell">
                    <span>
                    NE
                    </span>
                  </td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-center definition-of-games-flex">
                      
                        <span className="dealers defination-games-info-span">
                          D
                        </span>
                     

                    
                        <span className="re-entry defination-games-info-span">
                          R
                        </span>
                    
                     
                          <span className="bounty  defination-games-info-span">
                            B
                          </span>
                       
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    
                   110+40
                  </td>
                  <td className="align-middle" style={{ width: '90px' }}>
                    
                  <span className="players-progress players-progress--success">
                    <span className="players-current">
                     6
                    </span>
                    /
                    <span className="players-total">
                     2
                    </span>
                  </span>



                  </td>

                  <td className="align-middle">
                    <Link to="#" 
                    onClick={handleShow} 
                   >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-people-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                      </svg>
                    </Link>
                  </td>
                  <td>
                    <Button className="btn btn-primary"  onClick={()=>navigate('/login')}>
                      {' '}
                      Login to register
                    </Button>
                  </td>
                </tr>
            
          </tbody>
        </Table>
      </div>

      {/* <div className="table-tournaments-mobile d-block d-md-none">
        <div className="tournament-row">
          <div className="d-flex justify-content-between">
            <div className="tm-title d-flex justify-content-start text-truncate">
              <Link to="/tournaments-details" className="text-truncate min-w-1">
                King Of Freezeout
              </Link>
            </div>
            <div className="tm-players">
              <span className="players-progress players-progress--warning text-center w-100">
                <span className="players-current">39</span>/
                <span className="players-total">54</span>
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="tm-middle">
              <div className="tm-date">Do 01.06.2023</div>
              <div className="tm-time">19:00</div>
              <p className="tm-late-reg text-nowrap">Late Reg: Round 12</p>
            </div>
            <div className="d-flex justify-content-between flex-column">
              <div className="tm-action">
                <div>
                  <span className="d-inline-block text-end">
                    Registrierung für Manager nicht erlaubt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between negative-magin-row">
            <div className="tm-room-image d-flex justify-content-start ">
              <Link to="/room" className="text-truncate min-w-1">
                <Image src={require('../../assets/images/ap-3.png')} fluid />
              </Link>
            </div>
            <span className="tm-type type-column d-block text-end">
              <span className="tm-type d-block">Buy-in: 150+35</span>
              <span className="dealers defination-games-info-span">D</span>
            </span>
          </div>

          <div className="tm-details">
            <span className="down-arrow" onClick={handleShow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              </svg>
            </span>
          </div>
        </div>

        <div className="tournament-row">
          <div className="d-flex justify-content-between">
            <div className="tm-title d-flex justify-content-start text-truncate">
              <Link to="/tournaments-details" className="text-truncate min-w-1">
                King Of Freezeout
              </Link>
            </div>
            <div className="tm-players">
              <span className="players-progress players-progress--warning text-center w-100">
                <span className="players-current">39</span>/
                <span className="players-total">54</span>
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="tm-middle">
              <div className="tm-date">Do 01.06.2023</div>
              <div className="tm-time">19:00</div>
              <p className="tm-late-reg text-nowrap">Late Reg: Round 12</p>
            </div>
            <div className="d-flex justify-content-between flex-column">
              <div className="tm-action">
                <div>
                  <span className="d-inline-block text-end">
                    Registrierung für Manager nicht erlaubt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between negative-magin-row">
            <div className="tm-room-image d-flex justify-content-start ">
              <Link to="/room" className="text-truncate min-w-1">
                <Image src={require('../../assets/images/ap-3.png')} fluid />
              </Link>
            </div>
            <span className="tm-type type-column d-block text-end">
              <span className="tm-type d-block">Buy-in: 150+35</span>
              <span className="dealers defination-games-info-span">D</span>
            </span>
          </div>

          <div className="tm-details">
            <span className="down-arrow" onClick={handleShow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              </svg>
            </span>
          </div>
        </div>

        <div className="tournament-row">
          <div className="d-flex justify-content-between">
            <div className="tm-title d-flex justify-content-start text-truncate">
              <Link to="/tournaments-details" className="text-truncate min-w-1">
                Super Deep Stack 150K bounty Re-e
              </Link>
            </div>
            <div className="tm-players">
              <span className="players-progress players-progress--success text-center w-100">
                <span className="players-current">39</span>/
                <span className="players-total">54</span>
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="tm-middle">
              <div className="tm-date">Do 01.06.2023</div>
              <div className="tm-time">19:00</div>
              <p className="tm-late-reg text-nowrap">Late Reg: Round 12</p>
            </div>
            <div className="d-flex justify-content-between flex-column">
              <div className="tm-action">
                <div>
                  <span className="d-inline-block text-end">
                    Registrierung für Manager nicht erlaubt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between negative-magin-row">
            <div className="tm-room-image d-flex justify-content-start ">
              <Link to="/room" className="text-truncate min-w-1">
                <Image
                  src={require('../../assets/images/fj-1-150x134.png')}
                  fluid
                />
              </Link>
            </div>
            <span className="tm-type type-column d-block text-end">
              <span className="tm-type d-block">Buy-in: 150+50+40</span>
              <span className="bounty defination-games-info-span">B</span>
              <span className="dealers defination-games-info-span">D</span>
            </span>
          </div>

          <div className="tm-details">
            <span className="down-arrow" onClick={handleShow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div> */}

      <div className="d-flex align-items-center tournaments-top justify-content-md-end">
        <Col md={6}>
          <div className="defination-of-games">
            <div className="defination-of-games-info">
              <div className="defination-games-info">
                <ul className="p-0 list-unstyled d-flex">
                  <li>
                    <span className="dealers">D</span>Dealers
                  </li>
                  <li>
                    <span className="re-entry">R</span>Re-entry
                  </li>
                  <li>
                    <span className="bounty">B</span>Bounty
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </div>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="tournament-description-wrap">
            <Row className="flex-column-reverse flex-md-row">
              <Col md={12} lg={5}>
                <div className="players-Template-wrap">
                  <h3>
                    {t(
                      'page.tournaments.tournamentstable.Playersmodal.Players',
                    )}
                  </h3>
                  <div className="d-flex structure-top-wrap align-items-center flex-wrap justify-content-between">
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          'page.tournaments.tournamentstable.Playersmodal.Players',
                        )}
                        :{' '}
                      </span>
                      <span className="structure-block-val d-block">1/10</span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          'page.tournaments.tournamentstable.Playersmodal.Waiting List',
                        )}
                      </span>
                      <span className="structure-block-val d-block">(0)</span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          'page.tournaments.tournamentstable.Playersmodal.Anonymous Players',
                        )}
                      </span>
                      <span className="structure-block-val d-block">0</span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          'page.tournaments.tournamentstable.Playersmodal.Reserved places',
                        )}
                      </span>
                      <span className="structure-block-val d-block">0</span>
                    </span>
                  </div>
                </div>
              </Col>
             
            </Row>
            <Row>
              
              <Col className="text-center mt-3">
                <Link
                  onClick={handleCloseRedirect}
                  to={`/tournaments-details`}
                  // to="/tournaments-details"
                  className="btn btn-primary load-more-btn"
                >
                  <b>
                    {t(
                      'page.tournaments.tournamentstable.Playersmodal.More infos',
                    )}
                  </b>
                </Link>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="mb-50 d-block d-md-none text-end">
          <Link onClick={handleClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9692 0L20 1.03084L1.03076 20L0 18.9699L18.9692 0Z"
                fill="#F7F5F5"
              ></path>
              <path
                d="M1.03076 0L20 18.9685L18.9692 20L0 1.03153L1.03076 0Z"
                fill="#F7F5F5"
              ></path>
            </svg>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RoomTournamentsTable
