// import { useState } from "react";
// import { supabase } from "../supabaseClient";
// import Login from "./Login";
// import Signup from "./Signup";

// import AboutUs from "./AboutUs";

// function AuthPage({ setUser }) {
//   const [view, setView] = useState("login"); // "login" | "signup" | "about"
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleAuth = async (e) => {
//     e.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     if (password.length < 8) {
//       alert("Password must be at least 8 characters long.");
//       return;
//     }

//     if (!/[A-Z]/.test(password)) {
//       alert("Password must contain at least one uppercase letter.");
//       return;
//     }

//     if (!/[a-z]/.test(password)) {
//       alert("Password must contain at least one lowercase letter.");
//       return;
//     }

//     if (!/[0-9]/.test(password)) {
//       alert("Password must contain at least one number.");
//       return;
//     }

//     if (!/[!@#$%^&*]/.test(password)) {
//       alert("Password must contain at least one special character.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = view === "login"
//         ? await supabase.auth.signInWithPassword({ email, password })
//         : await supabase.auth.signUp({ email, password });

//       if (response.error) {
//         alert(response.error.message);
//         return;
//       }

//       const { data } = await supabase.auth.getUser();
//       setUser(data.user);

//       if (view === "signup") {
//         alert("Signup successful. Please check your email if confirmation is required.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (view === "about") {
//     return <AboutUs onNavigateToLogin={() => setView("login")} onNavigateToSignup={() => setView("signup")} />;
//   }

//   return view === "login" ? (
//     <Login 
//       email={email} 
//       setEmail={setEmail} 
//       password={password} 
//       setPassword={setPassword} 
//       onSubmit={handleAuth} 
//       onSwitchToSignup={() => setView("signup")}
//       onSwitchToAboutUs={() => setView("about")}
//       isLoading={isLoading}
//     />
//   ) : (
//     <Signup
//       email={email}
//       setEmail={setEmail}
//       password={password}
//       setPassword={setPassword}
//       onSubmit={handleAuth}
//       onSwitchToLogin={() => setView("login")}
//       onSwitchToAboutUs={() => setView("about")}
//       isLoading={isLoading}
//     />
//   );
// }

// export default AuthPage;


import { useState } from "react";
import { supabase } from "../supabaseClient";

import Login from "./Login";
import Signup from "./Signup";
import AboutUs from "./AboutUs";

function AuthPage({ setUser }) {
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e, fullName = "") => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    /*
      LOGIN:
      Only require a password.

      SIGNUP:
      Apply strong password validation.
    */
    if (view === "signup") {
      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least one uppercase letter.");
        return;
      }

      if (!/[a-z]/.test(password)) {
        alert("Password must contain at least one lowercase letter.");
        return;
      }

      if (!/[0-9]/.test(password)) {
        alert("Password must contain at least one number.");
        return;
      }

      if (!/[!@#$%^&*]/.test(password)) {
        alert("Password must contain at least one special character.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (view === "login") {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          alert(error.message);
          return;
        }

        setUser(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,

          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          alert(error.message);
          return;
        }

        /*
          If email confirmation is OFF,
          Supabase normally gives us a session immediately.
        */
        if (data.session && data.user) {
          setUser(data.user);
        } else {
          /*
            If email confirmation is ON,
            the user must confirm their email first.
          */
          alert(
            "Signup successful. Please check your email and confirm your account before logging in."
          );

          setView("login");
          setPassword("");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /*
    Public About Us page
    Accessible before login.
  */
  if (view === "about") {
    return (
      <AboutUs
        publicView={true}
        onNavigateToLogin={() => setView("login")}
        onNavigateToSignup={() => setView("signup")}
      />
    );
  }

  if (view === "login") {
    return (
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleAuth}
        onSwitchToSignup={() => {
          setPassword("");
          setView("signup");
        }}
        onSwitchToAboutUs={() => setView("about")}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Signup
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleAuth}
      onSwitchToLogin={() => {
        setPassword("");
        setView("login");
      }}
      onSwitchToAboutUs={() => setView("about")}
      isLoading={isLoading}
    />
  );
}

export default AuthPage;