import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NavItem from "./NavItem";
import styles from "./NavBar.module.css";
import MoreItem from "./MoreItem";
import { logout } from "../../store/session";
import Search from "../Search/Search";

const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);
  const [inactiveFn, setInactiveFn] = useState(false);
  const searchRef = useRef(null);
  const moreRef = useRef(null);
  const refSearchBar = useRef(null);
  const user = useSelector((state) => state.session.user);
  const links = [
    // { icon: "Icon", path: "/games" },
    { icon: "Logo", path: "/games" },
    // { icon: "Home", path: "/" },
    { icon: "Search", path: "/search" },
    { icon: "Messages", path: "/messages" },
    // { icon: "Notifications", path: "/notifications" },
    { icon: "Games", path: "/games" },
    { icon: "Shop", path: "/shop" },
    { icon: "Profile", path: `/users/${user.id}` },
    { icon: "Coin", path: "#" },
    { icon: "More", path: "#" },
  ];

  const loggedInNav = (
    <>
      <li>
        <NavLink to="/login" exact={true} activeClassName={styles.active}>
          Login
        </NavLink>
      </li>
      <li>
        <NavLink to="/sign-up" exact={true} activeClassName={styles.active}>
          Sign Up
        </NavLink>
      </li>
    </>
  );

  const handleShowMore = (e) => setShowMore((prev) => !prev);
  const handleLogout = async (e) => {
    await dispatch(logout());
    history.push("/");
  };

  const toggleSearch = () => {
    if (!inactiveFn) {
      setInactiveFn(true);
      if (showSearch) {
        setHideSearch(true);
        setTimeout(() => {
          setShowSearch(false);
          setHideSearch(false);
          setTimeout(() => setInactiveFn(false), 150);
        }, 300);
      } else {
        setShowSearch(true);
        setTimeout(() => {
          setInactiveFn(false);
          refSearchBar?.current?.focus();
        }, 350);
      }
    }
  };

  useEffect(() => {
    if (searchRef.current) {
      const toggle = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target))
          toggleSearch();
      };

      document.addEventListener("click", toggle);
      return () => document.removeEventListener("click", toggle);
    }
  }, [searchRef.current, inactiveFn]);

  useEffect(() => {
    const toggle = (e) => {
      if (!moreRef.current.contains(e.target)) setShowMore(false);
    };

    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, [moreRef.current]);

  return (
    <>
      <ul
        className={`${styles.navBar} ${
          showSearch && !hideSearch && styles.miniNavBar
        }
        `}
      >
        <div>
          {user &&
            links.slice(0, links.length - 1).map(({ icon, path }, idx) =>
              icon === "Search" ? (
                <div key={idx} onClick={toggleSearch}>
                  <NavItem
                    type={icon}
                    showSearch={showSearch}
                    hideSearch={hideSearch}
                  />
                </div>
              ) : icon === "Coin" ? (
                <div key={idx}>
                  <NavItem
                    type={icon}
                    showSearch={showSearch}
                    hideSearch={hideSearch}
                  />
                </div>
              ) : (
                <NavLink
                  key={idx}
                  to={path}
                  exact={true}
                  className={styles.navLink}
                  activeClassName={styles.active}
                >
                  <NavItem
                    type={icon}
                    showSearch={showSearch}
                    hideSearch={hideSearch}
                  />
                </NavLink>
              )
            )}
        </div>
        {user && (
          <div
            ref={moreRef}
            className={styles.moreLink}
            onClick={handleShowMore}
          >
            <div
              className={showMore ? styles.moreDropDown : styles.hideDropDown}
              id="menu-dropdown"
            >
              <NavLink
                to="/settings/edit"
                exact={true}
                className={styles.navLink}
              >
                <MoreItem type="Settings" />
              </NavLink>
              {/* <NavLink to="/saved" exact={true} className={styles.navLink}>
                <MoreItem type="Saved" />
              </NavLink>
              <NavLink to="/report" exact={true} className={styles.navLink}>
                <MoreItem type="Report a problem" />
              </NavLink>
              <NavLink to="#" exact={true} className={styles.navLink}>
                <MoreItem type="Switch accounts" />
              </NavLink> */}
              <NavLink to="#" exact={true} className={styles.navLink}>
                <MoreItem type="Log Out" onClick={handleLogout} />
              </NavLink>
            </div>
            <NavItem
              type="More"
              showSearch={showSearch}
              hideSearch={hideSearch}
            />
          </div>
        )}
        {!user && loggedInNav}
      </ul>
      {showSearch && (
        <Search
          searchRef={searchRef}
          hideSearch={hideSearch}
          onClose={toggleSearch}
          refSearchBar={refSearchBar}
        />
      )}
    </>
  );
};

export default NavBar;
