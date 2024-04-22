import React, { useState, useEffect, useRef, useCallback } from "react";
import MyProfileLeftNavManager from "../../../../components/MyProfileLeftNav/MyProfileLeftNavManager";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { downloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import "./CheckInTournament.scss";
import Select from "react-select";
import InputPhoneComponent from "../../../../components/InputPhone/InputPhone";
import LogoAnimationLoader from "../../../../components/Loading/LogoAnimationLoader";
import "react-datepicker/dist/react-datepicker.css";
import RoomService from "../../../../api/services/RoomService";
import MyPlayerService from "../../../../api/services/MyPlayerService";
import TournamentService from "../../../../api/services/TournamentService";
import Moment from "moment";
import DataTable from "react-data-table-component";
import moment from "moment";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import PlayerCountInput from "./PlayerCountInput";
import ExportModal from "../components/ExportModal";
import { formatPhoneNumber } from "../../../../utils";
import SendEmailModal from "../../../../components/Manager/SendEmailModal";

const isMobile = window.innerWidth <= 768;

const CheckInTournament = () => {
  Moment.locale("en");
  const params = useParams();
  const inputRef = useRef({});
  const navigate = useNavigate();
  const handleannounceclose = () => setShowannounce(false);
  const { t, i18n } = useTranslation();
  const [exportModalShow, setExportModalShow] = useState(false);
  const [exportmodelshow, setExportModelShow] = useState(false);
  const [isLoading, setisloading] = useState(true);
  const [Modalshow, setModelShow] = useState(false);
  const [exportData, SetExportData] = useState([]);
  const [announceLateTime, setannounceLateTime] = useState("");
  const [maxNumberPlayerCount, setMaxNumberPlayerCount] = useState(0);
  const [reservedPlayerCount, setReservedPlayerCount] = useState(0);
  const [registeredPlayerCount, setRegisteredPlayerCount] = useState(0);
  const [waitingPlayerCount, setWaitingPlayerCount] = useState(0);
  const [currentroommemeberid, setCurrentroommemeberid] = useState(0);
  const [currentroomid, setCurrentroomid] = useState(0);
  const [currentuserid, setCurrentuserid] = useState(0);
  const [currentmemberdate, setCurrentmemberdate] = useState(new Date());
  const [currentmemberdateDay, setCurrentmemberdateDay] = useState();
  const [currentmemberdateMonth, setCurrentmemberdateMonth] = useState();
  const [currentmemberdateYear, setCurrentmemberdateyear] = useState();
  const [currentPlayerID, setCurrentPlayerID] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const togglePasswordReVisiblity = () => {
    setPasswordReShown(passwordReShown ? false : true);
  };
  const [formRefSt, setFormRefst] = useState("");
  const [isCustomdate, setCutomdate] = useState(false);
  const [sendEmailModalShow, setSendEmailModalShow] = useState(false);
  const [modalmessage, setModalMessage] = useState("");
  const [modalData, setModalData] = useState("");
  const [error, setError] = useState();
  const [openshow, setOpenshow] = useState(false);
  const [checkinmodal, setCheckinmodal] = useState(false);
  const [memebershipmodal, setMemebershipmodal] = useState(false);
  const [tournamentId, setTournamentId] = useState(0);
  const [latePlayer, setlatePlayer] = useState(0);
  const [RegisterPlayerList, setRegisterPlayerList] = useState([]);
  const [TournamentData, setTournamentData] = useState({});
  const [show, setShow] = useState(false);
  const [modalPlayer, setModalPlayer] = useState(false);
  const eye = <FontAwesomeIcon icon={faEye}/>;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash}/>;
  const [RegisterPlayerData, setRegisterPlayerData] = useState([]);
  const [filteredList, setFilteredList] = new useState([]);
  const [filterWaitingList, setFilteredWaitingList] = new useState([]);
  const [WaitingPlayerData, setWaitingPlayerData] = useState([]);
  const [RegistrationLog, setRegistrationLog] = useState([]);
  const [FilterRegistrationLog, setFilterRegistrationLog] = new useState([]);
  const [checkInDetail, setcheckInDetail] = useState([]);
  const [language, setLanguage] = useState("");
  const [profineName, setProfileName] = useState("");
  const [pokerCity, setPokerCity] = useState("");
  const [phonecode, setPhonecode] = useState("");
  const [phonecountry, setPhonecountry] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [phonenumber, setPhonenumber] = useState("");
  const [announce, setannounce] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showannounce, setShowannounce] = useState(false);
  const [hideMembership, setHideMembership] = React.useState(false);
  const [hideLateArrival, setHideLateArrival] = React.useState(false);
  const [ExporttourTournamentshow, setExporttournamentshow] = useState(false);
  const [ExporttourTournament, setExporttournament] = useState([]);
  const [ExportWaitingList, setExportWaitingList] = useState([]);
  const [exportmodelshow1, setExportModelShow1] = useState(false);
  const [infoStatistics, setInfoStatistics] = useState(null);
  const [playerInfoModalShow, setPlayerInfoModalShow] = useState(false);
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false);
  const [liveStatistics, setLiveStatistics] = useState({
    prizePool: 0,
    bounties: 0,
    rakes: 0,
    checkedInPlayersWithBonus: 0,
    playersWithBonus: 0,
    announcedPlayers: 0,
  });

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const setFormRef = (formRef) => {
    setFormRefst(formRef);
  };
  const [passwordReShown, setPasswordReShown] = useState(false);
  const options = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
  ];
  const profileNameOption = [
    { value: "public_nic", label: "Name Surname" },
    { value: "private", label: "Nickname (If applicable)" },
    { value: "anonymous", label: "Anonymous" },
  ];
  const handleannounceSubmit = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        palyer_id: latePlayer,
        tournament_id: tournamentId,
        latetime: event.target.timing.value,
      };
      let responseData = await TournamentService.latearrival(userData).json();
      if (responseData.status === true) {
        setShowannounce(false);
        setSaveMessage(responseData.message);
        setannounce(true);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleShowExportModal = () => {
    setExportModalShow(true);
  };
  const handleMembershipSubmit = async (event) => {
    const membershipDate = event.target.membershipdate.value;
    let expiry = "";

    switch (membershipDate) {
      case "custom":
        expiry = event.target.custom_date.value;
        break;
      case "reset":
        expiry = null;
        break;
      default:
        expiry = event.target.membershipdate.value;
        break;
    }

    event.preventDefault();

    if (membershipDate !== "reset" && !expiry) {
      setError("Invalid date.");
      return;
    }

    try {
      const userData = {
        id: currentroommemeberid,
        room_id: currentroomid,
        user_id: currentuserid,
        expiry: expiry,
      };
      const responseData = await TournamentService.updateexpiry(
        userData,
      ).json();

      setMemebershipmodal(false);
      if (responseData.status === true) {
        setSaveMessage(responseData.message);
        setannounce(true);
      }
    } catch (error) {
      setMemebershipmodal(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleannounce = (id) => {
    setTournamentId(params.id);
    setlatePlayer(id);
    setShowannounce(true);
  };
  const handleannounceEdit = (id, data) => {
    setannounceLateTime(data);
    setTournamentId(params.id);
    setlatePlayer(id);
    setShowannounce(true);
  };
  const handleAnnounceDelete = async (id, playerid) => {
    try {
      let responseData = await TournamentService.latearrivalremove(
        id,
        playerid,
      ).json();
      setShowannounce(false);
      setSaveMessage(responseData.message);
      setannounce(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleLanguage = (e) => {
    setLanguage(e);
  };
  const handleProfileOption = (e) => {
    setProfileName(e);
  };
  const handleZipcodeChange = async (event) => {
    event.preventDefault();
    var code = event.target.value;
    try {
      const res = await RoomService.getCity(code).json();

      setPokerCity(res.data.city);
    } catch (error) {
      setPokerCity("");

      // if (error.name === "HTTPError") {
      //   const errorJson = await error.response.json();
      //   setError(errorJson.message);
      // }
    }
  };

  function handleOnChange(value, data) {
    if (!value) {
      setPhonecountry("");
      setPhonecode("");
      setPhonenumber("");
      return;
    }
    setPhonecountry(data?.countryCode || "");
    setPhonecode(data?.dialCode || "");
    setPhonenumber(value.slice(data?.dialCode?.length));
  }

  const handleSelect = useCallback(
    _.debounce(async (keyword) => {
      {
        if (!keyword) return;
        try {
          const listArray = [];
          const responseData = await TournamentService.getRegisterPlayer(
            keyword,
            params.id,
          ).json();

          responseData.data.map((element) => {
            return listArray.push({ label: element.name, value: element.id });
          });

          setRegisterPlayerList(listArray);
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();

            setError(errorJson.message);
          }
        }
      }
    }, 500),
    [],
  );

  const handleSelectChange = async (data) => {
    if (data.value) {
      var postData = {
        id: params.id,
        user_id: data.value,
      };
      try {
        let responseData = await TournamentService.RegisterPlayerById(
          postData,
        ).json();
        if (responseData.status === true) {
          getCheckInDataByTournamnetID();
        }
        setisloading(false);
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(errorJson.message);
        }
      }
    }
  };
  const handleDownloadExcel = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = filteredList.map((row) =>
      newdata.map((nw, i) => [
        nw === "Name" ? row.firstname : "",
        nw === "Surname" ? row.lastname : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "ZipCode" ? row.zipcode : "",
        nw === "City" ? row.city : "",
        nw === "Registrations with check-in" ? row.with : "",
        nw === "Registrations without check-in" ? row.without : "",
        nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : "",
        nw === "Cumulated rakes" ? row.rakes : "",
      ]),
    );

    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerStatistics",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
  };
  const getCheckInDataByTournamnetID = async () => {
    try {
      let responseData = await TournamentService.checkInTournament(
        params.id,
      ).json();

      setTournamentData(responseData.data);
      setcheckInDetail(responseData.data.detail);
      if (responseData.data.is_membership === 0) {
        setHideMembership(true);
      } else {
        setHideMembership(false);
      }
      if (responseData.data.is_late_arrival === 0) {
        setHideLateArrival(true);
      } else {
        setHideLateArrival(false);
      }

      const _registerPlayerData = (responseData.data.registered.data || []).map(
        (item, index) => ({
          ...item,
          position: index + 1,
        }),
      );
      const _waitingPlayerData = (responseData.data.waiting.data || []).map(
        (item, index) => ({
          ...item,
          position: index + 1,
        }),
      );

      setRegisterPlayerData(_registerPlayerData);
      setWaitingPlayerData(_waitingPlayerData);
      setRegisteredPlayerCount(responseData.data.registered.total);
      setWaitingPlayerCount(responseData.data.waiting.total);

      let _filteredList = _registerPlayerData;
      let _filteredWaitingList = _waitingPlayerData;

      if (showOnlyUnchecked) {
        _filteredList = _filteredList.filter((item) => !item.ischeckedin);

        _filteredWaitingList = _filteredWaitingList.filter(
          (item) => !item.ischeckedin,
        );
      }

      setFilteredList(_filteredList);
      setFilteredWaitingList(_filteredWaitingList);

      setRegistrationLog(responseData.data.log.data);
      setFilterRegistrationLog(responseData.data.log.data);
      setMaxNumberPlayerCount(responseData.data.detail.maxplayers);

      setReservedPlayerCount(responseData.data.detail.reservedplayers);

      updateLiveStatistics(_registerPlayerData, _waitingPlayerData);
      setisloading(false);
    } catch (error) {
      setisloading(false);
    }
  };

  const updateLiveStatistics = (_registeredPlayers, _waitingPlayers) => {
    const players = _registeredPlayers.concat(_waitingPlayers);
    const tournament = players[0].tournaments;

    let prizePool = 0;
    let bounties = 0;
    let rakes = 0;
    let checkedInPlayersWithBonus = 0;
    let playersWithBonus = 0;
    let announcedPlayers = 0;

    let checkedInPlayers = 0;
    let reEntries = 0;

    players.map((player) => {
      if (player.ischeckedin) {
        checkedInPlayers++;
      }
      reEntries += player.reentries;

      // players with bonus
      if (Moment(player.created) < Moment(player.tournaments.bounusdeadline)) {
        playersWithBonus++;

        if (player.ischeckedin) {
          checkedInPlayersWithBonus++;
        }
      }
      // announced players
      if (player.lateannouncement && !player.ischeckedin) {
        announcedPlayers++;
      }
    });

    prizePool = tournament.buyin * (checkedInPlayers + reEntries);
    bounties = tournament.bounty * (checkedInPlayers + reEntries);
    rakes =
      tournament.rake * checkedInPlayers +
      reEntries * (tournament.reentriesrake || 0);

    setLiveStatistics((prev) => ({
      ...prev,
      prizePool,
      bounties,
      rakes,
      checkedInPlayersWithBonus,
      playersWithBonus,
      announcedPlayers,
    }));
  };

  const handleClickIdCheck = async (userId) => {
    const roomId = TournamentData.room.id;
    if (!userId || !roomId) return;

    const postData = {
      room_id: roomId,
      user_id: userId,
    };

    try {
      const responseData = await TournamentService.updateIdCheck(
        postData,
      ).json();
      if (responseData.status === true) {
        getCheckInDataByTournamnetID();
      }
      setisloading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const cancleRegistration = async (id) => {
    if (id) {
      var postData = {
        id: params.id,
        user_id: id,
      };
      try {
        let responseData = await TournamentService.cancleRegistrationById(
          postData,
        ).json();
        if (responseData.status === true) {
          getCheckInDataByTournamnetID();
        }
        setisloading(false);
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(errorJson.message);
        }
      }
    }
  };
  const checkInById = async (id) => {
    if (id) {
      var postData = {
        id: params.id,
        user_id: id,
      };
      try {
        let responseData = await TournamentService.checkInById(postData).json();
        if (responseData.status === true) {
          getCheckInDataByTournamnetID();
        }
        setisloading(false);
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(errorJson.message);
        }
      }
    }
  };
  const CancleCheckInById = async (id) => {
    if (id) {
      var postData = {
        id: params.id,
        user_id: id,
      };
      try {
        let responseData = await TournamentService.CancleCheckInById(
          postData,
        ).json();
        if (responseData.status === true) {
          getCheckInDataByTournamnetID();
        }
        setisloading(false);
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(errorJson.message);
        }
      }
    }
  };

  const plusReBuyById = async (id, reentries) => {
    if (id) {
      if (checkInDetail.maxreentries <= reentries) {
        setCurrentPlayerID(id);
        setShow(true);
      } else {
        var postData = {
          id: params.id,
          user_id: id,
        };
        try {
          let responseData = await TournamentService.plusReBuyById(
            postData,
          ).json();
          if (responseData.status === true) {
            getCheckInDataByTournamnetID();
          }
          setisloading(false);
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();

            setError(errorJson.message);
          }
        }
      }
    }
  };
  const minusReBuyById = async (id) => {
    if (id) {
      var postData = {
        id: params.id,
        user_id: id,
      };
      try {
        let responseData = await TournamentService.minusReBuyById(
          postData,
        ).json();
        if (responseData.status === true) {
          getCheckInDataByTournamnetID();
        }
        setisloading(false);
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(errorJson.message);
        }
      }
    }
  };

  const plusReBuyModalTrue = async () => {
    var postData = {
      id: params.id,
      user_id: currentPlayerID,
    };
    try {
      let responseData = await TournamentService.plusReBuyById(postData).json();
      if (responseData.status === true) {
        getCheckInDataByTournamnetID();
      }
      setisloading(false);
      setShow(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
      setShow(false);
    }
  };

  const handleFreeze = async () => {
    try {
      var userData = {
        id: params.id,
        status: TournamentData.is_freeze == 0 ? 1 : 0,
      };

      const responseData = await TournamentService.updatefreezestatus(
        userData,
      ).json();

      if (responseData.status === true) getCheckInDataByTournamnetID();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
      setisloading(false);
    }
  };
  const plusReBuyModalFalse = async () => {
    setCurrentPlayerID(0);
    setShow(false);
  };

  const handleChangeMaxPlayerCount = (newVal) => {
    // if no free places
    if (newVal < reservedPlayerCount || newVal < 0) {
      // to reset input value when it was same with reservedPlayerCount
      setMaxNumberPlayerCount(newVal);
      setTimeout(() => {
        setMaxNumberPlayerCount(reservedPlayerCount);

        setTimeout(() => {
          updateMaxPlayerCount(reservedPlayerCount);
        });
      });
      return;
    }

    setMaxNumberPlayerCount(newVal);
    setTimeout(() => {
      updateMaxPlayerCount(newVal);
    });
  };

  const updateMaxPlayerCount = async (maxplayers) => {
    setisloading(true);
    const postData = {
      tournament_id: params.id,
      maxplayers,
      reservedplayers: reservedPlayerCount,
    };
    // when tournament is frozen,
    // increasing max player don't effect on WL.
    // free places are replaced by reserved places
    if (TournamentData.is_freeze === 1 && maxplayers > maxNumberPlayerCount) {
      postData.reservedplayers += maxplayers - maxNumberPlayerCount;
    }

    try {
      const responseData = await TournamentService.updateMax_res_player(
        postData,
      ).json();

      setisloading(false);

      if (responseData.status === true) {
        getCheckInDataByTournamnetID();
      }
    } catch (error) {
      setisloading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleChangeReservedPlayerCount = (newVal) => {
    const freePlaces =
      maxNumberPlayerCount - (registeredPlayerCount + waitingPlayerCount);
    // if no free places
    if (newVal > freePlaces || newVal < 0) {
      // to reset input value when it was same with freePlaces
      setReservedPlayerCount(newVal);
      setTimeout(() => {
        setReservedPlayerCount(freePlaces);

        setTimeout(() => {
          updateReservedPlayerMax(freePlaces);
        });
      });
      return;
    }

    setReservedPlayerCount(newVal);
    setTimeout(() => {
      updateReservedPlayerMax(newVal);
    });
  };

  const updateReservedPlayerMax = async (reservedplayers) => {
    setisloading(true);
    const postData = {
      tournament_id: params.id,
      maxplayers: maxNumberPlayerCount,
      reservedplayers,
    };
    try {
      const responseData = await TournamentService.updateMax_res_player(
        postData,
      ).json();
      setisloading(false);

      if (responseData.status === true) {
        getCheckInDataByTournamnetID();
      }
    } catch (error) {
      setisloading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleLateArrival = () => {
    getCheckInDataByTournamnetID();
    setannounce(false);
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getCheckInDataByTournamnetID();
    } else {
      navigate("/");
    }
  }, []);

  // fixed header of table
  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const headerElem = document.querySelector(
      ".registered-player-table .rdt_TableHead",
    );
    const logTitleElem = document.querySelector(".log-title");
    if (!headerElem || !logTitleElem) return;

    const headerBoundingRect = headerElem.getBoundingClientRect();
    const logTitleBoundingRect = logTitleElem.getBoundingClientRect();

    let headerTop = 340;
    let logTitleTop = 375;
    let scrollY = 50;

    if (
      (headerBoundingRect.top < headerTop + 10 ||
        (logTitleBoundingRect.top > logTitleTop &&
          logTitleBoundingRect.top < logTitleTop + 20)) &&
      headerElem.style.position !== "fixed"
    ) {
      headerElem.style.position = "fixed";
      headerElem.style.top = "310px";
      headerElem.style.left = "0";
      headerElem.style.right = "0";
      headerElem.style.width = "auto";
      headerElem.style.zIndex = "999";
      headerElem.style.maxWidth = "1400px";
      headerElem.style.marginInline = "auto";
      headerElem.style.paddingInline =
        window.innerWidth < 1440 ? "32px" : "16px";
    }

    if (
      (window.scrollY < scrollY || logTitleBoundingRect.top < logTitleTop) &&
      headerElem.style.position === "fixed"
    ) {
      headerElem.style.position = "static";
      headerElem.style.marginInline = "0";
      headerElem.style.paddingInline = "0";
    }
  };

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        fontSize: "16px",
        padding: "0.75rem",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
      },
    },
  };
  const customStyles1 = {
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        fontSize: "16px",
        padding: "0.75rem",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
      },
    },
  };
  const paginationComponentOptions = {
    rowsPerPageText: "Showing",
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const handleCustomdate = (event) => {
    setCutomdate(false);
    if (event.target.value == "custom") {
      setCutomdate(true);
    }
  };
  const handleMembership = (id, date, room_id, user_id) => {
    setCutomdate(false);
    setCurrentroomid(room_id);
    setCurrentuserid(user_id);
    setCurrentroommemeberid(id);
    if (date && date != "-") {
      const date1 = date;
      var day = new Date(date1).getDate() - 1;
      var month = new Date(date1).getMonth() + 1;
      var year = new Date(date1).getFullYear() + 1;
      setCurrentmemberdate(day + "." + month + "." + year);
      setCurrentmemberdateDay(day);
      setCurrentmemberdateMonth(month);
      setCurrentmemberdateyear(year);
    } else {
      const date = new Date();
      var day = new Date(date).getDate() - 1;
      var month = new Date(date).getMonth() + 1;
      var year = new Date(date).getFullYear() + 1;
      setCurrentmemberdate(day + "." + month + "." + year);

      setCurrentmemberdateDay(day);
      setCurrentmemberdateMonth(month);
      setCurrentmemberdateyear(year);
    }

    setError("");
    setMemebershipmodal(true);
  };

  const handlePDFTournament = () => {
    const doc = new jsPDF();
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = exporttournament.map((c) => c.label);
    }

    const tableData = ExporttourTournament.map((row) => [
      row.firstname + row.lastname,
      row.email,
      row.street + formatPhoneNumber(row.phonecode, row.phonenumber),
      row.nickname,
      row.dob,
      row.zipcode,
    ]);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
    doc.save("player-statistics.pdf");
  };
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    setSelectedColumns(updatedColumns);
  };
  const componentRef = useRef();
  const componentRef1 = useRef();
  const handlePrint1 = useReactToPrint({
    content: () => componentRef1.current,
  });
  const handlePrintTournament = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleExport = async (e) => {
    setExporttournamentshow(true);
    let responseData = await TournamentService.checkInTournament(
      params.id,
    ).json();

    setExporttournament(responseData.data.registered.data);
  };
  const handleExport1 = async (e) => {
    setExportModelShow1(true);
    let responseData = await TournamentService.checkInTournament(
      params.id,
    ).json();

    setExportWaitingList(responseData.data.waiting.data);
  };

  const exporttournament = [
    { label: "Name", key: "firstname" },
    { label: "Surename", key: "surnamename" },
    { label: "Nickname", key: "nickname" },
    { label: "Phone Number", key: "phonenumber" },
    { label: "Without Check-in", key: "without" },
    { label: "Membership", key: "membership" },
    { label: "Registration Date", key: "created" },
  ];
  const headers = [
    { label: "Name", key: "firstname" },
    { label: "Surname", key: "Surname" },
    { label: "Nickname", key: "nickname" },
    { label: "Phone Number", key: "phonenumber" },
    { label: "Without Check-in", key: "without" },
    { label: "Membership", key: "membership" },
    { label: "Registration Date", key: "created" },
  ];
  const csvTournament = [
    selectedColumns,
    ...ExporttourTournament.map((row) => [
      ...selectedColumns.map((nw, i) => {
        return [
          nw === "Full Name" ? row.firstname + row.lastname : "",
          nw === "E-Mail Address" ? row.email : "",
          nw === "Without Check-in" ? row.without : "",
          nw === "Phone Number"
            ? formatPhoneNumber(row.phonecode, row.phonenumber)
            : "",
          nw === "Nickname" ? row.nickname : "",
          nw === "Membership"
            ? Moment(row.membership).format("DD.MM.YYYY")
            : "",
        ];
      }),
    ]),
  ];
  const csvData = [
    selectedColumns,
    ...ExporttourTournament.map((row) => [
      ...selectedColumns.map((nw, i) => {
        return [
          nw === "Full Name" ? row.firstname + row.lastname : "",
          nw === "E-Mail Address" ? row.email : "",
          nw === "Without Check-in" ? row.without : "",
          nw === "Phone Number"
            ? formatPhoneNumber(row.phonecode, row.phonenumber)
            : "",
          nw === "Nickname" ? row.nickname : "",
          nw === "Membership"
            ? Moment(row.membership).format("DD.MM.YYYY")
            : "",
        ];
      }),
    ]),
  ];
  const csvData1 = [
    selectedColumns,
    ...ExportWaitingList.map((row) => [
      ...selectedColumns.map((nw, i) => {
        return [
          nw === "Full Name" ? row.firstname + row.lastname : "",
          nw === "E-Mail Address" ? row.email : "",
          nw === "Without Check-in" ? row.without : "",
          nw === "Phone Number"
            ? formatPhoneNumber(row.phonecode, row.phonenumber)
            : "",
          nw === "Nickname" ? row.nickname : "",
          nw === "Membership"
            ? Moment(row.membership).format("DD.MM.YYYY")
            : "",
        ];
      }),
    ]),
  ];

  const exportToPDF1 = () => {
    const doc = new jsPDF();
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = ExportWaitingList.map((row) =>
      newdata.map((nw, i) => [
        nw === "Full Name" ? row.firstname + row.lastname : "",
        nw === "E-Mail Address" ? row.email : "",
        nw === "Without Check-in" ? row.without : "",
        nw === "Phone Number"
          ? formatPhoneNumber(row.phonecode, row.phonenumber)
          : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "Membership" ? Moment(row.membership).format("DD.MM.YYYY") : "",
      ]),
    );
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
    doc.save("player-statistics.pdf");
  };
  const handleTournamentExcel = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = exporttournament.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = ExporttourTournament.map((row) =>
      newdata.map((nw, i) => [
        nw === "Full Name" ? row.firstname + row.lastname : "",
        nw === "E-Mail Address" ? row.email : "",
        nw === "Without Check-in" ? row.without : "",
        nw === "Phone Number"
          ? formatPhoneNumber(row.phonecode, row.phonenumber)
          : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "Membership" ? Moment(row.membership).format("DD.MM.YYYY") : "",
      ]),
    );

    downloadExcel({
      fileName: "Check-Raise",
      sheet: "Register Player",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
  };
  const handleDownloadExcel1 = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = ExportWaitingList.map((row) =>
      newdata.map((nw, i) => [
        nw === "Full Name" ? row.firstname + row.lastname : "",
        nw === "E-Mail Address" ? row.email : "",
        nw === "Without Check-in" ? row.without : "",
        nw === "Phone Number"
          ? formatPhoneNumber(row.phonecode, row.phonenumber)
          : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "Membership" ? Moment(row.membership).format("DD.MM.YYYY") : "",
      ]),
    );

    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerStatistics",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleShowPlayerInfo = async (
    playerId,
    membership,
    firstRegistrationDate,
  ) => {
    try {
      const responseData = await MyPlayerService.infoStatistics(
        playerId,
      ).json();
      setInfoStatistics({
        ...responseData.player_info,
        membership,
        firstRegistrationDate,
      });

      setPlayerInfoModalShow(true);
    } catch (error) {
    }
  };

  const [searchParam] = useState([
    "displayoption",
    "lastname",
    "nickname",
    "phonenumber",
    "firstname",
  ]);

  const filterBySearch = (event) => {
    const query = event.target.value;

    let updatedList = [...RegisterPlayerData];
    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return item[newItem]?.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    });

    let updatedwaitingList = [...WaitingPlayerData];
    updatedwaitingList = updatedwaitingList.filter((item) => {
      return searchParam.some((newItem) => {
        return item[newItem].toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    });
    setFilteredList(updatedList);
    setFilteredWaitingList(updatedwaitingList);
  };

  // table
  const customSortFunction = (rowA, rowB, column) => {
    let a = "";
    let b = "";

    switch (column) {
      case "created":
        a = moment(rowA.created);
        b = moment(rowB.created);
        break;

      default:
        a = rowA[column].toLowerCase();
        b = rowB[column].toLowerCase();
        break;
    }

    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
  };

  const registerationDateCell = (row) =>
    row.created ? (
      Moment(row.created) < Moment(row.tournaments.bounusdeadline) ? (
        <div style={{ color: "lightgreen" }}>
          {Moment(row.created).format("DD.MM.YYYY HH:mm")}
        </div>
      ) : (
        Moment(row.created).format("DD.MM.YYYY HH:mm")
      )
    ) : (
      ""
    );

  const lateArrivalCell = (row) =>
    row.lateannouncement == "" ? (
      <Button
        className={`btn btn-sm btn-primary btn-register-tournament ${
          isMobile ? "mt-0 p-1" : ""
        }`}
        style={{ fontSize: isMobile ? "10px" : "" }}
        onClick={() => handleannounce(row.id)}
      >
        Add {isMobile ? "late arrival" : ""}
      </Button>
    ) : (
      <div>
        <span>{row.lateannouncement && row.lateannouncement}</span>
        <br/>
        <Link
          className="action-link blue-link mb-1"
          onClick={() => handleannounceEdit(row.id, row.lateannouncement)}
        >
          Edit{" "}
        </Link>
        <Link
          className="action-link red-link mb-1"
          onClick={() => handleAnnounceDelete(params.id, row.id)}
        >
          Delete{" "}
        </Link>
      </div>
    );

  const RegisterPlayerColumnsLateArrival = React.useMemo(() => [
    {
      name: isMobile ? "" : "Position",
      selector: (row) => row.position,
      sortable: true,
      width: "100px",
      omit: isMobile,
    },
    {
      name: "Name",
      selector: (row) => (
        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => {
            handleShowPlayerInfo(
              row.id,
              row.membership,
              row.first_registration_date,
            );
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "14px" : "inherit",
              // color:
              //   !row.ischeckedin &&
              //   moment(row?.first_registration_date).isBetween(
              //     moment().subtract(1, "month"),
              //     moment()
              //   )
              //     ? "yellow"
              //     : "inherit",
              color: !row.id_checked ? "yellow" : "inherit",
            }}
          >
            {row.displayoption == "anonymous"
              ? row.firstname + " (A)"
              : row.firstname}
          </span>
          {isMobile ? (
            <div className="mt-3" style={{ fontSize: "12px" }}>
              {registerationDateCell(row)}
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "firstname"),
    },
    {
      name: "Surname",
      selector: (row) => (
        <>
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
              fontSize: isMobile ? "14px" : "inherit",
              color: !row.id_checked ? "yellow" : "inherit",
            }}
            onClick={() => {
              handleShowPlayerInfo(
                row.id,
                row.membership,
                row.first_registration_date,
              );
            }}
          >
            {row.lastname}
          </div>
          {isMobile ? (
            <div className="mt-2 text-center" style={{ fontSize: "14px" }}>
              {lateArrivalCell(row)}
            </div>
          ) : (
            ""
          )}
        </>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "lastname"),
    },
    {
      name: "Nickname",
      selector: (row) => (
        <>
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
              fontSize: isMobile ? "14px" : "inherit",
              color: !row.id_checked ? "yellow" : "inherit",
            }}
            onClick={() => {
              handleShowPlayerInfo(
                row.id,
                row.membership,
                row.first_registration_date,
              );
            }}
          >
            {row.nickname}
          </div>
          {isMobile ? (
            <div className="mt-3" style={{ fontSize: "12px" }}>
              {TournamentData.closed == 0 ? (
                row.ischeckedin ? (
                  <>
                    <div>
                      <Link
                        id={row.id}
                        className="action-link red-link mb-1"
                        onClick={() => {
                          CancleCheckInById(row.id);
                        }}
                      >
                        Cancel Checkin
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-start">
                    <Link
                      className="action-link green-link mb-1"
                      onClick={() => {
                        checkInById(row.id);
                      }}
                    >
                      Checkin Player
                    </Link>
                    <Link
                      id={row.id}
                      className="action-link red-link mb-1"
                      onClick={() => {
                        cancleRegistration(row.id);
                      }}
                    >
                      Cancel Registration
                    </Link>
                  </div>
                )
              ) : (
                "-"
              )}
            </div>
          ) : (
            ""
          )}
        </>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "nickname"),
    },
    {
      name: "Phone",
      selector: (row) =>
        formatPhoneNumber(
          row.phonecode,
          row.phonenumber,
          row.phonecode === "+41" || row.phonecode === "41",
        ),
      sortable: true,
      omit: isMobile,
    },
    {
      name: "Membership",
      selector: (row) => (
        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => {
            handleMembership(
              row.room_member_id,
              row.membership,
              row.room_id,
              row.id,
            );
          }}
        >
          {/* {row.membership} */}
          {row.membership && row.membership != "-" ? (
            Moment().format() > Moment(row.membership).format() ? (
              <div style={{ color: "red" }}>
                {Moment(row.membership).format("DD.MM.YYYY")}
              </div>
            ) : (
              Moment(row.membership).format("DD.MM.YYYY")
            )
          ) : (
            "-"
          )}
        </div>
      ),
      sortable: true,
      omit: hideMembership || isMobile,
    },
    // {
    //     name: 'Bonus',
    //     selector: row => row.tournaments && row.tournaments.bounusdeadline === null ? '' : Moment(row.tournaments && row.tournaments.bounusdeadline).format('DD.MM.YYYY HH:mm'),
    //     sortable: true,
    // },
    {
      name: "Registration Date",
      selector: registerationDateCell,
      // row => row.tournaments ? Moment(row.tournaments.bounusdeadline).format('DD.MM.YYYY HH:mm') >= row.created ? Moment(row.created).format('DD.MM.YYYY HH:mm') : '-' : '',
      // row.created === null ? '' : Moment(row.created).format('DD.MM.YYYY HH:mm'),
      sortable: true,
      width: "180px",
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "created"),
      omit: isMobile,
    },
    {
      name: "Late Arrival",
      selector: lateArrivalCell,
      sortable: true,
      omit: hideLateArrival || isMobile,
    },
    {
      name: (
        <Form.Group className="form-group p-0" controlId="">
          <Form.Control
            type="text"
            placeholder="Search"
            className="player-statistics-search"
            onChange={filterBySearch}
          />
        </Form.Group>
      ),
      cell: (row) => (
        <>
          {/* <div className='d-flex'>
                <Link className='action-link pink-link mb-1' onClick={() => handleExport(row.id)}>
                    Export
                </Link></div> */}
          {TournamentData.closed == 0 ? (
            row.ischeckedin ? (
              <div className="d-flex flex-column text-center">
                <div className="action-reentries">
                  <span className="reentries-label">Re-entries:</span>
                  <div className="d-flex">
                    <Link
                      className="btn btn-outline-primary"
                      onClick={() => {
                        plusReBuyById(row.id, row.reentries);
                      }}
                    >
                      +
                    </Link>
                    <span className="reentries-digit">{row.reentries}</span>
                    <Link
                      className="btn btn-outline-primary"
                      onClick={() => {
                        minusReBuyById(row.id);
                      }}
                    >
                      -
                    </Link>
                  </div>
                </div>
                <div>
                  <Link
                    id={row.id}
                    className="action-link red-link mb-1"
                    onClick={() => {
                      CancleCheckInById(row.id);
                    }}
                  >
                    Cancel Checkin
                  </Link>
                </div>
                {!row.id_checked ? (
                  <Link
                    id={row.id}
                    className="action-link yellow-link mb-1"
                    onClick={() => {
                      handleClickIdCheck(row.id);
                    }}
                  >
                    ID Check
                  </Link>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="d-flex flex-column align-items-start">
                <Link
                  className="action-link green-link mb-1"
                  onClick={() => {
                    checkInById(row.id);
                  }}
                >
                  Checkin Player
                </Link>
                <Link
                  id={row.id}
                  className="action-link red-link mb-1"
                  onClick={() => {
                    cancleRegistration(row.id);
                  }}
                >
                  Cancel Registration
                </Link>
                {!row.id_checked ? (
                  <Link
                    id={row.id}
                    className="action-link yellow-link mb-1"
                    onClick={() => {
                      handleClickIdCheck(row.id);
                    }}
                  >
                    ID Check
                  </Link>
                ) : (
                  ""
                )}
              </div>
            )
          ) : (
            "-"
          )}
        </>
      ),
      width: "200px",
      omit: isMobile,
    },
  ]);

  const WaitingPlayerColumnsLateArrival = React.useMemo(() => [
    {
      name: isMobile ? "" : "Position",
      selector: (row) => row.position,
      sortable: true,
      width: "100px",
      omit: isMobile,
    },
    {
      name: "Name",
      selector: (row) => (
        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
            color: !row.id_checked ? "yellow" : "inherit",
          }}
          onClick={() => {
            handleShowPlayerInfo(
              row.id,
              row.membership,
              row.first_registration_date,
            );
          }}
        >
          <span style={{ fontSize: isMobile ? "14px" : "inherit" }}>
            {row.firstname}
          </span>
          {isMobile ? (
            <div className="mt-3" style={{ fontSize: "12px" }}>
              {registerationDateCell(row)}
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "firstname"),
    },
    {
      name: "Surname",
      selector: (row) => (
        <>
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
              fontSize: isMobile ? "14px" : "inherit",
              color: !row.id_checked ? "yellow" : "inherit",
            }}
            onClick={() => {
              handleShowPlayerInfo(
                row.id,
                row.membership,
                row.first_registration_date,
              );
            }}
          >
            {row.lastname}
          </div>
          {isMobile ? (
            <div className="mt-2 text-center" style={{ fontSize: "14px" }}>
              {lateArrivalCell(row)}
            </div>
          ) : (
            ""
          )}
        </>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "lastname"),
    },
    {
      name: "Nickname",
      selector: (row) => (
        <>
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
              fontSize: isMobile ? "14px" : "inherit",
              color: !row.id_checked ? "yellow" : "inherit",
            }}
            onClick={() => {
              handleShowPlayerInfo(
                row.id,
                row.membership,
                row.first_registration_date,
              );
            }}
          >
            {row.nickname}
          </div>
          {isMobile ? (
            <div className="mt-3" style={{ fontSize: "12px" }}>
              {TournamentData.closed == 0 ? (
                row.ischeckedin ? (
                  <>
                    <div>
                      <Link
                        id={row.id}
                        className="action-link red-link mb-1"
                        onClick={() => {
                          CancleCheckInById(row.id);
                        }}
                      >
                        Cancel Checkin
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-start">
                    <Link
                      className="action-link green-link mb-1"
                      onClick={() => {
                        checkInById(row.id);
                      }}
                    >
                      Checkin Player
                    </Link>
                    <Link
                      id={row.id}
                      className="action-link red-link mb-1"
                      onClick={() => {
                        cancleRegistration(row.id);
                      }}
                    >
                      Cancel Registration
                    </Link>
                  </div>
                )
              ) : (
                "-"
              )}
            </div>
          ) : (
            ""
          )}
        </>
      ),
      style: isMobile ? { padding: "8px" } : "",
      sortable: true,
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "nickname"),
    },
    {
      name: "Phone",
      selector: (row) =>
        formatPhoneNumber(
          row.phonecode,
          row.phonenumber,
          row.phonecode === "+41" || row.phonecode == "41",
        ),
      sortable: true,
      omit: isMobile,
    },
    // {
    //     name: 'Membership',
    //     selector: row => (
    //         row.membership != "-" ?
    //             Moment().format() > Moment(row.membership).format()
    //                 ? <div style={{ color: "red" }}>{Moment(row.membership).format('DD.MM.YYYY')}</div>
    //                 : Moment(row.membership).format('DD.MM.YYYY')
    //             : row.membership
    //     ),
    //     sortable: true,
    //     omit: hideMembership,
    // },
    {
      name: "Membership",
      selector: (row) => (
        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => {
            handleMembership(
              row.room_member_id,
              row.membership,
              row.room_id,
              row.id,
            );
          }}
        >
          {/* {row.membership} */}
          {row.membership && row.membership != "-" ? (
            Moment().format() > Moment(row.membership).format() ? (
              <div style={{ color: "red" }}>
                {Moment(row.membership).format("DD.MM.YYYY")}
              </div>
            ) : (
              Moment(row.membership).format("DD.MM.YYYY")
            )
          ) : (
            "-"
          )}
        </div>
      ),
      sortable: true,
      omit: hideMembership || isMobile,
    },
    // {
    //     name: 'Registration Date',
    //     selector: row => row.created === null ? '' : Moment(row.created).format('DD.MM.YYYY HH:mm'),
    //     sortable: true,
    //     width: "180px"
    // },
    {
      name: "Registration Date",
      selector: registerationDateCell,
      // row => row.tournaments ? Moment(row.tournaments.bounusdeadline).format('DD.MM.YYYY HH:mm') >= row.created ? Moment(row.created).format('DD.MM.YYYY HH:mm') : '-' : '',
      // row.created === null ? '' : Moment(row.created).format('DD.MM.YYYY HH:mm'),
      sortable: true,
      width: "180px",
      sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "created"),
      omit: isMobile,
    },
    /*{
            name: 'Late Arrival',
            selector: row => row.late && row.late.created_at === null ? '' : Moment(row.late && row.late.created_at).format('DD.MM.YYYY HH:mm'),
            sortable: true,
            omit: hideLateArrival,
        },*/
    {
      name: "Late Arrival",
      selector: lateArrivalCell,
      sortable: true,
      omit: hideLateArrival || isMobile,
    },
    {
      name: "",
      cell: (row) => (
        <>
          {/* <div className='d-flex'><Link className='action-link pink-link mb-1' onClick={() => handleExport1(row.id)}>
                Export
            </Link></div> */}
          {TournamentData.closed == 0 ? (
            row.ischeckedin ? (
              <>
                <div className="flex-column text-center">
                  <div className="action-reentries">
                    <span className="reentries-label">Re-entries:</span>
                    <div className="d-flex">
                      <Link
                        className="btn btn-outline-primary"
                        onClick={() => {
                          plusReBuyById(row.id, row.reentries);
                        }}
                      >
                        +
                      </Link>
                      <span className="reentries-digit">{row.reentries}</span>
                      <Link
                        className="btn btn-outline-primary"
                        onClick={() => {
                          minusReBuyById(row.id);
                        }}
                      >
                        -
                      </Link>
                    </div>
                  </div>
                  <div>
                    <Link
                      id={row.id}
                      className="action-link red-link mb-1"
                      onClick={() => {
                        CancleCheckInById(row.id);
                      }}
                    >
                      Cancel Checkin
                    </Link>
                  </div>
                  {!row.id_checked ? (
                    <Link
                      id={row.id}
                      className="action-link yellow-link mb-1"
                      onClick={() => {
                        handleClickIdCheck(row.id);
                      }}
                    >
                      ID Check
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              <div>
                <Link
                  className="action-link green-link mb-1"
                  onClick={() => {
                    checkInById(row.id);
                  }}
                >
                  Checkin Player
                </Link>
                <Link
                  id={row.id}
                  className="action-link red-link mb-1"
                  onClick={() => {
                    cancleRegistration(row.id);
                  }}
                >
                  Cancel Registration
                </Link>
                {!row.id_checked ? (
                  <Link
                    id={row.id}
                    className="action-link yellow-link mb-1"
                    onClick={() => {
                      handleClickIdCheck(row.id);
                    }}
                  >
                    ID Check
                  </Link>
                ) : (
                  ""
                )}
              </div>
            )
          ) : (
            "-"
          )}
          <div></div>
        </>
      ),
      width: "200px",
      omit: isMobile,
    },
  ]);
  const RegistrationLogColumns = [
    {
      name: "Position",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Player",
      selector: (row) => row.player,
      sortable: true,
    },
    {
      name: "Action",
      // selector: row => { if (row.action === 1) return 'Unregistered'; else if (row.action === 2) return 'Registered'; else return 'Waiting List'; },
      selector: (row) => {
        if (row.action === 1) return "Unregistered(" + row.position + ")";
        else if (row.action === 2)
          return "New registration(" + row.position + ")";
        else if (row.action === 3)
          return "New registration in WL(" + row.position + ")";
        else if (row.action === 6) return "Delete Late";
        else if (row.action === 4) return "New Late";
        else if (row.action === 5) return "Modify late";
        else if (row.action === 7)
          return "unregistered from WL(" + row.position + ")";
        else if (row.action === 8) return "New registration from WL";
        else return "Waiting List";
      },
      sortable: true,
    },
    {
      name: "Actor",
      selector: (row) => row.added_by,
      sortable: true,
    },
    {
      name: "Datetime",
      selector: (row) => Moment(row.datetime).format("ddd DD.MM.YYYY HH:mm"),
      sortable: true,
    },
  ];
  const submitForm = () => {
    formRefSt.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  };
  const handleConfirmation = async (event) => {
    event.preventDefault();

    try {
      if (inputRef.current["firstname"].value === "") {
        setError("Please Fill All Fields*.");
      } else if (inputRef.current["dob"].value === "") {
        setError("Please Fill All Fields*.");
      } else if (phonenumber === "") {
        setError("Please Fill All Fields*.");
      } else if (inputRef.current["password"].value === "") {
        setError("Please Fill All Fields*.");
      } else if (inputRef.current["confirmpassword"].value === "") {
        setError("Please Fill All Fields*.");
      } else if (
        inputRef.current["confirmpassword"].value !==
        inputRef.current["password"].value
      ) {
        setError("Password and Confirm password not same..");
      } else {
        const res = await RoomService.getmodalcontent(
          i18n.resolvedLanguage,
        ).json();
        setModalData(res);
        setOpenshow(true);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const onSubmitHandler = async (event) => {
    setOpenshow(false);
    setError("");
    event.preventDefault();

    try {
      var userData = {
        username: event.target.firstname.value + event.target.lastname.value,
        email: event.target.email.value,
        password: event.target.password.value,
        firstname: event.target.firstname.value,
        lastname: event.target.lastname.value,
        dob: event.target.dob.value,
        street: event.target.street.value,
        language: language,
        city: pokerCity,
        nickname: event.target.nickname.value,
        zipcode: event.target.zipcode.value,
        phonecode: "+" + phonecode,
        phonecountry: phonecountry,
        phonenumber: phonenumber,
        displayoption: profineName,
      };

      const data = await MyPlayerService.store(userData).json();

      if (data.status === true) {
        setModelShow(true);
        setModalMessage(data.message);
        setError("");
      }
    } catch (error) {
      // Handle API errors
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const conditionalRowStyles = [
    {
      when: (row) =>
        row.tournaments && row.tournaments.bounusdeadline === null ? (
          <></>
        ) : (
          row.tournaments.bounusdeadline.includes(
            row.tournaments.bounusdeadline,
          )
        ),
      style: (row) => ({
        backgroundColor:
          Moment(row.tournaments && row.tournaments.bounusdeadline).format(
            "DD.MM.YYYY HH:mm",
          ) > Moment(row.late && row.late.created_at).format("DD.MM.YYYY HH:mm")
            ? "#233237"
            : "#1a1a1a",
      }),
    },
  ];

  const [searchParamLog] = useState(["player"]);
  const filterBySearchLog = (event) => {
    const query = event.target.value;

    var updatedList = [...RegistrationLog];

    updatedList = updatedList.filter((item) => {
      return searchParamLog.some((newItem) => {
        return item[newItem].toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    });

    setFilterRegistrationLog(updatedList);
  };

  const handleShowUnchecked = () => {
    const _showOnlyUnchecked = !showOnlyUnchecked;
    setShowOnlyUnchecked(_showOnlyUnchecked);

    let updatedList = [...RegisterPlayerData];
    let updatedWaitingList = [...WaitingPlayerData];

    if (_showOnlyUnchecked) {
      updatedList = updatedList.filter((item) => !item.ischeckedin);

      updatedWaitingList = updatedWaitingList.filter(
        (item) => !item.ischeckedin,
      );
    }

    setFilteredList(updatedList);
    setFilteredWaitingList(updatedWaitingList);
  };

  const formatLateReg = (tournamentDetail) => {
    let lateReg = "-";
    if (!tournamentDetail) return lateReg;

    const { lateregformat, latereground, lateregtime } = tournamentDetail;

    switch (lateregformat) {
      case "round":
        lateReg = `Round ${latereground}`;
        break;
      case "time":
        lateReg = Moment(lateregtime, "HH:mm:ss").format("HH:mm");
        break;
      default:
        lateReg = "-";
        break;
    }
    return lateReg;
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={10} lg={12}>
            <Card>
              <Card.Header className="header-wrapper">
                <Row>
                  <Col md={4} className="header-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                      fill="#fff"
                      className="me-1"
                    >
                      <path
                        d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                    </svg>
                    <Link to="/manager/my-tournaments">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.Tournaments",
                      )}
                    </Link>{" "}
                    <FontAwesomeIcon icon={faArrowRight}/>{" "}
                    {TournamentData.title}{" "}
                    <FontAwesomeIcon icon={faArrowRight}/>
                    &nbsp;
                    {t("page.myprofile.myprofilenav.All tournaments.checkIn")}
                  </Col>
                  <Col className="header-text">
                    {TournamentData.title} (
                    {moment(TournamentData.detail?.startday).format(
                      "DD.MM.YYYY HH:mm",
                    )}
                    ) / {TournamentData.detail?.buyin} +{" "}
                    {TournamentData.detail?.bounty} +{" "}
                    {TournamentData.detail?.rake} /{" "}
                    {TournamentData.detail?.maxreentries}R (
                    {TournamentData.detail?.reentriesrake})
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row className="info-wrapper">
                  <Col md={3}>
                    <div className="d-flex d-lg-block font-size-mobile">
                      <Row>
                        <Col md={8} className="mb-1 mb-lg-3">
                          Registered Players
                        </Col>
                        <Col md={4}>
                          {reservedPlayerCount +
                            registeredPlayerCount +
                            waitingPlayerCount}
                          /{maxNumberPlayerCount}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={8} className="mb-1 mb-lg-3">
                          Checked in Players
                        </Col>
                        <Col md={4}>
                          {TournamentData.checkins}/{maxNumberPlayerCount}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={8} className="mb-1 mb-lg-3">
                          Re-entries
                        </Col>

                        <Col md={4}>{TournamentData.reentries}</Col>
                      </Row>
                      <Row className="d-none d-md-flex">
                        <Col md={8} className="mb-1 mb-lg-3">
                          Late Reg
                        </Col>

                        <Col md={4}>{formatLateReg(TournamentData.detail)}</Col>
                      </Row>
                      <Row className="d-none d-md-flex">
                        <Col md={8} className="mb-1 mb-lg-3">
                          Bonus deadline
                        </Col>

                        <Col md={4} className="text-nowrap">
                          {TournamentData.is_bonus &&
                          TournamentData.detail?.bounusdeadline
                            ? Moment(
                              TournamentData.detail?.bounusdeadline,
                            ).format("DD.MM.YYYY HH:mm")
                            : "-"}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md>
                    <div className="d-flex d-lg-block font-size-mobile mt-3 mt-lg-0">
                      <PlayerCountInput
                        label="Max Number of Players*"
                        disabledMinus={
                          reservedPlayerCount >= maxNumberPlayerCount ||
                          (TournamentData.is_freeze === 1 &&
                            waitingPlayerCount > 0)
                        }
                        value={maxNumberPlayerCount}
                        onChange={handleChangeMaxPlayerCount}
                      />
                      <PlayerCountInput
                        label="Reserved Places"
                        disabledMinus={TournamentData.is_freeze === 1}
                        disabledPlus={
                          TournamentData.is_freeze === 1 ||
                          reservedPlayerCount +
                          registeredPlayerCount +
                          waitingPlayerCount >=
                          maxNumberPlayerCount
                        }
                        value={reservedPlayerCount}
                        onChange={handleChangeReservedPlayerCount}
                      />
                    </div>
                    <Row>
                      <Col
                        xs={6}
                        className="mb-3 font-size-mobile mt-3 mt-lg-0"
                      >
                        Register Player
                      </Col>
                      <Col xs={6} className="player-info">
                        <Select
                          options={RegisterPlayerList}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Search to add"
                          value={null}
                          onChange={(e) => {
                            handleSelectChange(e);
                          }}
                          isSearchable={true}
                          onInputChange={(e) => {
                            handleSelect(e);
                          }}
                          // disable filter options list in frontend, it's done on backend
                          filterOption={(option, input) => true}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md>
                    <Row className="player-button">
                      <Col xs={6} sm={6}>
                        <Link
                          className="btn btn-primary"
                          onClick={() => setModalPlayer(true)}
                        >
                          Create a player account
                        </Link>
                      </Col>
                      <Col xs={6} sm={6}>
                        <Link
                          className="btn btn-primary"
                          to={`/manager/editTournament/${TournamentData.slug}`}
                        >
                          Edit tournament
                        </Link>
                      </Col>
                      <Col xs={6} sm={6} className="d-none d-md-block">
                        <Button
                          variant="primary"
                          onClick={handleShowExportModal}
                        >
                          Export
                        </Button>
                      </Col>
                      <Col xs={6} sm={6}>
                        <Button
                          className="btn btn-primary"
                          onClick={handleShowUnchecked}
                        >
                          {showOnlyUnchecked
                            ? "Show all"
                            : "Show only unchecked"}
                        </Button>
                      </Col>
                      <Col xs={6} sm={6}>
                        <Button
                          className="btn btn-primary"
                          onClick={handleFreeze}
                          disabled={
                            waitingPlayerCount < 1 &&
                            TournamentData.is_freeze == 0
                          }
                        >
                          {TournamentData.is_freeze == 1
                            ? "Unfreeze"
                            : "Freeze"}{" "}
                          Waiting List
                        </Button>
                      </Col>
                      <Col xs={6} sm={6} className="d-none d-md-block">
                        <Button
                          className="btn btn-primary"
                          onClick={() => {
                            setSendEmailModalShow(true);
                          }}
                        >
                          Send Email
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={2} className="d-none d-lg-block">
                    <h5 className="fw-bold">Live Statistics</h5>

                    <div className="live-statistics">
                      <p className="mb-0">
                        Prize pool: {liveStatistics.prizePool}
                      </p>
                      <p className="mb-0">
                        Bounties: {liveStatistics.bounties}
                      </p>
                      <p>Rakes: {liveStatistics.rakes}</p>

                      <p>
                        Players with Bonus{" "}
                        {liveStatistics.checkedInPlayersWithBonus}/
                        {liveStatistics.playersWithBonus}
                      </p>
                      <p>
                        Late Reg Announces (Unchecked):{" "}
                        {liveStatistics.announcedPlayers}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col ref={componentRef}>
                    <DataTable
                      data={filteredList}
                      columns={RegisterPlayerColumnsLateArrival}
                      theme="dark"
                      selectableRowsComponentProps={{ inkDisabled: true }}
                      className="preminum-tr registered-player-table"
                      conditionalRowStyles={conditionalRowStyles}
                      customStyles={customStyles}
                    />
                  </Col>
                </Row>

                {TournamentData.closed == 0 ? (
                  <>
                    <h2 className="mb-3">Waiting List:</h2>
                    <Col ref={componentRef1}>
                      <DataTable
                        data={filterWaitingList}
                        columns={WaitingPlayerColumnsLateArrival}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        customStyles={customStyles1}
                      />
                    </Col>
                  </>
                ) : (
                  ""
                )}
                <h2 className="mt-3 log-title">Registration Log:</h2>
                <Row className="my-3">
                  <Col md={6}></Col>
                  <Col md={6} className="text-end">
                    <Form.Group
                      className="mb-5 form-group text-end d-flex align-items-center justify-content-end p-0"
                      controlId=""
                    >
                      <Form.Label className="d-block me-2">Search :</Form.Label>

                      <Form.Control
                        type="text"
                        className="player-statistics-search"
                        onChange={filterBySearchLog}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <DataTable
                      data={FilterRegistrationLog}
                      columns={RegistrationLogColumns}
                      theme="dark"
                      selectableRowsComponentProps={{ inkDisabled: true }}
                      pagination
                      customStyles={customStyles1}
                      paginationPerPage={100}
                      paginationComponentOptions={paginationComponentOptions}
                      paginationRowsPerPageOptions={[100]}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          show={show}
          onHide={() => {
            plusReBuyModalFalse();
          }}
          size="xl"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="p-0">
            <div className="tournament-description-wrap">
              <Row className="flex-column-reverse flex-md-row">
                <Col md={12} lg={12}>
                  <div className="players-Template-wrap">
                    <h3>
                      Are you sure you want to increase the player re-entry
                      count? Maximum numbers of re-entry already excited.
                    </h3>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="text-center mt-3">
                  <Link
                    onClick={() => {
                      plusReBuyModalTrue();
                    }}
                    className="btn btn-primary load-more-btn"
                  >
                    <b> Yes </b>
                  </Link>
                  <Link
                    onClick={() => {
                      plusReBuyModalFalse();
                    }}
                    className="btn btn-primary load-more-btn ml-5"
                  >
                    <b> No </b>
                  </Link>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer className="mb-50 d-block d-md-none text-end">
            <Link
              onClick={() => {
                plusReBuyModalFalse();
              }}
            >
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
        <Modal show={modalPlayer} className="add-player-modal">
          <Modal.Header>
            <Modal.Title>
              {t("page.myprofile.myprofilenav.Add Players")}
            </Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModalPlayer(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={onSubmitHandler} ref={(ref) => setFormRef(ref)}>
              <Row>
                <Col md={10} className="mt-3"></Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="firstname">
                    <Form.Label>{t("page.registration.Name")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder={t("page.registration.Name")}
                      ref={(el) => (inputRef.current["firstname"] = el)}
                      className=""
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="date">
                    <Form.Label>
                      {t("page.registration.Date of birth")}*
                    </Form.Label>
                    <Form.Control
                      name="dob"
                      type="date"
                      placeholder="DD.MM.YYYY"
                      ref={(el) => (inputRef.current["dob"] = el)}
                      className=""
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="lastname">
                    <Form.Label>{t("page.registration.Surname")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      placeholder={t("page.registration.Surname")}
                      className=""
                      ref={(el) => (inputRef.current["surname"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="street">
                    <Form.Label>
                      {t("page.registration.Street and number")}*
                    </Form.Label>
                    <Form.Control
                      name="street"
                      type="text"
                      placeholder={t("page.registration.Street and number")}
                      className=""
                      ref={(el) => (inputRef.current["street"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="nickname">
                    <Form.Label>{t("page.registration.Nickname")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="nickname"
                      placeholder={t("page.registration.Nickname")}
                      className=""
                      ref={(el) => (inputRef.current["nickname"] = el)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="language">
                    <Form.Label>{t("page.registration.Language")}*</Form.Label>
                    <Select
                      name="language"
                      options={options}
                      className=" react-select-container"
                      onChange={(e) => handleLanguage(e.value)}
                      classNamePrefix="react-select"
                      ref={(el) => (inputRef.current["language"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="email">
                    <Form.Label>{t("page.registration.E-Mail")}*</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder={t("page.registration.E-Mail")}
                      className=""
                      ref={(el) => (inputRef.current["email"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="zipcode">
                    <Form.Label>{t("page.registration.ZIP code")}*</Form.Label>
                    <Form.Control
                      name="zipcode"
                      type="text"
                      onBlur={(e) => handleZipcodeChange(e, "poker")}
                      placeholder="e.g. 774843"
                      className=""
                      ref={(el) => (inputRef.current["zipcode"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 form-group position-relative"
                    controlId="password"
                  >
                    <Form.Label>{t("page.registration.Password")}*</Form.Label>
                    <Form.Control
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      placeholder={t("page.registration.Password")}
                      className=""
                      ref={(el) => (inputRef.current["password"] = el)}
                    />
                    <span className="faEye-icon">
                      <i onClick={togglePasswordVisiblity}>
                        {passwordShown ? eye : eyeSlash}
                      </i>
                    </span>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3  form-group" controlId="city">
                    <Form.Label>{t("page.registration.City")}*</Form.Label>
                    <Form.Control
                      name="city"
                      type="text"
                      placeholder="City"
                      className=""
                      onChange={(e) => setPokerCity(e.target.value)}
                      value={pokerCity}
                      ref={(el) => (inputRef.current["city"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 form-group form-group position-relative"
                    controlId="confpassword"
                  >
                    <Form.Label>
                      {t("page.registration.Repeat password")}*
                    </Form.Label>
                    <Form.Control
                      type={passwordReShown ? "text" : "password"}
                      name="confpassword"
                      placeholder={t("page.registration.Repeat password")}
                      className=""
                      ref={(el) => (inputRef.current["confirmpassword"] = el)}
                    />
                    <span className="faEye-icon">
                      <i onClick={togglePasswordReVisiblity}>
                        {passwordReShown ? eye : eyeSlash}
                      </i>
                    </span>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="name">
                    <Form.Label>
                      {t(
                        "page.registration.Visible detail for the other players",
                      )}{" "}
                      *
                    </Form.Label>
                    <Select
                      name="displayoption"
                      options={profileNameOption}
                      className=" react-select-container"
                      onChange={(e) => handleProfileOption(e.value)}
                      classNamePrefix="react-select"
                      ref={(el) => (inputRef.current["displayoption"] = el)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 form-group" controlId="name">
                    <Form.Label>
                      {t("page.registration.Phone Number")}*
                    </Form.Label>

                    <div className="flag-select custom-phone-field">
                      <InputPhoneComponent
                        fn={handleOnChange}
                        // phonecode={phonenumber}
                        // phoneCountry={phonecountry}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-1" controlId="name">
                    <Form.Label>&nbsp;</Form.Label>
                    <div key="checkbox" className="mb-1 d-flex flex-wrap"></div>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 form-group"
                    controlId="name"
                  ></Form.Group>
                </Col>

                <Col md={12} className="text-center mt-5">
                  <p
                    className="success"
                    style={{ color: `white`, display: `none` }}
                  >
                    {t("page.registration.Success")}
                  </p>

                  <p className="error">{error}</p>
                  <div
                    key="confim"
                    className="mb-1 d-flex justify-content-center"
                  >
                    <Form.Check
                      type="checkbox"
                      id="confim"
                      label={t(
                        "page.registration.I confirm that I am already 18 years old",
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className=" btn btn-primary btn-submit"
                    onClick={handleConfirmation}
                  >
                    {t("page.registration.Create account")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setError("");
                      setModalPlayer(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={openshow}>
          <Modal.Header closeButton onClick={() => setOpenshow(false)}>
            <Modal.Title>{modalData && modalData.data.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalData && modalData.data.content}</Modal.Body>
          <Modal.Footer>
            <Button varient="primary" onClick={submitForm}>
              {t("page.managerRegister.Registration")}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setError("");
                setOpenshow(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

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
                    setModelShow(false);
                  }}
                >
                  Okay
                </Button>
              </Modal.Footer>
            </>
          </Modal>
        ) : (
          ""
        )}
        <Modal show={memebershipmodal}>
          <Modal.Header onClick={() => setMemebershipmodal(false)}>
            <Modal.Title>
              {" "}
              <h4>Membership</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleMembershipSubmit}>
              <Form.Group className="form-group " controlId="">
                <select
                  onChange={handleCustomdate}
                  name="membershipdate"
                  className="form-select mb-3"
                >
                  <option value={new Date().getFullYear() + "-12-31"}>
                    Until the end of the year (
                    {"31.12." + new Date().getFullYear()})
                  </option>
                  <option
                    value={parseInt(new Date().getFullYear() + 1) + "-12-31"}
                  >
                    Until the end of the next year (
                    {"31.12." + parseInt(new Date().getFullYear() + 1)})
                  </option>
                  <option
                    value={
                      currentmemberdateYear +
                      "-" +
                      currentmemberdateMonth +
                      "-" +
                      currentmemberdateDay
                    }
                  >
                    By one year ({currentmemberdate})
                  </option>
                  <option value="custom">Custom Date</option>
                  <option value="reset">Reset membership</option>
                </select>
                {isCustomdate ? (
                  <input
                    type="date"
                    name="custom_date"
                    className="form-control"
                  />
                ) : (
                  <input type="hidden" name="custom_date"/>
                )}
                <p className="error">{error}</p>
              </Form.Group>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => setMemebershipmodal(false)}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={checkinmodal}>
          <Modal.Header onClick={() => setOpenshow(false)}>
            <Modal.Title>
              {" "}
              <h4>
                Statistics on finished tournaments for player without check-in:
              </h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col md={12}>
              <ul className="">
                <li className="list-group-item">
                  Last week :&nbsp;8
                  <br/>
                  Last month :&nbsp; 7
                  <br/>
                  Last 6 months :&nbsp; 8
                  <br/>
                  Last 12 months :&nbsp; 10
                  <br/>
                  Ever:&nbsp; 12
                </li>
              </ul>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setCheckinmodal(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showannounce} onHide={handleannounceclose}>
          <Modal.Header>
            <Modal.Title>Saved</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleannounceSubmit}>
              <Form.Group className="form-group" controlId="">
                <p className="description mb-10">
                  Announcement Time <span className="required">*</span>
                </p>
                <Form.Control
                  type="time"
                  className=""
                  name="timing"
                  defaultValue={announceLateTime}
                />
                <p className="error">{error}</p>
              </Form.Group>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => setShowannounce(false)}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={announce}>
          <Modal.Header>
            <Modal.Title>Saved</Modal.Title>
          </Modal.Header>
          <Modal.Body>{saveMessage}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              type="button"
              onClick={() => handleLateArrival()}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={ExporttourTournamentshow} onHide={setExporttournamentshow}>
          <>
            <Modal.Header>
              <Modal.Title>Export</Modal.Title>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={() => setExporttournamentshow(false)}
              ></button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <ul className="list-unstyled">
                  {exporttournament.map((col) => (
                    <li key={col.label}>
                      <label className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() => handleColumnToggle(col.label)}
                        />
                        {col.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handlePrintTournament}>
                Print
              </Button>
              &nbsp;
              <Button variant="primary" onClick={handlePDFTournament}>
                PDF
              </Button>
              &nbsp;
              <CSVLink
                varient="primary"
                class="btn btn-primary"
                data={
                  csvTournament[0].length === 0
                    ? ExporttourTournament
                    : csvTournament
                }
                headers={csvData[0].length === 0 ? exporttournament : ""}
              >
                Save CSV
              </CSVLink>
              &nbsp;
              <button
                varient="primary"
                class="btn btn-primary"
                onClick={handleTournamentExcel}
              >
                Save Excel
              </button>
            </Modal.Footer>
          </>
        </Modal>
        <Modal show={exportmodelshow1} onHide={setExportModelShow1}>
          <>
            <Modal.Header>
              <Modal.Title>Export</Modal.Title>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={() => setExportModelShow1(false)}
              ></button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <ul className="list-unstyled">
                  {headers.map((col) => (
                    <li key={col.label}>
                      <label className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() => handleColumnToggle(col.key)}
                        />
                        {col.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handlePrint1}>
                Print
              </Button>
              &nbsp;
              <Button variant="primary" onClick={exportToPDF1}>
                PDF
              </Button>
              &nbsp;
              <CSVLink
                varient="primary"
                class="btn btn-primary"
                data={csvData1[0].length === 0 ? ExportWaitingList : csvData1}
                headers={csvData1[0].length === 0 ? headers : ""}
              >
                Save CSV
              </CSVLink>
              &nbsp;
              <button
                varient="primary"
                class="btn btn-primary"
                onClick={handleDownloadExcel1}
              >
                Save Excel
              </button>
            </Modal.Footer>
          </>
        </Modal>
        <Modal show={exportmodelshow} onHide={setExportModelShow}>
          <>
            <Modal.Header>
              <Modal.Title>Export</Modal.Title>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={() => setExportModelShow(false)}
              ></button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <ul className="list-unstyled">
                  {exporttournament.map((col) => (
                    <li key={col.label}>
                      <label className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() => handleColumnToggle(col.label)}
                        />
                        {col.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="primary"
                        onClick={handlePrint}
                        >
                        Print
                        </Button> */}
              &nbsp;
              <Button variant="primary" onClick={handleShowExportModal}>
                PDF
              </Button>
              &nbsp;
              {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : players} headers={selectedColumns.lenght > 0 ? selectedColumns : headers}>Save CSV</CSVLink> */}
              <CSVLink
                varient="primary"
                class="btn btn-primary"
                data={csvData[0].length === 0 ? exportData : csvData}
                headers={csvData[0].length === 0 ? headers : ""}
              >
                Save CSV
              </CSVLink>
              {/* <button varient="primary" class="btn btn-primary" onClick={handleCSV}>Save CSV</button> */}
              &nbsp;
              <button
                varient="primary"
                class="btn btn-primary"
                onClick={handleDownloadExcel}
              >
                Save Excel
              </button>
            </Modal.Footer>
          </>
        </Modal>

        <Modal show={playerInfoModalShow}>
          <div ref={componentRef}>
            <style type="text/css" media="print">
              {
                "\
                          @page {size: auto;    margin: 20mm;}\
                        "
              }
              {
                "\
                          body {color:#000 !important; }\
                        "
              }
              {
                "\
                          .form-label {color:#000 !important; }\
                        "
              }
            </style>
            <Modal.Header>
              <Modal.Title>
                {infoStatistics?.firstname} {infoStatistics?.lastname}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Form.Label>Name : {infoStatistics?.firstname} </Form.Label>
                <Form.Label>Surname : {infoStatistics?.lastname}</Form.Label>
                <Form.Label>Nickname : {infoStatistics?.nickname}</Form.Label>
                <Form.Label>
                  Street and number : {infoStatistics?.street}
                </Form.Label>
                <Form.Label>
                  ZIP and City : {infoStatistics?.zipcode}{" "}
                  {infoStatistics?.city}
                </Form.Label>
                <Form.Label>
                  Birthdate : {moment(infoStatistics?.dob).format("DD.MM.YYYY")}
                </Form.Label>
                <Form.Label>
                  E-Mail Address :{" "}
                  <a
                    className="text-white"
                    href={`mailto:${infoStatistics?.email}`}
                  >
                    {infoStatistics?.email}
                  </a>
                </Form.Label>
                <Form.Label>
                  Phone Number :{" "}
                  {formatPhoneNumber(
                    infoStatistics?.phonecode,
                    infoStatistics?.phonenumber,
                  )}
                </Form.Label>
                <Form.Label>
                  First Registration:{" "}
                  {infoStatistics?.firstRegistrationDate
                    ? moment(infoStatistics?.firstRegistrationDate).format(
                      "DD.MM.YYYY",
                    )
                    : "Before 04.2024"}
                </Form.Label>
                <Form.Label>
                  Membership:{" "}
                  {hideMembership
                    ? "Not Active"
                    : infoStatistics?.membership &&
                    infoStatistics?.membership !== "-"
                      ? moment(infoStatistics?.membership).format("DD.MM.YYYY")
                      : "-"}
                </Form.Label>
              </Row>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setPlayerInfoModalShow(false)}
            >
              Close
            </Button>

            <Button variant="primary" onClick={handlePrint}>
              Print
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/manager/infoStatistics/${infoStatistics?.id}`)
              }
            >
              Statistics
            </Button>
          </Modal.Footer>
        </Modal>

        <ExportModal
          show={exportModalShow}
          onHide={() => {
            setExportModalShow(false);
          }}
          tournament={TournamentData}
        />

        <SendEmailModal
          show={sendEmailModalShow}
          onHide={() => {
            setSendEmailModalShow(false);
          }}
          emailData={{ tournamentId: params.id, name: 'manager', roomTitle: TournamentData?.room?.title }}
        />
      </div>

      {isLoading && <LogoAnimationLoader/>}
    </>
  );
};

export default CheckInTournament;
