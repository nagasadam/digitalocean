import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Alert,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Spinner
} from "reactstrap";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import { userActions, alertActions, surveyActions } from '../../_actions';
import QrReader from 'react-qr-reader';
import { store } from 'react-notifications-component';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
var emailregex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

class Login extends React.Component {
  constructor(props){
    super(props);

    history.listen((location, action) => {
      this.props.clearAlerts();
    });

    // reset login status
    this.props.logout();

    this.state = {
      scan: false,
      result: 'No Result',
      forgot: false,
      email: '',
      emailState: '',
      focusedEmail: false,
      password:'',
      passwordState: '',
      focusedPassword: false,
      dcode: '',
      dcodeState: '',
      focusedDcode: false,
      forgot: '',
      forgotState: '',
      focusedForgot: false,
      submitted: false,
      login: false,
      register: false
    }
  }


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

handleDcode(e){
  e.preventDefault();
  const {dcode, dcodeState} = this.state;

  if(dcode == ''){
    this.setState({ focusedDcode: true })
    this.setState(dcode == "" ? { dcodeState: "invalid"} : {dcodeState: "valid"})
  }

  else{
    this.props.validDcode(dcode);
  }
}

handleForgot(e) {
  e.preventDefault();
  const { email, emailState } = this.state;

  if(email == '' || !emailregex.test(email)){
    this.setState({ focusedForgot: true })
    this.setState( email == "" ? { emailState: "invalid"} : {emailState: "valid"})
  }
  else{
    this.setState({ submitted: true });
    const { email } = this.state;
    if (email) {
        this.props.forgot(email)
    }
  }
}

handleSubmit(e) {
  e.preventDefault();
  const { email, password, emailState, passwordState } = this.state;

  if(email == '' || password == '' || !emailregex.test(email)){
    this.setState({ focusedEmail: true , focusedPassword: true })
    this.setState( email == "" ? { emailState: "invalid"} : {passwordState: "invalid"})
    this.setState( password == "" ? { passwordState: "invalid"} : {emailState: "invalid"})
  }
  else{
    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && password) {
        this.props.login(email, password)
    }
  }
}

  enableScan(){
    this.setState({ scan: !this.state.scan })
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }

  handleError = err => {
    console.error(err)
  }

  Forgot = () => {
    this.setState({ forgot: !this.state.forgot })
  }

  facebookResponse = (response) => {
    console.log("response", response)
    const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
    const options = {
        method: 'POST',
        body: tokenBlob,
        mode: 'cors',
        cache: 'default'
    };
  };

  UNSAFE_componentWillReceiveProps(nextProps){
    console.log("alert")
    if(nextProps.alert.message){
      store.addNotification({
        title: 'Survey',
        message: nextProps.alert.message,
        type: nextProps.alert.type,             // 'default', 'success', 'info', 'warning'
        container: 'top-right',                // where to position the notifications
        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
        dismiss: {
          duration: 1000 
        }
      })
    }
    
    if(nextProps.survey.exists == true){
      history.push('/survey/' + this.state.dcode)
    }
  }

responseGoogle = (response) => {
  console.log(response);
}


  render() {
    const { loggingIn } = this.props;
    const alert = this.props.alert;
    const user = this.props.user;
    const {email, password, dcode, submitted} = this.state;
    return (
      <>
        <Col lg="5" md="7" xs="0">
          
          <Card className="bg-secondary shadow border-0">
            {/* <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">

              <FacebookLogin
                appId="949927522094402"
                fields="name,email"
                callback={this.facebookResponse}
                render={renderProps => (
                  <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#facebook"
                  onClick={() => renderProps.onClick()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Facebook</span>
                </Button>
                )}
              />

              <GoogleLogin
                clientId="7402931326-5ap356838ghblig4l2gas8n8rmu5smjn.apps.googleusercontent.com"
                render={renderProps => (
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#google"
                    onClick={() => renderProps.onClick()}
                  >
                    <span className="btn-inner--icon">
                      <img
                        alt="..."
                        src={require("../assets/img/icons/common/google.svg")}
                      />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                )}
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
              />

              </div>
            </CardHeader> */}

            { !this.state.forgot
              ?
            
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
            <small>Log in with credentials</small>
              </div>
              <Form role="form" onSubmit={e => this.handleSubmit(e)}>

                <FormGroup 
                  className={classnames(
                    "mb-3",
                    { focused: this.state.focusedEmail },
                    { "has-danger": this.state.emailState === "invalid" },
                    { "has-success": this.state.emailState === "valid" }
                  )}
                >
                  <InputGroup
                    className={classnames("input-group-merge input-group-alternative", {
                      "is-invalid": this.state.emailState === "invalid"
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i
                          className={classnames(
                            "ni ni-email-83",
                            { "text-danger": this.state.emailState === "invalid" },
                            { "text-success": this.state.emailState === "valid" }
                          )} 
                         />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Email" 
                      type="email" 
                      id="email"
                      className={classnames(
                        { "text-danger": this.state.emailState === "invalid" },
                        { "text-success": this.state.emailState === "valid" }
                      )}
                      autoComplete="new-email" 
                      value={email} 
                      onChange={(e) => this.handleChange(e)}
                      onFocus={() => this.setState({ focusedEmail: true })}
                      onBlur={() => this.setState({ focusedEmail: false })}
                    />
                  </InputGroup>
                  <div className="invalid-feedback">Please provide a valid email.</div>
                </FormGroup>

                <FormGroup
                  className={classnames(
                    "mb-3",
                    { focused: this.state.focusedPassword },
                    { "has-danger": this.state.passwordState === "invalid" },
                    { "has-success": this.state.passwordState === "valid" }
                  )}
                >
                  <InputGroup 
                    className={classnames("input-group-merge input-group-alternative", {
                      "is-invalid": this.state.passwordState === "invalid"
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i 
                          className={classnames(
                            "ni ni-lock-circle-open",
                            { "text-danger": this.state.passwordState === "invalid" },
                            { "text-success": this.state.passwordState === "valid" }
                          )} 
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Password" 
                      type="password" 
                      id="password"
                      autoComplete="new-password" 
                      className={classnames(
                        { "text-danger": this.state.passwordState === "invalid" },
                        { "text-success": this.state.passwordState === "valid" }
                      )}
                      value={password}  
                      onChange={(e) => this.handleChange(e)}
                      onFocus={() => this.setState({ focusedPassword: true })}
                      onBlur={() => this.setState({ focusedPassword: false })}
                    />
                  </InputGroup>
                  <div className="invalid-feedback">Please enter the password.</div>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" size="lg">
                    Sign in   
                  </Button>
                </div>
              </Form>
            </CardBody>
            

            :

            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <large>Forgot Password</large>
              </div>
              <Form role="form" onSubmit={(e) => this.handleForgot(e)}>
                <FormGroup
                  className={classnames(
                    "mb-3",
                    { focused: this.state.focusedForgot },
                    { "has-danger": this.state.emailState === "invalid" },
                    { "has-success": this.state.emailState === "valid" }
                  )}
                >
                  <InputGroup
                    className={classnames("input-group-merge input-group-alternative", {
                      "is-invalid": this.state.emailState === "invalid"
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i 
                          className={classnames(
                            "ni ni-email-83",
                            { "text-danger": this.state.emailState === "invalid" },
                            { "text-success": this.state.emailState === "valid" }
                          )} 
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Email" 
                      type="email" 
                      id="email"
                      autoComplete="new-email" 
                      className={classnames(
                        { "text-danger": this.state.emailState === "invalid" },
                        { "text-success": this.state.emailState === "valid" }
                      )}
                      value={email} 
                      onChange={(e) => this.handleChange(e)}
                      onFocus={() => this.setState({ focusedForgot: true })}
                      onBlur={() => this.setState({ focusedForgot: false })}
                    />
                  </InputGroup>
                  <div className="invalid-feedback">Please enter valid email.</div>
                </FormGroup>
                <FormGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Reset Password
                  </Button>
                </div>
              </Form>
              {
                alert.message ?
                    <Alert color={alert.type} fade={true}>
                        {alert.message}
                    </Alert>
                    : null
              }
            </CardBody>
  }


          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                // href={ this.state.forgot ? "#forgot" : "" }
                onClick={() => this.Forgot()}
              >
                <small>{ this.state.forgot ? "Admin Login" : "Forgot password ?" }</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="/auth/signup"
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

function mapState(state) {
  const { loggingIn } = state.authentication;
  const { alert, user, survey } = state;
  return { loggingIn, alert, survey };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
  validDcode: surveyActions.verifyDecode,
  forgot: userActions.forgot,
  clearAlerts: alertActions.clear
};

const connectedLoginPage = connect(mapState, actionCreators)(Login);
export { connectedLoginPage as Login };