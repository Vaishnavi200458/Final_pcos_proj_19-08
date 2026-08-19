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

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import PredictionForm from "./components/PredictionForm";
import PredictionResult from "./components/PredictionResult";
import AIDashboard from "./components/AIDashboard";
import HealthRecords from "./components/HealthRecords";
import AboutUs from "./components/AboutUs";

import "./App.css";
import AppNavbar from "./components/AppNavbar";
import AppFooter from "./components/AppFooter";

function App() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState("predict");
  const [showLanding, setShowLanding] = useState(true);

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

  if (!user && showLanding) {
    return <LandingPage onLogin={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <AuthPage setUser={setUser} />;
  }

  return (
    <div className="app">
      {currentPage === "predict" && (
  <div className="prediction-section">
    <AppNavbar
      user={user}
      currentPage="predict"
      onDashboardClick={() => setCurrentPage("dashboard")}
      onPredictClick={() => setCurrentPage("predict")}
      onHealthSummaryClick={() => setCurrentPage("health-summary")}
      onRecordsClick={() => setCurrentPage("records")}
      onAboutClick={() => setCurrentPage("about")}
      onLogout={handleLogout}
    />

    <PredictionForm
      setResult={handleNewPrediction}
      user={user}
    />

    {result && (
      <PredictionResult
        result={result}
        onGoToDashboard={() => setCurrentPage("dashboard")}
      />
    )}
    <AppFooter />
  </div>
)}

      {currentPage === "dashboard" && (
        <AIDashboard
          result={result}
          user={user}
          onPredictClick={() => setCurrentPage("predict")}
          onRecordsClick={() => setCurrentPage("records")}
          onAboutClick={() => setCurrentPage("about")}
        />
      )}

      {currentPage === "records" && (
        <HealthRecords
          user={user}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onPredictClick={() => setCurrentPage("predict")}
          onAboutClick={() => setCurrentPage("about")}
        />
      )}

      {currentPage === "about" && (
        <AboutUs
          user={user}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onPredictClick={() => setCurrentPage("predict")}
          onRecordsClick={() => setCurrentPage("records")}
        />
      )}
    </div>
  );
}

export default App;