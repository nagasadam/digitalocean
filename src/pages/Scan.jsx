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
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import { userActions, alertActions, surveyActions } from '../../_actions';
import QrReader from 'react-qr-reader';
import { store } from 'react-notifications-component';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
var emailregex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
import { URL_CONSTANTS } from '../../_constants';

class Scan extends React.Component {
  constructor(props){
    super(props);

    history.listen((location, action) => {
      this.props.clearAlerts();
    });

    // reset login status
    this.props.logout();

    this.state = {
      scan: false,
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
    const { type, value } = e.target;
    if(e.target.placeholder == "Enter Code" ){
      this.setState({ dcode: e.target.value })
    }
    else{
      this.setState({ [type]: value });
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
      history.push(data.replace(URL_CONSTANTS.API_URL, ''))
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
          <Card className="bg-secondary shadow border-0 mb-4 d-block">
            <CardHeader className="bg-transparent p-5 d-block">
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-danger btn-icon"
                  color="primary"
                  onClick={() => this.enableScan()}
                >
                  <span className="btn-large--text mr-2">SCAN</span>
                  <span className="btn-large--icon">
                    <img
                      alt="..."
                      height="44"
                      src={"/src/assets/img/icons/smiley/satisfied.png"}
                    />
                  </span>
                  <span className="btn-large--text ml-2">NOW</span>
                </Button>
              </div>
            </CardHeader>
            {this.state.scan
              ? 
                <CardBody className="px-lg-5 py-lg-5">
                  <QrReader
                    facingMode='environment'
                    showViewFinder={true}
                    delay={500}
                    legacyMode={false}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                  />
                </CardBody>
              : null}   
              <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
              <span className="btn-large--icon">
                    <img
                      alt="..."
                      height="44"
                      src={"/src/assets/img/icons/smiley/satisfied.png"}
                    />
                  </span>
                <big className="mx-2">Dimple Me</big>
                <span className="btn-large--icon">
                    <img
                      alt="..."
                      height="44"
                      src={"/src/assets/img/icons/smiley/satisfied.png"}
                    />
                  </span>
              </div>
              <Form role="form" onSubmit={(e) => this.handleDcode(e)}>
                <FormGroup                   
                  className={classnames(
                    "mb-3",
                    { focused: this.state.focusedDcode },
                    { "has-danger": this.state.dcodeState === "invalid" },
                    { "has-success": this.state.dcodeState === "valid" }
                  )}
                >
                  <InputGroup 
                    className={classnames("input-group-merge input-group-alternative", {
                      "is-invalid": this.state.dcodeState === "invalid"
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i
                          className={classnames(
                            "ni ni-key-25",
                            { "text-danger": this.state.dcodeState === "invalid" },
                            { "text-success": this.state.dcodeState === "valid" }
                          )}
                         />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Enter Code" 
                      type="text" 
                      autoComplete="new-dcode"
                      className={classnames(
                        { "text-danger": this.state.dcodeState === "invalid" },
                        { "text-success": this.state.dcodeState === "valid" }
                      )}
                      value={dcode} 
                      onChange={(e) => this.handleChange(e)}
                      onFocus={() => this.setState({ focusedDcode: true })}
                      onBlur={() => this.setState({ focusedDcode: false })}
                    />
                  </InputGroup>
                  <div className="invalid-feedback">Please enter the dimple code.</div>
                </FormGroup>
                <FormGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </CardBody>
            
          </Card>
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

const connectedScanPage = connect(mapState, actionCreators)(Scan);
export { connectedScanPage as Scan };