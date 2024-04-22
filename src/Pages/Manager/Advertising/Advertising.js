import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TournamentService from "../../../api/services/TournamentService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import DataTable from "react-data-table-component";
import customeStyle from "../../Admin/customstyle";
import { useNavigate } from "react-router-dom";
import { CLIENT_ID } from "../../../Config/Config";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import User from "../../../api/services/User";
import SettingService from "../../../api/services/SettingService";
const initialOptions = {
  clientId: "test",
  currency: "CHF",
  intent: "capture",
  "client-id": CLIENT_ID,
};
const Advertising = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [enabledPayPal, setEnabledPayPal] = useState(true);
  const [content, setContent] = useState({ en: "", fr: "", de: "" });
  const [advertisingData, setAdvertisingData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);
  const [advamount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState();

  const getSettings = async () => {
    const response = await SettingService.siteSettings().json();
    console.log(response.data)
    setEnabledPayPal(response.data?.[0]?.is_paypal === 1);
  };

  const getPageSettingContent = async () => {
    const pageResponse = await User.info().json();

    // TODO: Create a new endpoint for user to get pageSettings by key - page name
    const pageSetting = pageResponse.data.find(
      (item) => item.key === "rm-advertising"
    );

    if (pageSetting?.content) {
      setContent(pageSetting.content);
    }
  };

  const getAdvertising = async () => {
    try {
      let responseData = await TournamentService.getAdvertsing().json();
      setIsLoading(false);
      setAdvertisingData(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const getCredits = async () => {
    try {
      let responseData = await TournamentService.getCredits().json();
      setIsLoading(false);
      setCreditData(responseData.data);
      setBalance(responseData.balance);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  const handlebuyCredit = () => {
    {
      advamount === "" ? setError("Please Enter Amount") : setShow(true);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Purchase Credit",
            amount: {
              value: advamount ? advamount : 0,
            },
          },
        ],
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  // check Approval
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      setSuccess(true);
    });
  };

  //capture likely error
  const onError = (data, actions) => {
    setErrorMessage("An Error occured with your payment ");
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getSettings();
      getAdvertising();
      getCredits();
      getPageSettingContent();
      if (success) {
        //alert("Payment successful!!");
        console.log("Order successful . Your order id is--", orderID);
        checkOrder(orderID);
      }
    } else {
      navigate("/");
    }
  }, [navigate, success]);
  const checkOrder = async (orderID) => {
    try {
      var data = {
        orderid: orderID,
      };
      await TournamentService.checkOrder(data).json();
      getCredits();
      setAmount(0);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrorMessage(errorJson.message);
      }
    }
  };
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      // <th>{t('page.Manager.TournamentsAdvertising.number')}</th>
      // <th>{t('page.Manager.TournamentsAdvertising.description')}</th>
      // <th>{t('page.Manager.TournamentsAdvertising.amount')} </th>
      {
        name: "Number",
        selector: (row) => (row ? row.id : ""),
        sortable: true,
      },
      {
        name: "Description",
        selector: (row) => (row ? row.description : ""),
        sortable: true,
      },

      {
        name: "Amount",
        selector: (row) => (row ? row.amount : ""),
        sortable: true,
      },
    ],
    []
  );
  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          {/* <Col md={2}>
                         {/* <MyProfileLeftNavManager /> */}
          {/* </Col> */}
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
                {t("page.Manager.TournamentsAdvertising.Label")}
              </Card.Header>
              <Card.Body>
                <Table responsive className="alltournamenttable">
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th></th>
                      <th>
                        {t("page.Manager.TournamentsAdvertising.Credits")}
                      </th>
                      {/* <th>{t('page.Manager.TournamentsAdvertising.Credits')} for {advertisingData&&advertisingData.daysdiscount} days or more</th>                                            */}
                    </tr>
                  </thead>
                  <tbody>
                    {advertisingData.data &&
                      advertisingData.data.map((element, index) => {
                        return (
                          <React.Fragment key={index}>
                            {element && element.key === "top_banner" && (
                              <tr key={index} style={{ textAlign: "center" }}>
                                <td>
                                  {t(
                                    "page.Manager.TournamentsAdvertising.topbanner"
                                  )}
                                </td>
                                <td>{element.perday}</td>
                                {/* <td>{element.discount}</td> */}
                              </tr>
                            )}
                            {element && element.key === "bottom_banner" && (
                              <tr key={index} style={{ textAlign: "center" }}>
                                <td>
                                  {t(
                                    "page.Manager.TournamentsAdvertising.centerbanner"
                                  )}
                                </td>
                                <td>{element.perday}</td>
                                {/* <td>{element.discount}</td> */}
                              </tr>
                            )}
                            {element &&
                              element.key === "premium_tournament" && (
                                <tr key={index} style={{ textAlign: "center" }}>
                                  <td>
                                    {t(
                                      "page.Manager.TournamentsAdvertising.premiumbanner"
                                    )}
                                  </td>
                                  <td>{element.perday}</td>
                                  {/* <td>{element.discount}</td> */}
                                </tr>
                              )}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Body>
                <div className="tiny-content"
                  dangerouslySetInnerHTML={{
                    __html: content[i18n.resolvedLanguage || "en"],
                  }}
                ></div>
              </Card.Body>
              {enabledPayPal ? (
                <Card.Body>
                  <PayPalScriptProvider options={initialOptions}>
                    <div>
                      <div className="">
                        <div className="product-info">
                          <div className="product-price-btn">
                            <p>
                              <input
                                type="textbox"
                                name="adv_amnt"
                                onChange={handleAmount}
                              />
                            </p>
                            <br></br>
                            <button
                              className="buy-btn btn btn-primary"
                              type="submit"
                              onClick={() => handlebuyCredit()}
                            >
                              Buy Credits
                            </button>

                            <p className="error">{error}</p>

                            {show ? (
                              <PayPalButtons
                                style={{ layout: "vertical" }}
                                createOrder={createOrder}
                                onApprove={onApprove}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PayPalScriptProvider>
                </Card.Body>
              ) : (
                ""
              )}
              <Card.Header>
                {t("page.Manager.TournamentsAdvertising.mycredit")} : {balance}
              </Card.Header>
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
                {t("page.Manager.TournamentsAdvertising.mytransaction")}
              </Card.Header>
              <Card.Body>
                <DataTable
                  data={creditData}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  defaultSortAsc={false}
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
    </>
  );
};

export default Advertising;
