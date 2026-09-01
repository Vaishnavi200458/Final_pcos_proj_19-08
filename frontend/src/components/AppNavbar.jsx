// import React, { useState } from "react";

// function AppNavbar({
//   user,
//   currentPage,
//   onDashboardClick,
//   onPredictClick,
//   onHealthSummaryClick,
//   onRecordsClick,
//   onAboutClick,
//   onLogout,
// }) {
//   const userName =
//     user?.user_metadata?.full_name ||
//     user?.email ||
//     "User";

//   const [showMenu, setShowMenu] = useState(false);

//   const handleLogoutClick = () => {
//     console.log("BUTTON CLICKED");
//     setShowMenu(false);

//     if (onLogout) {
//       onLogout();
//     }
//   };

//   return (
//     <nav className="dashboard-nav">
//       <div
//         className="brand"
//         onClick={onDashboardClick}
//         style={{ cursor: "pointer" }}
//       >
//         PCOSense
//       </div>

//       <div className="nav-links">
//         <button
//           type="button"
//           className={
//             currentPage === "dashboard"
//               ? "active-nav"
//               : ""
//           }
//           onClick={onDashboardClick}
//         >
//           Dashboard
//         </button>

//         <button
//           type="button"
//           className={
//             currentPage === "predict"
//               ? "active-nav"
//               : ""
//           }
//           onClick={onPredictClick}
//         >
//           Predict PCOS
//         </button>

//         <button
//           type="button"
//           className={
//             currentPage === "health-summary"
//               ? "active-nav"
//               : ""
//           }
//           onClick={onHealthSummaryClick}
//         >
//           Health Summary
//         </button>

//         <button
//           type="button"
//           className={
//             currentPage === "records"
//               ? "active-nav"
//               : ""
//           }
//           onClick={onRecordsClick}
//         >
//           My Records
//         </button>

//         <button
//           type="button"
//           className={
//             currentPage === "about"
//               ? "active-nav"
//               : ""
//           }
//           onClick={onAboutClick}
//         >
//           About Us
//         </button>
//       </div>

//       <div className="profile-container">
//         <button
//           type="button"
//           className="profile-circle"
//           onClick={() => setShowMenu((previous) => !previous)}
//           aria-label="Open profile menu"
//         >
//           {userName.charAt(0).toUpperCase()}
//         </button>

//         {showMenu && (
//           <div className="profile-dropdown">
//             <button
//               type="button"
//               className="logout-btn"
//               onClick={handleLogoutClick}
//             >
//               Log Out
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default AppNavbar;

import React, { useState } from "react";
import { User, FileText, LogOut, ChevronDown } from "lucide-react";

function AppNavbar({
  user,
  currentPage,
  onDashboardClick,
  onPredictClick,
  onHealthSummaryClick,
  onRecordsClick,
  onAboutClick,
  onProfileClick,
  onLogout,
  onMealAnalyzerClick,
}) {
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail = user?.email || "";

  const [showMenu, setShowMenu] = useState(false);

  const handleLogoutClick = () => {
    setShowMenu(false);

    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setShowMenu(false);

    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleRecordsClick = () => {
    setShowMenu(false);

    if (onRecordsClick) {
      onRecordsClick();
    }
  };

  return (
    <nav className="dashboard-nav">
      <div
        className="brand"
        onClick={onDashboardClick}
        style={{ cursor: "pointer" }}
      >
        PCOSense
      </div>

      <div className="nav-links">
        <button
          type="button"
          className={currentPage === "dashboard" ? "active-nav" : ""}
          onClick={onDashboardClick}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={currentPage === "predict" ? "active-nav" : ""}
          onClick={onPredictClick}
        >
          Predict PCOS
        </button>

        <button
          type="button"
          className={currentPage === "health-summary" ? "active-nav" : ""}
          onClick={onHealthSummaryClick}
        >
          Health Summary
        </button>

        <button
          type="button"
          className={currentPage === "records" ? "active-nav" : ""}
          onClick={onRecordsClick}
        >
          My Records
        </button>

        <button
          type="button"
          className={currentPage === "meal-analyzer" ? "active-nav" : ""}
         onClick={onMealAnalyzerClick}
        >
         Meal Analyzer
        </button>

        <button
          type="button"
          className={currentPage === "about" ? "active-nav" : ""}
          onClick={onAboutClick}
        >
          About Us
        </button>
      </div>

      <div className="profile-container">
        <button
          type="button"
          className="profile-trigger"
          onClick={() => setShowMenu((previous) => !previous)}
          aria-label="Open profile menu"
        >
          <span className="profile-circle">
            {userName.charAt(0).toUpperCase()}
          </span>

          <ChevronDown
            size={16}
            className={`profile-chevron ${showMenu ? "open" : ""}`}
          />
        </button>

        {showMenu && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <div className="profile-dropdown-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="profile-dropdown-user">
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </div>
            </div>

            <div className="profile-dropdown-divider"></div>

            <button
              type="button"
              className="profile-menu-item"
              onClick={handleProfileClick}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              className="profile-menu-item"
              onClick={handleRecordsClick}
            >
              <FileText size={18} />
              <span>My Records</span>
            </button>

            <div className="profile-dropdown-divider"></div>

            <button
              type="button"
              className="profile-menu-item logout-menu-item"
              onClick={handleLogoutClick}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AppNavbar;