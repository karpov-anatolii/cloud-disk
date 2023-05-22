import React, { useState } from "react";
import "./navbar.scss";
import Logo from "../../assets/img/navbar-logo.svg";
import { NavLink } from "react-router-dom";
import { logout } from "../../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { searchFiles } from "../../action/file";
import { getFiles } from "./../../action/file";
import { showLoader } from "../../reducers/appReducer";
import avatarLogo from "../../assets/img/user-avatar.svg";
import { API_URL } from "../../config";
import { FaServer } from "react-icons/fa";

const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const currentDir = useSelector((state) => state.files.currentDir);
  const currentUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false); // contain identifier of setTimeout process
  const avatar = currentUser.avatar
    ? `${API_URL + currentUser.avatar}`
    : avatarLogo;
  function searchChangeHandler(e) {
    setSearchName(e.target.value);
    if (searchTimeout != false) {
      clearTimeout(searchTimeout); //  searchTimeout is a setTimeout identifier
    }
    dispatch(showLoader());
    if (e.target.value != "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            // assign identifier of setTimeout to searchTimeout (some number)
            dispatch(searchFiles(value));
          },
          500, //this delay decreases requests to server amount
          e.target.value
        )
      );
    } else {
      dispatch(getFiles(currentDir));
    }
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo-block">
          <div className="container2">
            {/* <img src={Logo} alt="" className="logo" /> */}
            <FaServer className="logo-icon" />
            <a href={process.env.REACT_APP_SITE_ROOT} className="header">
              CLOUD DISK
            </a>
          </div>

          {isAuth && (
            <input
              className="search"
              type="text"
              placeholder="file name"
              value={searchName}
              onChange={(e) => searchChangeHandler(e)}
            />
          )}
        </div>
        <div className="auth-block">
          {!isAuth && (
            <div className="login">
              <NavLink to="/login">Enter</NavLink>
            </div>
          )}

          {!isAuth && (
            <div className="registration">
              <NavLink to="/registration">Registration</NavLink>
            </div>
          )}

          {isAuth && (
            <div className="login" onClick={() => dispatch(logout())}>
              Exit
            </div>
          )}
          {isAuth && (
            <NavLink to="/profile">
              <img className="avatar" src={avatar} alt="" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
