import styles from "./Settings.module.css";
import { NavLink, Route, Switch } from "react-router-dom";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

const Settings = () => {
  return (
    <>
      <div className={styles.settingContainer}>
        <div className={styles.settingNav}>
          <NavLink
            to="/settings/edit"
            exact={true}
            activeClassName={styles.activeLink}
          >
            Edit profile
          </NavLink>
          <NavLink
            to="/settings/password"
            exact={true}
            activeClassName={styles.activeLink}
          >
            Change password
          </NavLink>
        </div>
        <div className={styles.settingOption}>
          <Switch>
            <Route path="/settings/edit">
              <EditProfile />
            </Route>
            <Route path="/settings/password">
              <ChangePassword />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Settings;
