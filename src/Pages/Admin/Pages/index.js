import "./index.scss";

import React, { useEffect, useState } from "react";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import { Image, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TournamentService from "../../../api/services/TournamentService";

const Dashboard = () => {
  const [isActive, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);
  const toggleClass = () => {
    setActive(!isActive);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      setIsLoading(false);
      getTournaments();
    } else {
      navigate("/");
    }
  }, [navigate]);
  const getTournaments = async () => {
    try {
      let responseData = await TournamentService.index().json();
      setDashboardData(responseData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
    }
  };

  function getProgress(registeredPlayers, totalPlayers) {
    let className = "success";
    let playersProgress = registeredPlayers / totalPlayers;
    if (playersProgress <= 0.6) className = "success";
    else if (playersProgress < 1) {
      className = "warning";
    } else {
      className = "error";
    }
    return "players-progress players-progress--" + className;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars}/>
        </Link>
        <h1 className="ms-2">Pages List</h1>
      </nav>
      <div className="table-container d-none d-md-block">
        <Table responsive>
          <thead>
          <tr>
            <th className="width-auto text-center" style={{ width: "140px" }}>
              No.
            </th>
            <th className="width-auto text-nowrap">Page Name</th>

            <th className="width-auto text-nowrap" colSpan={2}>
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>1.</td>
            <td>Notifications</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/notification"
              >
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Subscription</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/subscription"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>RM Advertising</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/rm-advertising"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>4.</td>
            <td>Info</td>
            <td>
              <Link className="action-link green-link mb-1" to="/admin/pages/info">
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>5.</td>
            <td>Discount</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/discount"
              >
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>6.</td>
            <td>Transaction</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/transaction"
              >
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>7.</td>
            <td>Terms and conditions</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/terms"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>8.</td>
            <td>Privacy policy</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/privacy-policy"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>9.</td>
            <td>Public Advertising</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/advertising"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>10.</td>
            <td>Banners</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/banners"
              >
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>11.</td>
            <td>Premium Tournaments</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/premium-tournaments"
              >
                View
              </Link>
            </td>
          </tr>
          <tr>
            <td>12.</td>
            <td>Cookie Consent</td>
            <td>
              <Link
                className="action-link green-link mb-1"
                to="/admin/pages/cookie-consent"
              >
                Edit
              </Link>
            </td>
          </tr>
          </tbody>
        </Table>
      </div>
      <div className="table-tournaments-mobile d-block d-md-none">
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
                <Image src={require("../../../assets/images/ap-3.png")} fluid/>
              </Link>
            </div>
            <span className="tm-type type-column d-block text-end">
              <span className="tm-type d-block">Buy-in: 150+35</span>
              <span className="dealers defination-games-info-span">D</span>
            </span>
          </div>

          <div className="tm-details">
            <span className="down-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
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
                <Image src={require("../../../assets/images/ap-3.png")} fluid/>
              </Link>
            </div>
            <span className="tm-type type-column d-block text-end">
              <span className="tm-type d-block">Buy-in: 150+35</span>
              <span className="dealers defination-games-info-span">D</span>
            </span>
          </div>

          <div className="tm-details">
            <span className="down-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
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
                  src={require("../../../assets/images/fj-1-150x134.png")}
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
            <span className="down-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      {isLoading && <LogoAnimationLoader/>}
    </>
  );
};

export default Dashboard;
