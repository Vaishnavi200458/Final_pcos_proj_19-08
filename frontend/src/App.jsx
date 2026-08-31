// import { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// import LandingPage from "./components/LandingPage";
// import AuthPage from "./components/AuthPage";
// import PredictionForm from "./components/PredictionForm";
// import PredictionResult from "./components/PredictionResult";
// import AIDashboard from "./components/AIDashboard";
// import HealthRecords from "./components/HealthRecords";


// import "./App.css";

// function App() {
//   const [user, setUser] = useState(null);
//   const [result, setResult] = useState(null);
//   const [currentPage, setCurrentPage] = useState("predict");

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setResult(null);
//     setCurrentPage("predict");
//   };

//   const handleNewPrediction = (predictionResult) => {
//     setResult(predictionResult);
//     setCurrentPage("predict");
//   };

//   if (!user) {
//     return <AuthPage setUser={setUser} />;
//   }

//   return (
//     <div className="app">
      
//       {currentPage === "predict" && (
//         <>
//           <header className="hero">
//             <h1>PCOS Health Management System</h1>
//             <p>
//               Predict PCOS risk and view your personalized AI-powered health
//               dashboard.
//             </p>

//             <button className="predict-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </header>

//           <PredictionForm setResult={handleNewPrediction} user={user} />

//           {result && (
//             <PredictionResult
//               result={result}
//               onGoToDashboard={() => setCurrentPage("dashboard")}
//             />
//           )}
//         </>
//       )}

//       {currentPage === "dashboard" && (
//         <AIDashboard
//           result={result}
//           user={user}
//           onPredictClick={() => setCurrentPage("predict")}
//           onRecordsClick={() => setCurrentPage("records")}
//         />
//       )}

//       {currentPage === "records" && (
//         <HealthRecords
//           user={user}
//           onDashboardClick={() => setCurrentPage("dashboard")}
//           onPredictClick={() => setCurrentPage("predict")}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// import LandingPage from "./components/LandingPage";
// import AuthPage from "./components/AuthPage";
// import PredictionForm from "./components/PredictionForm";
// import PredictionResult from "./components/PredictionResult";
// import AIDashboard from "./components/AIDashboard";

// import "./App.css";

// function App() {
//   const [user, setUser] = useState(null);
//   const [result, setResult] = useState(null);
//   const [showDashboard, setShowDashboard] = useState(false);

//   // NEW
//   const [showLanding, setShowLanding] = useState(true);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);

//       // Skip landing if already logged in
//       if (data.user) {
//         setShowLanding(false);
//       }
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);

//         if (session?.user) {
//           setShowLanding(false);
//         }
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();

//     setUser(null);
//     setResult(null);
//     setShowDashboard(false);

//     // Show landing page again
//     setShowLanding(true);
//   };

//   const handleNewPrediction = (predictionResult) => {
//     setResult(predictionResult);
//     setShowDashboard(false);
//   };

//   // -----------------------
//   // Landing Page
//   // -----------------------

//   if (!user && showLanding) {
//     return (
//       <LandingPage
//         onLogin={() => setShowLanding(false)}
//       />
//     );
//   }

//   // -----------------------
//   // Login Page
//   // -----------------------

//   if (!user) {
//     return (
//       <AuthPage
//         setUser={setUser}
//       />
//     );
//   }

//   // -----------------------
//   // Logged In
//   // -----------------------

//   return (
//     <div className="app">

      

//       {!showDashboard && (
//         <>
//           <PredictionForm
//             setResult={handleNewPrediction}
//             user={user}
//           />

//           {result && (
//             <PredictionResult
//               result={result}
//               onGoToDashboard={() =>
//                 setShowDashboard(true)
//               }
//             />
//           )}
//         </>
//       )}

//       {showDashboard && (
//         <AIDashboard
//           result={result}
//           user={user}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


// import { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// import LandingPage from "./components/LandingPage";
// import AuthPage from "./components/AuthPage";
// import PredictionForm from "./components/PredictionForm";
// import PredictionResult from "./components/PredictionResult";
// import AIDashboard from "./components/AIDashboard";
// import HealthRecords from "./components/HealthRecords";

// import "./App.css";

// function App() {
//   const [user, setUser] = useState(null);
//   const [result, setResult] = useState(null);
//   const [currentPage, setCurrentPage] = useState("predict");
//   const [showLanding, setShowLanding] = useState(true);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);

//       if (data.user) {
//         setShowLanding(false);
//       }
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);

//         if (session?.user) {
//           setShowLanding(false);
//         }
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();

//     setUser(null);
//     setResult(null);
//     setCurrentPage("predict");
//     setShowLanding(true);
//   };

//   const handleNewPrediction = (predictionResult) => {
//     setResult(predictionResult);
//     setCurrentPage("predict");
//   };

//   if (!user && showLanding) {
//     return <LandingPage onLogin={() => setShowLanding(false)} />;
//   }

//   if (!user) {
//     return <AuthPage setUser={setUser} />;
//   }

//   return (
//     <div className="app">
//       {currentPage === "predict" && (
//         <>
//           <header className="hero">
//             <h1>PCOS Health Management System</h1>
//             <p>
//               Predict PCOS risk and view your personalized AI-powered health
//               dashboard.
//             </p>

//             <button className="predict-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </header>

//           <PredictionForm setResult={handleNewPrediction} user={user} />

//           {result && (
//             <PredictionResult
//               result={result}
//               onGoToDashboard={() => setCurrentPage("dashboard")}
//             />
//           )}
//         </>
//       )}

//       {currentPage === "dashboard" && (
//         <AIDashboard
//           result={result}
//           user={user}
//           onPredictClick={() => setCurrentPage("predict")}
//           onRecordsClick={() => setCurrentPage("records")}
//         />
//       )}

//       {currentPage === "records" && (
//         <HealthRecords
//           user={user}
//           onDashboardClick={() => setCurrentPage("dashboard")}
//           onPredictClick={() => setCurrentPage("predict")}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// import LandingPage from "./components/LandingPage";
// import AuthPage from "./components/AuthPage";
// import PredictionForm from "./components/PredictionForm";
// import PredictionResult from "./components/PredictionResult";
// import AIDashboard from "./components/AIDashboard";
// import HealthRecords from "./components/HealthRecords";
// import AboutUs from "./components/AboutUs";


// import "./App.css";
// import AppNavbar from "./components/AppNavbar";
// import AppFooter from "./components/AppFooter";
// import Profile from "./components/Profile";
// import HealthSummaryPage from "./components/HealthSummaryPage";
// import { getLatestTrackerEntry } from "./api/trackerApi";
// import { predictPCOS } from "./api/pcosApi";

// function App() {
//   const [user, setUser] = useState(null);
//   const [result, setResult] = useState(null);
//   const [currentPage, setCurrentPage] = useState("predict");
//   const [showLanding, setShowLanding] = useState(true);
//   const [healthSummaryLoading, setHealthSummaryLoading] = useState(false);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);

//       if (data.user) {
//         setShowLanding(false);
//       }
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);

//         if (session?.user) {
//           setShowLanding(false);
//         }
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();

//     setUser(null);
//     setResult(null);
//     setCurrentPage("predict");
//     setShowLanding(true);
//   };

//   const handleNewPrediction = (predictionResult) => {
//     setResult(predictionResult);
//     setCurrentPage("predict");
//   };

//   if (!user && showLanding) {
//     return <LandingPage onLogin={() => setShowLanding(false)} />;
//   }

//   if (!user) {
//     return <AuthPage setUser={setUser} />;
//   }

//   return (
//     <div className="app">
//       {currentPage === "predict" && (
//   <div className="prediction-section">
//     <AppNavbar
//       user={user}
//       currentPage="predict"
//       onDashboardClick={() => setCurrentPage("dashboard")}
//       onPredictClick={() => setCurrentPage("predict")}
//       onHealthSummaryClick={() => setCurrentPage("health-summary")}
//       onRecordsClick={() => setCurrentPage("records")}
//       onAboutClick={() => setCurrentPage("about")}
//       onProfileClick={() => setCurrentPage("profile")}
//       onLogout={handleLogout}
//     />

//     <PredictionForm
//       setResult={handleNewPrediction}
//       user={user}
//     />

//     {result && (
//       <PredictionResult
//         result={result}
//         onGoToDashboard={() => setCurrentPage("dashboard")}
//       />
//     )}
//     <AppFooter />
//   </div>
// )}

//       {currentPage === "dashboard" && (
//         <AIDashboard
//           result={result}
//          user={user}
//          onPredictClick={() => setCurrentPage("predict")}
//          onRecordsClick={() => setCurrentPage("records")}
//           onAboutClick={() => setCurrentPage("about")}
//          onProfileClick={() => setCurrentPage("profile")}
//          onLogout={handleLogout}
//         />
//       )}

//       {currentPage === "records" && (
//        <HealthRecords
//          user={user}
//          onDashboardClick={() => setCurrentPage("dashboard")}
//          onPredictClick={() => setCurrentPage("predict")}
//          onHealthSummaryClick={() => setCurrentPage("health-summary")}
//          onAboutClick={() => setCurrentPage("about")}
//          onLogout={handleLogout}
//          onProfileClick={() => setCurrentPage("profile")}
//        />
//       )}

//       {currentPage === "about" && (
//         <AboutUs
//           user={user}
//           onDashboardClick={() => setCurrentPage("dashboard")}
//           onPredictClick={() => setCurrentPage("predict")}
//           onRecordsClick={() => setCurrentPage("records")}
//           onProfileClick={() => setCurrentPage("profile")}
//         />
//       )}

//       {currentPage === "profile" && (
//        <Profile
//          user={user}
//          setUser={setUser}
//          onDashboardClick={() => setCurrentPage("dashboard")}
//          onPredictClick={() => setCurrentPage("predict")}
//          onHealthSummaryClick={() => setCurrentPage("health-summary")}
//          onRecordsClick={() => setCurrentPage("records")}
//          onAboutClick={() => setCurrentPage("about")}
//          onProfileClick={() => setCurrentPage("profile")}
//          onLogout={handleLogout}
//        />
//       )}
//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import PredictionForm from "./components/PredictionForm";
import PredictionResult from "./components/PredictionResult";
import AIDashboard from "./components/AIDashboard";
import HealthRecords from "./components/HealthRecords";
import AboutUs from "./components/AboutUs";
import AppNavbar from "./components/AppNavbar";
import AppFooter from "./components/AppFooter";
import Profile from "./components/Profile";
import HealthSummaryPage from "./components/HealthSummaryPage";

import { getLatestTrackerEntry } from "./api/trackerApi";
import { predictPCOS } from "./api/pcosApi";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState("predict");
  const [showLanding, setShowLanding] = useState(true);
  const [healthSummaryLoading, setHealthSummaryLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user) {
        setShowLanding(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          setShowLanding(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setResult(null);
    setCurrentPage("predict");
    setShowLanding(true);
  };

  const handleNewPrediction = (predictionResult) => {
    setResult(predictionResult);
    setCurrentPage("predict");
  };

  // =========================================================
  // HEALTH SUMMARY
  // =========================================================

  const handleHealthSummaryClick = async () => {
    try {
      setHealthSummaryLoading(true);

      /*
        If a prediction with XAI data already exists in the
        current session, use it directly.
      */
      if (result?.xai) {
        setCurrentPage("health-summary");
        return;
      }

      /*
        Otherwise load the user's latest saved health record.
      */
      const latestRecord = await getLatestTrackerEntry(user.id);

      if (!latestRecord) {
        alert(
          "No previous health records found. Please complete a PCOS prediction first."
        );

        setCurrentPage("predict");
        return;
      }

      /*
        Reconstruct the original prediction input from
        the latest saved tracker record.
      */
      const latestInput = {
        age: Number(latestRecord.age),
        weight: Number(latestRecord.weight),
        height: Number(latestRecord.height),
        waist: Number(latestRecord.waist),
        hip: Number(latestRecord.hip),

        cycle_regular: latestRecord.cycle_regular,
        cycle_length: Number(latestRecord.cycle_length),

        weight_gain: latestRecord.weight_gain,
        hair_growth: latestRecord.hair_growth,
        skin_darkening: latestRecord.skin_darkening,
        hair_loss: latestRecord.hair_loss,
        pimples: latestRecord.pimples,

        regular_exercise: latestRecord.regular_exercise,
        fast_food: latestRecord.fast_food,
      };

      /*
        Run the saved inputs through the current backend.
        This gives us the prediction + latest SHAP/XAI data.
      */
      const refreshedPrediction = await predictPCOS(latestInput);

      /*
        HealthSummaryPage also needs the original inputs,
        so attach them to the prediction result.
      */
      const healthSummaryResult = {
        ...refreshedPrediction,
        input_data: latestInput,
        tracked_at: latestRecord.created_at,
      };

      setResult(healthSummaryResult);
      setCurrentPage("health-summary");
    } catch (error) {
      console.error("Could not load health summary:", error);

      alert(
        "Could not load your latest health summary. Please make sure the backend is running."
      );
    } finally {
      setHealthSummaryLoading(false);
    }
  };

  // =========================================================
  // PUBLIC PAGES
  // =========================================================

  if (!user && showLanding) {
    return (
      <LandingPage
        onLogin={() => setShowLanding(false)}
      />
    );
  }

  if (!user) {
    return <AuthPage setUser={setUser} />;
  }

  // =========================================================
  // LOGGED-IN APPLICATION
  // =========================================================

  return (
    <div className="app">

      {/* ================= PREDICT PCOS ================= */}

      {currentPage === "predict" && (
        <div className="prediction-section">
          <AppNavbar
            user={user}
            currentPage="predict"
            onDashboardClick={() =>
              setCurrentPage("dashboard")
            }
            onPredictClick={() =>
              setCurrentPage("predict")
            }
            onHealthSummaryClick={
              handleHealthSummaryClick
            }
            onRecordsClick={() =>
              setCurrentPage("records")
            }
            onAboutClick={() =>
              setCurrentPage("about")
            }
            onProfileClick={() =>
              setCurrentPage("profile")
            }
            onLogout={handleLogout}
          />

          <PredictionForm
            setResult={handleNewPrediction}
            user={user}
          />

          {result && (
            <PredictionResult
              result={result}
              onGoToDashboard={() =>
                setCurrentPage("dashboard")
              }
            />
          )}

          <AppFooter />
        </div>
      )}

      {/* ================= DASHBOARD ================= */}

      {currentPage === "dashboard" && (
        <AIDashboard
          result={result}
          user={user}
          onPredictClick={() =>
            setCurrentPage("predict")
          }
          onHealthSummaryClick={
            handleHealthSummaryClick
          }
          onRecordsClick={() =>
            setCurrentPage("records")
          }
          onAboutClick={() =>
            setCurrentPage("about")
          }
          onProfileClick={() =>
            setCurrentPage("profile")
          }
          onLogout={handleLogout}
        />
      )}

      {/* ================= HEALTH SUMMARY ================= */}

      {currentPage === "health-summary" && (
       <HealthSummaryPage
         result={result}
         user={user}
         onBack={() => setCurrentPage("predict")}
         onDashboard={() => setCurrentPage("dashboard")}
         onPredictClick={() => setCurrentPage("predict")}
         onHealthSummaryClick={handleHealthSummaryClick}
         onRecordsClick={() => setCurrentPage("records")}
         onAboutClick={() => setCurrentPage("about")}
         onProfileClick={() => setCurrentPage("profile")}
         onLogout={handleLogout}
        />
      )}

      {/* ================= MY RECORDS ================= */}

      {currentPage === "records" && (
        <HealthRecords
          user={user}
          onDashboardClick={() =>
            setCurrentPage("dashboard")
          }
          onPredictClick={() =>
            setCurrentPage("predict")
          }
          onHealthSummaryClick={
            handleHealthSummaryClick
          }
          onAboutClick={() =>
            setCurrentPage("about")
          }
          onLogout={handleLogout}
          onProfileClick={() =>
            setCurrentPage("profile")
          }
        />
      )}

      {/* ================= ABOUT US ================= */}

      {currentPage === "about" && (
        <AboutUs
          user={user}
          onDashboardClick={() =>
            setCurrentPage("dashboard")
          }
          onPredictClick={() =>
            setCurrentPage("predict")
          }
          onHealthSummaryClick={
            handleHealthSummaryClick
          }
          onRecordsClick={() =>
            setCurrentPage("records")
          }
          onAboutClick={() =>
            setCurrentPage("about")
          }
          onProfileClick={() =>
            setCurrentPage("profile")
          }
          onLogout={handleLogout}
        />
      )}

      {/* ================= PROFILE ================= */}

      {currentPage === "profile" && (
        <Profile
          user={user}
          setUser={setUser}
          onDashboardClick={() =>
            setCurrentPage("dashboard")
          }
          onPredictClick={() =>
            setCurrentPage("predict")
          }
          onHealthSummaryClick={
            handleHealthSummaryClick
          }
          onRecordsClick={() =>
            setCurrentPage("records")
          }
          onAboutClick={() =>
            setCurrentPage("about")
          }
          onProfileClick={() =>
            setCurrentPage("profile")
          }
          onLogout={handleLogout}
        />
      )}

      {/* ================= LOADING OVERLAY ================= */}

      {healthSummaryLoading && (
        <div className="health-summary-loading">
          Loading your latest health summary...
        </div>
      )}
    </div>
  );
}

export default App;