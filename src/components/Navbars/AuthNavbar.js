import React from "react";
import { Link } from "react-router-dom";
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";
import { history } from '../../../_helpers';
import { URL_CONSTANTS } from '../../../_constants';


class AuthNavbar extends React.Component {
  constructor(props){
    super(props);

    // reset login status
    this.state = {
      login: false,
      register: false
    }
  }

  loginLink(){
    this.setState({ login: !this.state.login })
  }

  
  render() {
    return (
      <>
        <Navbar
          className="navbar-top navbar-horizontal navbar-dark"
          expand="md"
        >
          <Container className="px-4">
            <NavbarBrand to="/" tag={Link}>
              <h1 className="d-none d-sm-block">{URL_CONSTANTS.APP_NAME}</h1>
              <h2 className="d-block d-sm-none">{URL_CONSTANTS.APP_NAME}</h2>
            </NavbarBrand>
            <button className="navbar-toggler" id="navbar-collapse-main">
              <span className="navbar-toggler-icon" />
            </button>

            <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/">
                    <h2 className="d-block d-sm-none">{URL_CONSTANTS.APP_NAME}</h2>
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      id="navbar-collapse-main"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="ml-auto" navbar>
                {
                  history.location.pathname != '/auth/scan'
                  ?
                  <NavItem>
                    <NavLink
                      className="nav-scan-icon"
                      to="/auth/scan"
                      tag={Link}
                    >
                      <i className="fa fa-qrcode" />
                      <span className="nav-link-inner--text"> Scan</span>
                    </NavLink>
                  </NavItem>
                  : null
                }
                {
                  history.location.pathname != '/auth/signup'
                  ?
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/auth/signup"
                      tag={Link}
                    >
                      <i className="ni ni-circle-08" />
                      <span className="nav-link-inner--text">Signup</span>
                    </NavLink>
                  </NavItem>
                  : null
                }
                {
                  history.location.pathname != '/auth/login'
                  ?
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/auth/login"
                      onClick={() => this.loginLink()}
                      tag={Link}
                    >
                      <i className="ni ni-key-25" />
                      <span className="nav-link-inner--text">Login</span>
                    </NavLink>
                  </NavItem>
                  : null
                }
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AuthNavbar;
