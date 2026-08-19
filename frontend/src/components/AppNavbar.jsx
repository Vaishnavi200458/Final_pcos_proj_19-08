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
//   <div className="profile-container">
//   <div
//     className="profile-circle"
//     onClick={() => setShowMenu(!showMenu)}
//   >
//     {userName.charAt(0).toUpperCase()}
//   </div>

//   {showMenu && (
//     <div className="profile-dropdown">
//       <button
//   className="logout-btn"
//   onClick={onLogout}
// >
//   Log Out
// </button>
//     </div>
//   )}
// </div>

//   {showMenu && (
//   <div className="profile-dropdown">
//     <button
//       type="button"
//       className="logout-btn"
//       onClick={() => {
//         console.log("BUTTON CLICKED");
//         setShowMenu(false);
//         onLogout();
//       }}
//     >
//       Log Out
//     </button>
//   </div>
// )}

// export default AppNavbar;
import React, { useState } from "react";

function AppNavbar({
  user,
  currentPage,
  onDashboardClick,
  onPredictClick,
  onHealthSummaryClick,
  onRecordsClick,
  onAboutClick,
  onLogout,
}) {
  const userName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  const [showMenu, setShowMenu] = useState(false);

  const handleLogoutClick = () => {
    console.log("BUTTON CLICKED");
    setShowMenu(false);

    if (onLogout) {
      onLogout();
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
          className={
            currentPage === "dashboard"
              ? "active-nav"
              : ""
          }
          onClick={onDashboardClick}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={
            currentPage === "predict"
              ? "active-nav"
              : ""
          }
          onClick={onPredictClick}
        >
          Predict PCOS
        </button>

        <button
          type="button"
          className={
            currentPage === "health-summary"
              ? "active-nav"
              : ""
          }
          onClick={onHealthSummaryClick}
        >
          Health Summary
        </button>

        <button
          type="button"
          className={
            currentPage === "records"
              ? "active-nav"
              : ""
          }
          onClick={onRecordsClick}
        >
          My Records
        </button>

        <button
          type="button"
          className={
            currentPage === "about"
              ? "active-nav"
              : ""
          }
          onClick={onAboutClick}
        >
          About Us
        </button>
      </div>

      <div className="profile-container">
        <button
          type="button"
          className="profile-circle"
          onClick={() => setShowMenu((previous) => !previous)}
          aria-label="Open profile menu"
        >
          {userName.charAt(0).toUpperCase()}
        </button>

        {showMenu && (
          <div className="profile-dropdown">
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogoutClick}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AppNavbar;