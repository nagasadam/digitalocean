import React from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Progress,
  Form,
  Spinner,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
// core components
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import GoogleAd from '../components/Helper/GoogleAdds';
import { surveyActions, alertActions } from '../../_actions';
import { store } from 'react-notifications-component';
import UserHeader from "../components/Headers/UserHeader";

class SurveyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thankyouModal: false,
      dcode: props.match.params.dcode,
      rating: [0],
      questions: [],
      answers: [],
      surveyTitle: '',
      surveyState: false,
      surveyCustId: '',
      report: [{ rating: 0, comment: '' }],
      loading: true,
      listCount: 0,
      smileyCheck: [
        []
      ],
      imgSrc: [
        { icon: '/src/assets/img/icons/smiley/very-satisfied.png' },
        { icon: '/src/assets/img/icons/smiley/satisfied.png' },
        { icon: '/src/assets/img/icons/smiley/neutral.png' },
        { icon: '/src/assets/img/icons/smiley/unsatisfied.png' },
        { icon: '/src/assets/img/icons/smiley/very-unsatisfied.png' },
      ],
      comments: [],
      commentModal: false
    }
  }

  nextQuestion() {
    if (this.state.answers[0].rating == 0) {
      store.addNotification({
        title: 'Survey',
        message: 'Add Ratings',
        type: 'danger',             // 'default', 'success', 'info', 'warning'
        container: 'top-right',                // where to position the notifications
        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
        dismiss: {
          duration: 1000
        }
      })
    }
    else {
      this.setState({ listCount: this.state.listCount + 1 })
    }
  }

  toggleCommentModal(surveyCustId, answerId) {
    if (surveyCustId) {
      this.props.getComments(surveyCustId, answerId);
    }
    this.setState({ commentModal: !this.state.commentModal })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.survey.data) {
      var smiley = ['secondary', 'secondary', 'secondary', 'secondary', 'secondary']
      var smileyArr = [];
      var resultArr = [];

      nextProps.survey.data.questions.map((q, i) => {
        var result = {
          _id: q._id,
          rating: 0,
          comment: ''
        }
        resultArr.push(result);
        smileyArr.push(smiley);
      })

      this.setState({
        surveyState: nextProps.survey.data.active,
        loading: false,
        surveyTitle: nextProps.survey.data.surveyName,
        surveyCustId: nextProps.survey.data.surveyCustId,
        questions: nextProps.survey.data.questions,
        smileyCheck: smileyArr,
        answers: resultArr
      })
    }

    if (nextProps.alert.message) {
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
      if (nextProps.alert.type == 'success') {
        this.toggleModal()
      }
    }
  }

  componentDidMount() {
    this.props.getByIdSurvey(this.state.dcode);
  }

  smileyClick(iKey, qKey) {
    var scheckAr = this.state.smileyCheck;
    var ResultAr = this.state.answers;
    var smiley = ['secondary', 'secondary', 'secondary', 'secondary', 'secondary']
    smiley[iKey] = 'primary';
    ResultAr[qKey].rating = 5 - iKey;
    scheckAr[qKey] = smiley;
    this.setState({ smileyCheck: scheckAr, answers: ResultAr });
  }

  changeComment(e, key) {
    var result = this.state.answers;
    result[key].comment = e.target.value;
    this.setState({
      answers: result
    })
  }

  submitSurvey() {
    this.props.submitSurvey(this.state.surveyCustId, this.state.answers);
    setTimeout(() => { history.push('/') }, 3000);
  }

  renderForm() {
    return (
      <Form>
        <div className="pl-lg-4">
          <Row className="mb-2 mx-0">
            <Col md="12">
              <Card className="bg-default">
                {
                  this.state.questions.length < 1
                    ?
                    <CardBody>
                      <h2 className="mb-4 col-sm-12 col-md-6 offset-md-3 text-center text-white">
                        Survey Has No Questions Assigned
                      </h2>
                    </CardBody>
                    :

                    <CardBody>
                      <h2 className="mb-4 col-sm-12 col-md-6 offset-md-3 text-center text-white">
                        {this.state.questions[this.state.listCount].question}
                      </h2>
                      <Row className="px-0 mb-3 align-center col-sm-12 col-md-6 offset-md-3">
                        {
                          this.state.smileyCheck[this.state.listCount].map((scheck, i) => (
                            <Col className="px-0 mb-3 d-flex justify-content-center">
                              <Button color={scheck} onClick={() => this.smileyClick(i, this.state.listCount)}>
                                <span className="avatar avatar-lg rounded-circle">
                                  <img
                                    src={this.state.imgSrc[i].icon}
                                  />
                                </span>
                              </Button>
                            </Col>
                          ))
                        }
                      </Row>
                      <Input
                        className="form-control-alternative"
                        id="comment"
                        value={this.state.answers[this.state.listCount].comment || ''}
                        onChange={(e) => this.changeComment(e, this.state.listCount)}
                        placeholder="Comment"
                        type="text"
                      />
                      <GoogleAd slot="394738798" timeout={1000} classNames="page-bottom" />
                      <hr className="my-4" />
                      <Row>
                        <div className="update ml-auto mr-auto">
                          {
                            this.state.listCount != 0 && this.state.questions.length - this.state.listCount >= 2
                              ?
                              <Button
                                className="btn-round"
                                color="warning"
                                type="button"
                                onClick={() => this.setState({ listCount: this.state.listCount + 1 })}
                              >
                                Skip
                              </Button>

                              : null
                          }

                          {
                            this.state.questions.length - this.state.listCount >= 2
                              ?
                              <Button
                                className="btn-round"
                                color="success"
                                type="button"
                                onClick={() => this.nextQuestion()}
                              >
                                Next
                              </Button>

                              :
                              null
                          }

                          <Button
                            className="btn-round"
                            color="primary"
                            type="button"
                            onClick={() => this.submitSurvey()}
                          >
                            Submit
                          </Button>
                        </div>
                      </Row>
                    </CardBody>
                }
              </Card>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }

  renderSpinner() {
    return (
      <Col md={{ span: 6, offset: 5 }}>
        <Spinner type="grow" color="primary" />
        <Spinner type="grow" color="success" />
        <Spinner type="grow" colr="danger" />
        <Spinner type="grow" color="warning" />
        <Spinner type="grow" color="info" />
        <Spinner type="grow" color="light" />
        <Spinner type="grow" color="dark" />
        <h2 className="ml-5">Loading Survey</h2>
      </Col>
    )
  }

  renderInactive() {
    return (
      <Col md={{ span: 6, offset: 5 }}>
        <h2 className="ml-5">Inactive Survey</h2>
      </Col>
    )
  }

  toggleModal() {
    this.setState({ thankyouModal: !this.state.thankyouModal })
  }

  render() {
    return (
      <>
        <UserHeader name={this.state.surveyTitle} />
        {/* Page content */}
        <Container className="mt--9" fluid>
          <Modal centered={true} isOpen={this.state.thankyouModal} toggle={() => this.toggleModal()}>
            <ModalHeader><h1>ThankYou!</h1></ModalHeader>
            <ModalBody >
              <span className="avatar avatar-lg rounded-circle">
                <img
                  src={this.state.imgSrc[1].icon}
                />
              </span>
              <h4>The Survey has been Submitted</h4>
              <h4>Thank you for your valuable feedback!</h4>
            </ModalBody>
            <ModalFooter>
              {/* <Button color="danger" onClick={() => this.deleteSurvey(this.state.surveyCustId)}>Delete</Button>{' '}
            <Button color="secondary" onClick={() => this.toggleModal()} >Cancel</Button> */}
            </ModalFooter>
          </Modal>
          <Col className="order-xl-1">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="justify-content-between">
                  <Col xs="8">
                    <h3 className="mb-0">Survey</h3>
                  </Col>
                  <Col xs="2">
                    <Progress value={((this.state.listCount + 1) / this.state.questions.length) * 100} className="mt-3" />
                  </Col>
                  <Col xs="2">
                    <h2>{this.state.listCount + 1}/{this.state.questions.length}</h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {
                  this.state.loading
                    ? this.renderSpinner()
                    : (this.state.surveyState) ? this.renderForm() : this.renderInactive()
                }
              </CardBody>
            </Card>
          </Col>
        </Container>
      </>
    )
  }
}

function mapState(state) {
  const { survey, alert } = state;
  return { survey, alert };
}

const actionCreators = {
  getByIdSurvey: surveyActions.getById,
  clearAlerts: alertActions.clear,
  submitSurvey: surveyActions.submitAnswer,
  getComments: surveyActions.getComments,
};

const connectedSurveyPage = connect(mapState, actionCreators)(SurveyPage);
export { connectedSurveyPage as SurveyPage };