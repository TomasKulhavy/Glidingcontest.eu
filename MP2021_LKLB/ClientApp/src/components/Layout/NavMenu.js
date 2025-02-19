import React, { useState, useContext, useEffect } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavItem, NavLink, NavbarToggler, Nav, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FlightDataContext, SET_ACCESS_TOKEN, ADD_PILOTID } from "../../providers/FlightDataContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSignOutAlt, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import './NavMenu.css';

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [{accessToken}, dispatch] = useContext(FlightDataContext);
  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);
  const toggle = () => setIsOpen(!isOpen);

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/Account/getToken`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken
      }
    })
    .then((response) => {
      dispatch({ type: SET_ACCESS_TOKEN, payload: response.data.accessToken});
    })
  }, [dispatch, accessToken])

  function renderUser()
  {
    let tokenData;
    if(accessToken !== null)
    {
      tokenData = parseJwt(accessToken)
      return (
        <NavItem>
          <NavLink tag={Link} className="text-light navt" onClick={() =>
            dispatch({
              type: ADD_PILOTID,
              pilotId: tokenData.sub
            })} to={`/pilot/profile/${tokenData.sub}`}>
            <FontAwesomeIcon icon={faUserAlt} className="font-size-xl mr-2 mt-1" />
            {tokenData.given_name}
          </NavLink>
        </NavItem>
      )
    }
  }

  function renderFeedback()
  {
    let tokenData;
    if(accessToken !== null)
    {
      tokenData = parseJwt(accessToken)
      if(tokenData.given_name === "TomasLKLB")
      {
        return (
          <NavItem>
            <NavLink tag={Link} className="text-light navt" to="/feedback/review">
              Feedback
            </NavLink>
          </NavItem>
        )
      }
    }
  }

  function logout()
  {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/Account/logout`)
    .then(() => {
      dispatch({ type: SET_ACCESS_TOKEN, payload: null });
      setVisible(true)
    })
  }

  function renderAlert()
  {
    if(visible)
    {
      return (<Alert color="success" isOpen={visible} toggle={onDismiss} className="my-3">Uživatel byl odhlášen!</Alert>)
    }
  }

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3 border-0">
        <Container>
          <NavbarBrand tag={Link} className="text-light text-uppercase" to="/">Gliding contest</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={isOpen} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-light navt" to="/flight/list">Lety</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light navt" to="/pilot/order">Pořadí pilotů</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light navt" to="/pilot/list">Piloti</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light navt" to="/statistics">Statistiky</NavLink>
              </NavItem>
              {renderFeedback()}
              {
                accessToken
                ?
                  <Nav navbar>
                    {renderUser()}
                    <NavItem>
                      <NavLink tag={Link} className="text-light navt" to="/flight/upload">
                        <FontAwesomeIcon icon={faUpload} className="font-size-xl mr-2 mt-1" />
                        Nahrát let
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink onClick={() => logout() }
                        tag={Link} className="text-light navt" to="/">
                        <FontAwesomeIcon icon={faSignOutAlt} className="font-size-xl mr-2 mt-1" />
                        Odhlásit se
                      </NavLink>
                    </NavItem>
                  </Nav>
                  :
                  <Nav navbar>
                    <NavItem>
                      <NavLink tag={Link} className="text-light navt" to="/register">Registrovat se</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} className="text-light navt" to="/login">Přihlásit se</NavLink>
                    </NavItem>
                  </Nav>
              }
            </ul>
          </Collapse>
        </Container>
      </Navbar>
      <Container>
        {renderAlert()}
      </Container>
    </header>
  );
}

export default NavMenu;
