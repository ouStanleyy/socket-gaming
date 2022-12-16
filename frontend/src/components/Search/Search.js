import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../store/users";
import { LoadingSpinner } from "../Elements";
import styles from "./Search.module.css";
import SearchUser from "./SearchUser";

const Search = ({ hideSearch, searchRef, refSearchBar, onClose }) => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) =>
    Object.values(state.users.searchResults)
  );
  const [searchVal, setSearchVal] = useState(``);
  const [loaded, setLoaded] = useState(true);

  const updateSearchVal = (e) => {
    setLoaded(false);
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    let timeout;
    (async () => {
      try {
        await dispatch(searchUsers(searchVal));
      } catch (err) {}
      timeout = setTimeout(() => setLoaded(true), 500);
    })();

    return () => clearTimeout(timeout);
  }, [dispatch, searchVal]);

  return (
    <div
      ref={searchRef}
      className={`${styles.searchContainer} ${hideSearch && styles.hideSearch}`}
    >
      <div className={styles.searchHeader}>
        <h2>Search</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={updateSearchVal}
            className={styles.searchInput}
            ref={refSearchBar}
          />
          {loaded ? (
            <span
              onClick={() => setSearchVal("")}
              className={`material-symbols-outlined ${styles.cancelButton}`}
            >
              cancel
            </span>
          ) : (
            <div className={styles.loadingCancelSpinner}>
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
      <div className={styles.searchResults}>
        {loaded ? (
          searchResults.map((result) => (
            <SearchUser onClose={onClose} key={result.id} user={result} />
          ))
        ) : (
          <div className={styles.loadingSpinner}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
