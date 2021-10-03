import React from "react";
import { Link, Redirect } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";
import { connect } from 'react-redux';
import { history } from '../../../_helpers';
import { userActions, alertActions } from '../../../_actions';
import config from 'config';

class AdminNavbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      profilePic: ''
    }
  }

  componentDidMount(){
    this.props.getUserDetails()
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.users.items){
      console.log(nextProps.users.items)
      this.setState({
        firstName: nextProps.users.items.data.firstName,
        lastName: nextProps.users.items.data.lastName,
        profilePic: config.apiUrl+'/' + nextProps.users.items.data.img.path
      })
    }
  }
  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.location.pathname == '/admin/survey/edit' ? this.props.location.data.surveyName + "EDIT" : this.props.brandText}
            </Link>
            {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" type="text" />
                </InputGroup>
              </FormGroup>
            </Form> */}
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        style={{ width: 40, height: 40 }}
                        alt="..."
                        src={this.state.profilePic}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {this.state.firstName}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" onClick={() => history.push('/admin/user')}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={() => this.props.logout()}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

function mapState(state) {
  const users = state.users;
  const alert = state.alert;
  return { alert, users};
}

const actionCreators = {
  logout: userActions.logout,
  clearAlerts: alertActions.clear,
  getUserDetails: userActions.getById
};


const connectedAdminNavbarPage = connect(mapState, actionCreators)(AdminNavbar);
export { connectedAdminNavbarPage as AdminNavbar };
