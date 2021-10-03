import React from "react";
// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

import { URL_CONSTANTS } from '../../../_constants';


class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              © 2020{" "}
              <a
                className="font-weight-bold ml-1"
                href={URL_CONSTANTS.HOMEPAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                {URL_CONSTANTS.APP_NAME}
              </a>
            </div>
          </Col>

          <Col xl="6">
            <Nav className="nav-footer justify-content-center justify-content-xl-end">
              <NavItem>
                <NavLink
                  href={URL_CONSTANTS.HOMEPAGE_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {URL_CONSTANTS.APP_NAME}
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href={URL_CONSTANTS.HOMEPAGE_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  About Us
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href={URL_CONSTANTS.HOMEPAGE_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Blog
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
