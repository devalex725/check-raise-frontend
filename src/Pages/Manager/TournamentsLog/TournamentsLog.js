import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TournamentService from "../../../api/services/TournamentService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import moment from "moment";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import customStyle from "../../Admin/customstyle";
import { sortDate } from "../../../utils";

const TournamentsLog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [logsData, setLogsData] = useState([]);
  const [Error, setError] = useState("");

  const LogsApi = async () => {
    try {
      let responseData = await TournamentService.log().json();
      setIsLoading(false);
      setLogsData(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      LogsApi();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const changesColumn = (row) => {
    switch (row.type) {
      case 1:
        return "Created new tournament";
        break;
      case 3:
        return "Published a tournament";
        break;
      case 4:
        return "Unpublished a tournament";
        break;
      case 5:
        return "Deleted a tournament";
        break;
      case 6:
        return "Sent email";
        break;
      default:
        break;
    }

    if (row.type == 2 && row.changes) {
      return (
        <ul>
          {Object.entries(row.changes).map(([key, val], index) => (
            <li key={index}>
              {key === "created" ? "Create new tournament " : ""}
              {key === "type"
                ? "Type was changed  " + "from" + val.from + " to " + val.to
                : ""}
              {key === "buy-in"
                ? "Buy in was changed " + "from " + val.from + " to " + val.to
                : ""}
              {key === "bounty"
                ? "Bounty was changed " + "from " + val.from + " to " + val.to
                : ""}
              {key === "maxplayers"
                ? "Maximum players was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "reservedplayers"
                ? "Reserved players count was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "levelduration"
                ? "Level duration was changed  " +
                  //  + Object.entries(val)
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "startday"
                ? "Start date was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "rake"
                ? "Rake was changed " + "from " + val.from + " to " + val.to
                : ""}
              {key === "max_number_of_rebuys"
                ? "Number of rebuy was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "maxreentries"
                ? "Maximum reentries was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "rebuys_rake"
                ? "Rebuy rake was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "starting_stack"
                ? "Starting stack was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "isshorthanded"
                ? "Shorthanded was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "lastday"
                ? "Last date was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
              {key === "lateregformat"
                ? "Last registration format was changed " +
                  "from " +
                  val.from +
                  " to " +
                  val.to
                : ""}
            </li>
          ))}
        </ul>
      );
    }

    return "";
  };

  const columns = useMemo(
    () => [
      {
        name: "Modification Date",
        selector: (row) => moment(row.datetime).format("DD.MM.YYYY HH:mm"),
        sortable: true,
        sortFunction: (rowA, rowB) => sortDate(rowA, rowB, "datetime"),
      },
      {
        name: "Name",
        selector: (row) => row.manager,
        sortable: true,
      },
      {
        name: "Tournament Date",
        selector: (row) =>
          row.tournament_date
            ? moment(row.tournament_date).format("DD.MM.YYYY HH:mm")
            : "-",
        sortable: true,
      },
      {
        name: "Tournament",
        selector: (row) => row.tournament,
        sortable: true,
      },
      {
        name: "Changes / Actions",
        selector: changesColumn,
        sortable: true,
      },
    ],
    []
  );

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={10} lg={12}>
            <Card>
              <Card.Header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#fff"
                  className="me-1"
                >
                  <path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
                {t("page.Manager.TournamentsLog.Log")}
              </Card.Header>
              <Card.Body>
                <DataTable
                  data={logsData}
                  columns={columns}
                  theme="dark"
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <p className="error">{Error}</p>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default TournamentsLog;
