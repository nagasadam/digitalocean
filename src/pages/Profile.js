import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroupAddon,
  Container,
  Row,
  Col,
  InputGroup
} from "reactstrap";
// core components
import config from 'config';
import UserHeader from "../components/Headers/UserHeader.js";
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import QRCode from 'qrcode.react';
import { userActions, surveyActions, alertActions } from '../../_actions';
var emailregex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;


class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      update: false,
      address: '',
      focusedAddress: false,
      addressState: '',
      city: '',
      cityState: '',
      state:'',
      stateState: '',
      focusedState: false,
      focusedCity: false,
      country: '',
      countryState: '',
      focusedCountry: false,
      postalCode: '',
      postalCodeState: '',
      focusedPostalCode: false,
      firstName: '',
      firstNameState: '',
      focusedFirstName: false,
      lastName: '',
      lastNameState: '',
      focusedLastName: false,
      email: '',
      emailState: '',
      focusedEmail: false,
      password: '',
      passwordState: '',
      focusedPassword: false,
      confirmPassword: '',
      confirmPasswordState: '',
      focusedConfirmPassword: false,
      fileUploadState: '',
      profilePic: '',
      imagePath: ''
    }
    this.inputReference = React.createRef();
  }

  componentDidMount(){
    this.props.getUserDetails()
  }

  UNSAFE_componentWillReceiveProps(nextProps){
   if(nextProps.users.items){
     this.setState({
       address: nextProps.users.items.data.address == 'undefined' ? '' : nextProps.users.items.data.address,
       city: nextProps.users.items.data.city == 'undefined' ? '' : nextProps.users.items.data.city,
       country: nextProps.users.items.data.country  == 'undefined' ? '' : nextProps.users.items.data.country,
       postalCode: nextProps.users.items.data.postalCode == 'undefined' ? '' : nextProps.users.items.data.postalCode,
       firstName: nextProps.users.items.data.firstName,
       lastName: nextProps.users.items.data.lastName,
       email: nextProps.users.items.data.email,
       state: nextProps.users.items.data.state == 'undefined' ? '' : nextProps.users.items.data.state,
       profilePic: config.apiUrl+'/' + nextProps.users.items.data.img.path
     })
   }

   if(nextProps.alert.message){
      store.addNotification({
        title: 'User Profile',
        message: nextProps.alert.message,
        type: nextProps.alert.type,             // 'default', 'success', 'info', 'warning'
        container: 'top-right',                // where to position the notifications
        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
        dismiss: {
          duration: 15000 
        }
      })
    }

  }

  fileUploadAction = () =>this.inputReference.current.click();
  fileUploadInputChange = (e) =>{
    this.setState({ profilePic: URL.createObjectURL(e.target.files[0]), imagePath: e.target.files[0]})
  };

  handleChange(e) {
    const { id, value } = e.target;
      this.setState({ [id]: value });

    if(e.target.value == "" || e.target.id == "email" && !emailregex.test(e.target.value)) {
      this.setState({ [id + "State"]: "invalid"})
    }
    else{
      this.setState({ [id + "State"]: "valid"}) 
    }
  }

  handleCancel(){
    this.props.getUserDetails();
    this.setState({ update: !this.state.update })
    this.setState({ 
      focusedAddress: false,
      cityState: '',
      stateState: '',
      focusedState: false,
      focusedCity: false,
      countryState: '',
      focusedCountry: false,
      postalCodeState: '',
      focusedPostalCode: false,
      firstNameState: '',
      focusedFirstName: false,
      lastNameState: '',
      focusedLastName: false,
      emailState: '',
      focusedEmail: false,
      passwordState: '',
      focusedPassword: false,
      confirmPasswordState: '',
      focusedConfirmPassword: false
    })
  }

  handleUpdate(e){
    const { email, emailState, passwordState, firstName, firstNameState, lastName, lastNameState, address, addressState, city, cityState, country, countryState, postalCode, postalCodeState, state, stateState } = this.state;
    if(this.state.update){
      if(email == '' || !emailregex.test(email) || firstName == '' || lastName == '' || address == '' || city == '' || country == '' || postalCode == '' || state == ''){
        this.setState({ focusedEmail: true , focusedPassword: true, focusedAddress: true, focusedCity: true, focusedCountry: true, focusedLastName: true, focusedFirstName: true, focusedPostalCode: true})
        this.setState( email == "" || !emailregex.test(email) ? { emailState: "invalid"} : {emailState: "valid"})
        this.setState( firstName == "" ? { firstNameState: "invalid"} : {firstNameState: "valid"})
        this.setState( lastName == "" ? { lastNameState: "invalid"} : {lastNameState: "valid"})
        this.setState( address == "" ? { addressState: "invalid"} : {addressState: "valid"})
        this.setState( city == "" ? { cityState: "invalid"} : {cityState: "valid"})
        this.setState( state == "" ? { stateState: "invalid"} : {stateState: "valid"})
        this.setState( country == "" ? { countryState: "invalid"} : {countryState: "valid"})
        this.setState( postalCode == "" ? { postalCodeState: "invalid"} : {postalCodeState: "valid"})
      }
      else{
        var formData= new FormData();
        formData.append("email", this.state.email);
        formData.append("firstName", this.state.firstName);
        formData.append("lastName", this.state.lastName);
        formData.append("address", this.state.address);
        formData.append("city", this.state.city);
        formData.append("postalCode", this.state.postalCode);
        formData.append("state", this.state.state);
        formData.append("country", this.state.country);
        if(this.state.password != ''){
          formData.append("password", this.state.password);
        }
        formData.append("image", this.state.imagePath);

        this.props.updateUserDetails(formData);
        this.setState({ update: !this.state.update })
      }

    }
    else{
      this.setState({ update: !this.state.update })
    }

  }

  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--9" fluid>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        onClick={() => this.handleUpdate()}
                        size="sm"
                      >
                        {this.state.update ? "Save" : "Edit"}
                      </Button>
                      {
                        this.state.update ?
                          <Button
                            color="danger"
                            onClick={() => this.handleCancel()}
                            size="sm"
                          >
                            Cancel
                          </Button>

                          : null
                      }
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-6">
                      User information
                    </h6>
                    <Row className="justify-content-center p-3">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        {
                          (this.state.profilePic != '')
                          ?
                          <img
                            alt=""
                            style={{ height: 190, width: 190}}
                            className="rounded-circle"
                            src={this.state.profilePic}
                          />
                          : 
                            <img alt="" style={{ height: 190, width: 190}} className="rounded-circle text-primary fa fa-user fa-10x pl-3"/>
                        }
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-7 pb-0 pb-md-4 mb-4 p-3">
                  
                    {
                      this.state.update 
                      ?
                      <div className="d-flex justify-content-center">
                        <Button
                          className="mx-5 p-2"
                          color="default"
                          innerRef={this.inputReference}
                          onClick={e => this.fileUploadAction(e)}
                          size="sm"
                        >
                          Upload
                        </Button>
                        <Input
                          type="file"
                          innerRef={this.inputReference}
                          onChange={(e) => this.fileUploadInputChange(e)}
                          style={{display: 'none'}}
                        />
                      </div>
                      : 
                      <div className="d-flex justify-content-center mb-4"/>
                    }
                  <h2 className="mt-1 text-bold">{ this.state.firstName } { this.state.lastName}</h2>
                </CardHeader>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup 
                          className={classnames(
                            "mb-3",
                            { focused: this.state.focusedEmail },
                            { "has-danger": this.state.emailState === "invalid" },
                            { "has-success": this.state.emailState === "valid" }
                          )}>
                            <label
                              className="form-control-label"
                              htmlFor="email"
                            >
                              Email address
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", 
                              { "is-invalid": this.state.emailState === "invalid"},
                              { "is-valid": this.state.emailState === "valid"})}>
                              <Input
                                className="form-control-alternative"
                                id="email"
                                value={this.state.email}
                                disabled={!this.state.update}
                                onChange={(e) => this.handleChange(e)}
                                placeholder="jesse@example.com"
                                type="email"
                                className={classnames(
                                  { "text-danger": this.state.emailState === "invalid" },
                                  { "text-success": this.state.emailState === "valid" }
                                )}
                                onFocus={() => this.setState({ focusedEmail: true })}
                                onBlur={() => this.setState({ focusedEmail: false })}
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>

                        {
                          this.state.update
                          ?  
                      <Row>
                          <Col lg="6">
                          <FormGroup 
                          className={classnames(
                            "mb-3",
                            { focused: this.state.focusedPassword },
                            { "has-danger": this.state.passwordState === "invalid" },
                            { "has-success": this.state.passwordState === "valid" }
                          )}>
                            <label
                              className="form-control-label"
                              htmlFor="password"
                            >
                              Change Password
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative",
                                {"is-invalid": this.state.passwordState === "invalid"},
                                {"is-valid": this.state.passwordState === "valid"},
                              )}>
                              <Input
                                className="form-control-alternative"
                                id="password"
                                value={this.state.password}
                                disabled={!this.state.update}
                                autoComplete="current-password"
                                onChange={(e) => this.handleChange(e)}
                                placeholder="Password"
                                type="password"
                              />
                            </InputGroup>
                          </FormGroup>
                            </Col>
                            <Col lg="6">
                          <FormGroup 
                          className={classnames(
                            "mb-3",
                            { focused: this.state.focusedConfirmPassword },
                            { "has-danger": this.state.confirmPasswordState === "invalid" || this.state.confirmPassword !== this.state.password },
                            { "has-success": this.state.confirmPasswordState === "valid" && this.state.confirmPassword === this.state.password }
                          )}>
                            <label
                              className="form-control-label"
                              htmlFor="password"
                            >
                              Confirm Password
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative",
                                {"is-invalid": this.state.confirmPasswordState === "invalid"},
                                {"is-valid": this.state.confirmPasswordState === "valid"},
                              )}>
                              <Input
                                className="form-control-alternative"
                                id="confirmPassword"
                                value={this.state.confirmPassword}
                                disabled={!this.state.update}
                                autoComplete="current-password"
                                onChange={(e) => this.handleChange(e)}
                                placeholder="Password"
                                type="password"
                              />
                            </InputGroup>
                          </FormGroup>
                            </Col>
                            
                      </Row>
                      : null
                          }

                      
                      <Row>
                        <Col lg="6">
                          <FormGroup 
                            className={classnames(
                              "mb-3",
                              { focused: this.state.focusedFirstName },
                              { "has-danger": this.state.firstNameState === "invalid" },
                              { "has-success": this.state.firstNameState === "valid" }
                            )}>
                            <label
                              className="form-control-label"
                              htmlFor="firstName"
                            >
                              First name
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.firstNameState === "invalid"
                              })}>
                              <Input
                                className="form-control-alternative"
                                defaultValue="Lucky"
                                disabled={!this.state.update}
                                value={this.state.firstName}
                                onChange={(e) => this.handleChange(e)}
                                id="firstName"
                                placeholder="First name"
                                type="text"
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup 
                              className={classnames(
                                "mb-3",
                                { focused: this.state.focusedLastName },
                                { "has-danger": this.state.lastNameState === "invalid" },
                                { "has-success": this.state.lastNameState === "valid" }
                              )}>
                            <label
                              className="form-control-label"
                              htmlFor="lastName"
                            >
                              Last name
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.lastNameState === "invalid"
                              })}>
                                <Input
                                  className="form-control-alternative"
                                  id="lastName"
                                  value={this.state.lastName}
                                  onChange={(e) => this.handleChange(e)}
                                  disabled={!this.state.update}
                                  placeholder="Last name"
                                  type="text"
                                />
                              </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Company Details
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="8">
                          <FormGroup 
                                className={classnames(
                                  "mb-3",
                                  { focused: this.state.focusedAddress },
                                  { "has-danger": this.state.addressState === "invalid" },
                                  { "has-success": this.state.addressState === "valid" }
                                )}>
                            <label
                              className="form-control-label"
                              htmlFor="address"
                            >
                              Address
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.addressState === "invalid"
                              })}>
                              <Input
                                className="form-control-alternative"
                                id="address"
                                disabled={!this.state.update}
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.address}
                                placeholder="Home Address"
                                type="text"
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup 
                                className={classnames(
                                  "mb-3",
                                  { focused: this.state.focusedState },
                                  { "has-danger": this.state.stateState === "invalid" },
                                  { "has-success": this.state.stateState === "valid" }
                                )}>
                            <label
                              className="form-control-label"
                              htmlFor="state"
                            >
                              State
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.cityState === "invalid"
                              })}>
                              <Input
                                className="form-control-alternative"
                                id="state"
                                disabled={!this.state.update}
                                value={this.state.state}
                                onChange={(e) => this.handleChange(e)}
                                placeholder="State"
                                type="text"
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup 
                                className={classnames(
                                  "mb-3",
                                  { focused: this.state.focusedCity },
                                  { "has-danger": this.state.cityState === "invalid" },
                                  { "has-success": this.state.cityState === "valid" }
                                )}>
                            <label
                              className="form-control-label"
                              htmlFor="city"
                            >
                              City
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.cityState === "invalid"
                              })}>
                              <Input
                                className="form-control-alternative"
                                defaultValue="New York"
                                id="city"
                                disabled={!this.state.update}
                                value={this.state.city}
                                onChange={(e) => this.handleChange(e)}
                                placeholder="City"
                                type="text"
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup 
                            className={classnames(
                              "mb-3",
                              { focused: this.state.focusedCountry },
                              { "has-danger": this.state.countryState === "invalid" },
                              { "has-success": this.state.countryState === "valid" }
                            )}>
                            <label
                              className="form-control-label"
                              htmlFor="country"
                            >
                              Country
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.countryState === "invalid"
                              })}>
                              <Input
                                className="form-control-alternative"
                                defaultValue="United States"
                                id="country"
                                disabled={!this.state.update}
                                value={this.state.country}
                                onChange={(e) => this.handleChange(e)}
                                placeholder="Country"
                                type="text"
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup 
                            className={classnames(
                              "mb-3",
                              { focused: this.state.focusedPostalCode },
                              { "has-danger": this.state.postalCodeState === "invalid" },
                              { "has-success": this.state.postalCodeState === "valid" }
                            )}>
                            <label
                              className="form-control-label"
                              htmlFor="postalCode"
                            >
                              Zip code
                            </label>
                            <InputGroup
                              className={classnames("input-group-merge input-group-alternative", {
                                "is-invalid": this.state.postalCode === "invalid"
                              })}>

                              </InputGroup>
                                <Input
                                  className="form-control-alternative"
                                  id="postalCode"
                                  disabled={!this.state.update}
                                  value={this.state.postalCode}
                                  onChange={(e) => this.handleChange(e)}
                                  placeholder="Zip Code"
                                  type="number"
                                />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
        </Container>
      </>
    );
  }
}


const mapState = (state) => {
  const users = state.users;
  const alert = state.alert;
  return { users, alert };
}

const actionCreators = {
  getUserDetails: userActions.getById,
  updateUserDetails: userActions.update,
  clearAlerts: alertActions.clear
};

const connectedProfile = connect(mapState, actionCreators)(Profile);
export { connectedProfile as Profile };