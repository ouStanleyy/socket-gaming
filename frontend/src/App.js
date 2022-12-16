import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import SignUpForm from "./components/auth/SignUpForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/NavBar/NavBar";
import { authenticate } from "./store/session";
import { setSocket } from "./store/socket";
import Splash from "./components/Splash/Splash";
import { Messages } from "./components/Messages";
import styles from "./App.module.css";
import { GameDisplay } from "./components/Games";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const socket = io();

      dispatch(setSocket(socket));

      // socket.on("connect", (data) => {
      //   if (data) {
      //     // console.log("sid", data);
      //     // setSid(data?.sid);
      //   }
      // });

      return () => socket.disconnect();
    }
  }, [user]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      {user && <NavBar />}
      <Switch>
        <Route path="/" exact={true}>
          {user ? <h1>Homepage</h1> : <Splash />}
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/messages">
          <div className={styles.innerBody}>
            <Messages user={user} />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path="/games">
          <div className={styles.innerBody}>
            <GameDisplay />
          </div>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
