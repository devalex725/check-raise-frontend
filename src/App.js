import "./App.scss";
import React from "react";

import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Contact from "./Pages/Contact/Contact";
import Home from "./Pages/Home";
import Info from "./Pages/Info/Info";
import MyRoomManager from "./Pages/Manager/AllRooms/EditRooms/EditRooms";
import MyAddTournament from "./Pages/Manager/AllTournaments/AddTournament/AddTournament";

import MyEditTournament from "./Pages/Manager/AllTournaments/EditTournament/EditTournament";
import MycheckinTournament from "./Pages/Manager/AllTournaments/CheckInTournament/CheckInTournament";
import MyTournaments from "./Pages/Manager/AllTournaments/AllTournaments";
import MyPlayersManager from "./Pages/Manager/MyPlayers/MyPlayers";
import AddPlayersManager from "./Pages/Manager/MyPlayers/AddPlayer";

import MyProfile from "./Pages/Manager/MyProfile/MyProfile";
import AdvertisingManager from "./Pages/Manager/Advertising/Advertising";
import SettingsManager from "./Pages/Manager/Settings/Settings";
import PlayerStatisticsManager from "./Pages/Manager/PlayersStatistics/PlayersStatistics";
import InfoStatisticsManager from "./Pages/Manager/PlayersStatistics/InfoStatistics";

import RoomsStatisticsManager from "./Pages/Manager/RoomsStatistics/RoomsStatistics";
import Subscription from "./Pages/Manager/Subscription/Subscription";
import AddNewTournamentDirector from "./Pages/Manager/TournamentDirectors/AddNewTournamentDirector/AddNewTournamentDirector";
import TournamentDirectors from "./Pages/Manager/TournamentDirectors/TournamentDirectors";
import TournamentsLog from "./Pages/Manager/TournamentsLog/TournamentsLog";
import Advertising from "./Pages/Manager/Advertising/Advertising";
import Banner from "./Pages/Manager/Banner/Banner";
import EditBanner from "./Pages/Manager/Banner/EditBanner";
import Announce from "./Pages/Manager/Announce/Announce";
import EditAnnounce from "./Pages/Manager/Announce/EditAnnounce";

import AddBanner from "./Pages/Manager/Banner/AddBanner";
import PremiumTournament from "./Pages/Manager/PremiumTournament/PremiumTournament";
import AddPremiumTournament from "./Pages/Manager/PremiumTournament/AddPremiumTournament";
import EditPremiumTournament from "./Pages/Manager/PremiumTournament/EditPremiumTournament";

import Setting from "./Pages/Manager/Setting/Setting";
import ManagerRegistration from "./Pages/ManagerRegistration/ManagerRegistration";
import AllPlayers from "./Pages/MyProfile/AllPlayers/AllPlayers";
import AllPlayersRoom from "./Pages/MyProfile/AllRooms/AllRooms";
// import AllRooms from './Pages/Manager/AllRooms/AllRooms';

import AddRoom from "./Pages/Manager/AllRooms/AddRoom/AddRoom";
import EditManager from "./Pages/MyProfile/AllRooms/EditManager/EditManager";
import EditRooms from "./Pages/MyProfile/AllRooms/EditRooms/EditRooms";
import AddTournament from "./Pages/MyProfile/AllTournaments/AddTournament/AddTournament";
import EditDirectorTournament from "./Pages/MyProfile/AllTournaments/EditDirectorTournament/EditDirectorTournament";
import AllTournaments from "./Pages/MyProfile/AllTournaments/AllTournaments";
import CheckInDirectorTournament from "./Pages/MyProfile/CheckInTournament/CheckInTournament";
import Newsletters from "./Pages/MyProfile/Newsletters/Newsletters";
import Notifications from "./Pages/MyProfile/Notifications/Notifications";
import PlayersStatistics from "./Pages/MyProfile/PlayersStatistics/PlayersStatistics";
import RoomsStatistics from "./Pages/MyProfile/RoomsStatistics/RoomsStatistics";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import PublicAdvertising from "./Pages/Advertising/Advertising";
import Room from "./Pages/Room/Room";
import SetupSmtp from "./Pages/SetupSmtp/SetupSmtp";
import Terms from "./Pages/Terms/Terms";
import TournamentsDetails from "./Pages/TournamentsDetails/TournamentsDetails";
import ForgotPassword from "./Pages/User/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/User/ResetPassword";
import Login from "./Pages/User/Login/Login";
import Registration from "./Pages/User/Registration/Registration";
//admin

import AdminLogin from "./Pages/Admin/AdminLogin/AdminLogin";
import AdminSideBar from "./Pages/Admin/Components/AdminSideBar/AdminSideBar";
import AdminContact from "./Pages/Admin/ContactScreen/Contact";
import AdminContactEdit from "./Pages/Admin/ContactScreen/EditContact";
import AdminRoomsStatistics from "./Pages/Admin/RoomsStatistics/RoomsStatistics";
import AdminPlayersStatistics from "./Pages/Admin/PlayersStatistics/PlayersStatistics";
import AdminInfoStatistics from "./Pages/Admin/PlayersStatistics/InfoStatistics";

import AdminNotification from "./Pages/Admin/Notification/Notification";
import AdminNotificationEdit from "./Pages/Admin/Notification/EditNotification";

import AdminRoom from "./Pages/Admin/Room/Room";
import AdminEditRoom from "./Pages/Admin/Room/EditRooms/EditRooms";
import AdminAddRoom from "./Pages/Admin/Room/AddRoom";
import AdminTournament from "./Pages/Admin/Tournament/Tournament";
import AdminEditTournament from "./Pages/Admin/Tournament/EditTournament/EditTournament";

import AdminAddTournament from "./Pages/Admin/Tournament/Addtournament";

// Pages
import Pages from "./Pages/Admin/Pages";
import AdminSubscription from "./Pages/Admin/Pages/Subscription";
import AdminRMAdvertising from "./Pages/Admin/Pages/RMAdvertising";
import AdminAdvertising from "./Pages/Admin/Pages/Advertising";
import AdminInfo from "./Pages/Admin/Pages/Info";
import AdminTerms from "./Pages/Admin/Pages/Terms";
import AdminPrivacy from "./Pages/Admin/Pages/Privacy"

import AdminPlayer from "./Pages/Admin/Player/Player";

import AdminSetting from "./Pages/Admin/Settings/Settings";
import AdminSettings from "./Pages/Admin/Settings/banner";

import EditAdminSetting from "./Pages/Admin/Settings/EditBannerSettings";
import AdminBannersetting from "./Pages/Admin/Settings/BannerSetting";
import AdminAdvertisingsetting from "./Pages/Admin/Settings/AdminAdvertising";

import AdminEmailLogs from "./Pages/Admin/EmailLogs/EmailLogs";
import AdminDiscount from "./Pages/Admin/Discount/Discount";
import AdminTransaction from "./Pages/Admin/Transaction/Transaction";
import AdminEditTransaction from "./Pages/Admin/Transaction/EditTransaction";

import AdminAddDiscount from "./Pages/Admin/Discount/AddDiscount";
import AdminEditDiscount from "./Pages/Admin/Discount/EditDiscount";
import PlayerTournaments from "./Pages/Player/MyTournaments/PlayerTournaments";
import MyPlayerProfile from "./Pages/Player/MyProfile/MyProfile";
import PlayerNotifications from "./Pages/Player/Notifications/Notifications";
import AdminUser from "./Pages/Admin/User/User";
import AdminEditUser from "./Pages/Admin/Player/EditPlayer";

import AdminAddPlayer from "./Pages/Admin/AddPlayer/AddPlayer";
import AdminBanners from "./Pages/Admin/Pages/Banners";
import AdminEditBanner from "./Pages/Admin/Pages/EditBanner";
import AdminPremiumTournaments from "./Pages/Admin/Pages/PremiumTournaments";
import AdminCookieConsent from "./Pages/Admin/Pages/CookieConsent";
import CookieConsent from "./components/CookieConsent";

function App() {
  const AdminLayout = () => <Outlet />;
  const LoginLayout = () => (
    <div>
      <Header />
      <CookieConsent />
      <Outlet />
      <Footer />
    </div>
  );
  const SidebarLayout = () => (
    <>
      <div className="admin-layout">
        <div className="admin-wrapper">
          <header className="header">
            <div className="header-wrapper">
              <div className="header-content">
                <AdminSideBar />
              </div>
            </div>
          </header>

          <div id="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/info" element={<Info />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              // path="/tournaments-details/:id"
              path="/tournaments/:room/:slug"
              element={<TournamentsDetails />}
            />
            <Route path="/room/:id" element={<Room />} />
            <Route
              path="/director/all-tournaments"
              element={<AllTournaments />}
            />

            <Route path="/all-rooms" element={<AllPlayersRoom />} />
            <Route path="/manager/add-room" element={<AddRoom />} />
            <Route path="/all-players" element={<AllPlayers />} />
            <Route path="/players-statistics" element={<PlayersStatistics />} />
            <Route path="/rooms-statistics" element={<RoomsStatistics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/newsletters" element={<Newsletters />} />
            <Route path="/edit-rooms" element={<EditRooms />} />
            <Route path="/edit-profile" element={<EditManager />} />
            <Route path="/director/addTournament" element={<AddTournament />} />
            <Route
              path="/director/edit/:id"
              element={<EditDirectorTournament />}
            />
            <Route
              path="/director/checkin/:id"
              element={<CheckInDirectorTournament />}
            />
            <Route path="/setup-smtp" element={<SetupSmtp />} />
            <Route
              path="/manager-registration"
              element={<ManagerRegistration />}
            />
            <Route path="/manager/my-tournaments" element={<MyTournaments />} />
            <Route
              path="/player/my-tournaments"
              element={<PlayerTournaments />}
            />
            <Route
              path="/manager/addTournament"
              element={<MyAddTournament />}
            />
            <Route
              path="/manager/editTournament/:id"
              element={<MyEditTournament />}
            />
            <Route
              path="/manager/checkin-tournament/:id"
              element={<MycheckinTournament />}
            />
            <Route path="/manager/my-profile" element={<MyProfile />} />
            <Route path="/player/my-profile" element={<MyPlayerProfile />} />
            <Route path="/manager/my-room" element={<MyRoomManager />} />
            <Route path="/manager/players" element={<MyPlayersManager />} />
            <Route path="/manager/addplayer" element={<AddPlayersManager />} />
            <Route
              path="/manager/tournament-directors"
              element={<TournamentDirectors />}
            />
            <Route
              path="/manager/tournaments-log"
              element={<TournamentsLog />}
            />
            <Route
              path="/manager/rooms-statistics"
              element={<RoomsStatisticsManager />}
            />
            <Route
              path="/manager/player-statistics"
              element={<PlayerStatisticsManager />}
            />
            <Route
              path="/manager/infoStatistics/:id"
              element={<InfoStatisticsManager />}
            />
            <Route
              path="/manager/tournament-directors/add-new-tournament-director"
              element={<AddNewTournamentDirector />}
            />
            <Route
              path="/manager/payment-subscription"
              element={<Subscription />}
            />
            <Route
              path="/manager/advertising"
              element={<AdvertisingManager />}
            />
            <Route path="/manager/banner" element={<Banner />} />
            <Route path="/manager/announce" element={<Announce />} />
            <Route
              path="/manager/editannounce/:id"
              element={<EditAnnounce />}
            />
            <Route path="/manager/editbanner/:id" element={<EditBanner />} />

            <Route path="/manager/addbanner" element={<AddBanner />} />
            <Route
              path="/manager/premium-tournament"
              element={<PremiumTournament />}
            />
            <Route
              path="/manager/addpremium-tournament"
              element={<AddPremiumTournament />}
            />
            <Route
              path="/manager/editpremium-tournament/:id"
              element={<EditPremiumTournament />}
            />
            <Route path="/manager/settings" element={<SettingsManager />} />

            {/* <Route path='/manager/advertising' element={<Advertising />} /> */}
            <Route path="/manager/setting" element={<Setting />} />
            <Route
              path="/player/notifications"
              element={<PlayerNotifications />}
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/advertising" element={<PublicAdvertising />} />
          </Route>
          <Route element={<AdminLayout />}>
            {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
            <Route element={<SidebarLayout />}>
              <Route path="/admin/home" element={<Home />} />

              {/* Pages */}
              <Route path="/admin/pages" element={<Pages />} />
              <Route
                path="/admin/pages/subscription"
                element={<AdminSubscription />}
              />
              <Route
                path="/admin/pages/rm-advertising"
                element={<AdminRMAdvertising />}
              />
              <Route
                path="/admin/pages/advertising"
                element={<AdminAdvertising />}
              />
              <Route path="/admin/pages/info" element={<AdminInfo />} />
              <Route path="/admin/pages/terms" element={<AdminTerms />} />
              <Route path="/admin/pages/privacy-policy" element={<AdminPrivacy />} />
              <Route path="/admin/pages/banners" element={<AdminBanners />} />
              <Route path="/admin/pages/banners/:id" element={<AdminEditBanner />} />
              <Route path="/admin/pages/premium-tournaments" element={<AdminPremiumTournaments />} />
              <Route path="/admin/pages/cookie-consent" element={<AdminCookieConsent />} />

              <Route path="/admin/contact" element={<AdminContact />} />
              {/* Room Routes Start */}
              <Route path="/admin/room" element={<AdminRoom />} />
              <Route path="/admin/room/edit/:id" element={<AdminEditRoom />} />
              {/* Room Routes End */}
              <Route path="/admin/tournament" element={<AdminTournament />} />
              <Route
                path="/admin/editTournament/:id"
                element={<AdminEditTournament />}
              />
              <Route
                path="/admin/addtournament"
                element={<AdminAddTournament />}
              />
              <Route
                path="/admin/rooms-statistics"
                element={<AdminRoomsStatistics />}
              />
              <Route
                path="/admin/player-statistics"
                element={<AdminPlayersStatistics />}
              />
              <Route
                path="/admin/infoStatistics/:id"
                element={<AdminInfoStatistics />}
              />
              <Route
                path="/admin/notification"
                element={<AdminNotification />}
              />
              <Route path="/admin/player" element={<AdminPlayer />} />
              <Route path="/admin/addroom" element={<AdminAddRoom />} />
              <Route path="/admin/setting" element={<AdminSetting />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route
                path="/admin/bannersetting"
                element={<AdminBannersetting />}
              />
              <Route
                path="/admin/advertisesetting"
                element={<AdminAdvertisingsetting />}
              />

              <Route
                path="/admin/editsetting/:id"
                element={<EditAdminSetting />}
              />
              <Route path="/admin/emaillogs" element={<AdminEmailLogs />} />
              <Route path="/admin/discount" element={<AdminDiscount />} />
              <Route path="/admin/transaction" element={<AdminTransaction />} />
              <Route
                path="/admin/edittransaction/:id"
                element={<AdminEditTransaction />}
              />

              <Route path="/admin/adddiscount" element={<AdminAddDiscount />} />
              <Route
                path="/admin/editdiscount/:id"
                element={<AdminEditDiscount />}
              />

              <Route
                path="/admin/contact/edit/:id"
                element={<AdminContactEdit />}
              />
              <Route
                path="/admin/notification/edit/:id"
                element={<AdminNotificationEdit />}
              />
              <Route path="/admin/user/:type" element={<AdminUser />} />
              <Route path="/admin/user/edit/:id" element={<AdminEditUser />} />
              <Route
                path="/admin/addplayer/:type"
                element={<AdminAddPlayer />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
