import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { authenticate } from "./store/session";
import { setSocket } from "./store/socket";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/NavBar/NavBar";
import Splash from "./components/Splash/Splash";
import { Messages, SideMessages } from "./components/Messages";
import { GamesList, GameLobby } from "./components/Games";
import { Settings } from "./components/Settings";
import { Shop } from "./components/Shop";
import { UserProfile } from "./components/Users";
import styles from "./App.module.css";

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

      // socket.on("connect", () => {
      //   dispatch();
      // });

      return () => socket.disconnect();
    }
  }, [user]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      {user && (
        <>
          <NavBar />
          <SideMessages />
        </>
      )}
      <Switch>
        <Route exact path="/">
          {user ? <h1>Homepage</h1> : <Splash />}
        </Route>
        {/* <ProtectedRoute path="/messages">
          <div className={styles.innerBody}>
            <Messages />
          </div>
        </ProtectedRoute> */}
        <ProtectedRoute exact path="/games">
          <div className={styles.innerBody}>
            <GamesList />
          </div>
        </ProtectedRoute>
        <ProtectedRoute exact path="/shop">
          <div className={styles.innerBody}>
            <Shop />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path="/games/:gameId">
          <div className={styles.innerBody}>
            <GameLobby />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId">
          <div className={styles.innerBody}>
            <UserProfile />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path="/settings">
          <div className={styles.innerBody}>
            <Settings />
          </div>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
