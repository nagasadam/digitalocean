import React from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Label,
  Container,
  Row,
  Col,
  Popover,
  PopoverHeader,
  PopoverBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  CardBody,
  CardTitle
} from "reactstrap";
// core components
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import { surveyActions, alertActions } from '../../_actions';
import {Header} from "../components/Headers/Header.js";
import Select from "react-select";

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
let searchOption = []


const searchStyle = {
  container: base => ({
    ...base,
    marginTop: 10,
    flex: 1
  })
};


class SurveyResult extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          surveyCustId : '',
          result: '',
          surveyName: '',
          comments: [],
          avgNoOfQuestionsAttempted: 0,
          totalQuestions: 0,
          visitorsCount: 0,
          surveyCustId: '',
          searchText: '',
          commentModal: false,
          imgSrc : [
            { icon: '/src/assets/img/icons/smiley/very-satisfied.png' },
            { icon: '/src/assets/img/icons/smiley/satisfied.png' },
            { icon: '/src/assets/img/icons/smiley/neutral.png' },
            { icon: '/src/assets/img/icons/smiley/unsatisfied.png' },
            { icon: '/src/assets/img/icons/smiley/very-unsatisfied.png' },
        ]

        }
    }

    componentDidMount(){
      if(this.props.location.data){
        this.setState({ surveyCustId: this.props.location.data.surveyCustId })
        this.props.surveyDetails(this.props.location.data.surveyCustId);
      }
      else{
        this.props.getSurveys();
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      if(nextProps.result.data){
        this.setState({ 
          avgNoOfQuestionsAttempted: nextProps.result.data.avgNoOfQuestionsAttempted,
          visitorsCount: nextProps.result.data.visitorsCount,
          surveyName: nextProps.result.data.surveyName,
          surveyCustId: nextProps.result.data.surveyCustId,
          totalQuestions: nextProps.result.data.totalQuestions,
          result: nextProps.result.data.questionsInfo })
      }
      if(nextProps.result){
        if(nextProps.result.comments){
          this.setState({ comments: nextProps.result.comments })
        }
        else{
          Array.isArray(nextProps.result.data) && nextProps.result.data.map( a => {
            console.log(a)
            let surveyData = {value: a.surveyName, label: a.surveyName, surveyCustId: a.surveyCustId}
            searchOption.push(surveyData)
          })
        }
      }
    }

    toggleCommentModal(surveyCustId, answerId){
      if(surveyCustId){
        this.props.getComments(surveyCustId, answerId);
      }
      this.setState({ commentModal: !this.state.commentModal })
    }

    onSearchClick(e){
      this.props.surveyDetails(e.surveyCustId);
    }

    render(){
        return(
          <>
          <Header />
          {/* Page content */}
          <Container className="mt--7" fluid>
          <Row className="mb-3">
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            USER ATTEMPTS
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.visitorsCount}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            QUESTIONS
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.totalQuestions}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-poll" />
                          </div>
                        </Col>
                      </Row>

                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            AVG QUESTION ATTEMPTS
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.avgNoOfQuestionsAttempted}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                            <i className="fas fa-poll" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
          {/* Delete Confirmation Modal */}
            {/* Dark table */}
              <Card className="bg-default shadow">
                  <CardHeader className="bg-transparent border-1">
                    <Row className="align-items-center">
                      <div className="col">
                        <h3 className="mb-0 text-white">Survey Result</h3>
                      </div>
                      {/* <div className="col text-right">
                        <Button
                          color="primary"
                          href="#pablo"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div> */}
                    </Row>
                    <Row>
                      {
                        (this.props.location.data)
                          ? null
                          :
                            <Select
                            styles={searchStyle}
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="color"
                            onChange={(e) => this.onSearchClick(e)}
                            options={searchOption}/>
                      }
                  </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush table-white" responsive>
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Questions</th>
                        <th scope="col">
                          <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                            <img src={this.state.imgSrc[0].icon}/>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                            <img src={this.state.imgSrc[1].icon}/>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                            <img src={this.state.imgSrc[2].icon}/>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                            <img src={this.state.imgSrc[3].icon}/>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                            <img src={this.state.imgSrc[4].icon}/>
                          </span>
                        </th>
                        <th scope="col">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.result && this.state.result instanceof Array && this.state.result.map((item, i) => (
                          <tr scope="row">
                            <td><h3 className="text-center">{item.question}</h3></td>
                            <td><h3 className="text-center">{item.verySatisfied}</h3></td>
                            <td><h3 className="text-center">{item.satisfied}</h3></td>
                            <td><h3 className="text-center">{item.neutral}</h3></td>
                            <td><h3 className="text-center">{item.unsatisfied}</h3></td>
                            <td><h3 className="text-center">{item.veryUnsatisfied}</h3></td>
                            <td>
                            <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleCommentModal(this.state.surveyCustId, item._id)}>
                              <i className="fas fa-th-list text-warning"/>
                              <span className="btn-inner--text">Comments</span>
                            </Button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                  <Modal isOpen={this.state.commentModal} centered toggle={() => this.toggleCommentModal()}> 
                    <ModalHeader className="bg-info">
                      <h2 color="primary" className="text-left">Comments</h2>
                    </ModalHeader>
                      <ModalBody className="d-block text-center">
                        <Card className="p-2 bg-default">
                        <Table className="align-items-center table-flush table-white" responsive>
                          <thead className="thead-dark">
                            <tr>
                            <th scope="col">Sl No</th>
                            <th scope="col">Comments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              (Array.isArray(this.state.comments) && this.state.comments.length > 0)
                              ?
                                this.state.comments && this.state.comments instanceof Array && this.state.comments.map((comment, i) => (
                                    <tr scope="row">
                                      <td><h3 className="text-center">{i+1}</h3></td>
                                      <td><h3 className="text-center">{comment}</h3></td>
                                    </tr>
                                  ))
                              :
                                <td colSpan={10} className="align-items-center bg-white">
                                <div className="col">
                                  <h3 className="m-3 text-center text-dark">No Comments</h3>
                                </div>
                              </td>
                            }
                          </tbody>
                        </Table>
                        </Card>
                      </ModalBody>
                  </Modal>
                </Card>
          </Container>
        </>
        )
    }
}

function mapState(state) {
    const result = state.survey;
    const alert = state.alert;
    const comments = state.comments;
    return { result, alert, comments };
  }
  
  const actionCreators = {
    reportDownload: surveyActions.downloadReport,
    surveyDetails: surveyActions.getResult,
    getComments: surveyActions.getComments,
    getSurveys: surveyActions.getAll,
    clearAlerts: alertActions.clear
  };
  
  const connectedSurveyResult = connect(mapState, actionCreators)(SurveyResult);
  export { connectedSurveyResult as SurveyResult };