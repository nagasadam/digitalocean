import React from "react";
// reactstrap components
import {
  Alert,
  Badge,
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardBody,
  ButtonDropdown,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Form,
  FormGroup,
  FormText,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
// core components
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import { store } from 'react-notifications-component';
import { surveyActions, alertActions, questionbankActions } from '../../_actions';
import {Header} from "../components/Headers/Header.js";


class SurveyEdit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          surveyName: '',
          dcode: '',
          surveyCustId: '',
          active: false,
          surveyquestions: [],
          questionbank: [],
          openactive: false,
          dropdownOpen: [ false ]
        }
      }

      componentDidMount(){
        this.props.getQuestions();
        if(this.props.location.data){
          var dcode = this.props.location.data.dcode;
          this.props.getByIdSurvey(dcode);
        }
      }
      
      componentWillReceiveProps(nextProps) {
        if(nextProps.survey.data && nextProps.survey.data.questions instanceof Array){
          var qdata = []
          nextProps.survey.data.questions.map((q, i) => {
            qdata.push(false);
          })
          this.setState({
            surveyName: nextProps.survey.data.surveyName,
            dcode: nextProps.survey.data.dcode,
            surveyCustId: nextProps.survey.data.surveyCustId,
            surveyquestions: nextProps.survey.data.questions,
            dropdownOpen: qdata,
            active: nextProps.survey.data.active
          });
        }
        if(nextProps.questionbank.data && nextProps.questionbank.data instanceof Array){
          this.setState({ questionbank: nextProps.questionbank.data })
        }
        if(nextProps.alert.message){
          store.addNotification({
            title: 'Survey',
            message: nextProps.alert.message,
            type: nextProps.alert.type,                         // 'default', 'success', 'info', 'warning'
            container: 'top-right',                // where to position the notifications
            animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
            animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
            dismiss: {
              duration: 1000 
            }
          })
          this.props.clearAlerts();
        }
      }

      addQuestion(){
        var questions = this.state.surveyquestions;
        var question = { question : ''}
        questions.push(question)
        this.setState({ surveyquestions: questions })
      }

      toggleOpen(i){
        var dropdownOpen = this.state.dropdownOpen;
        dropdownOpen[i] = !this.state.dropdownOpen[i];
        this.setState({ dropdownOpen: dropdownOpen })
      }

      onChange(e, i){
        if(e.target.type == 'textarea'){
          var questions = this.state.surveyquestions;
          questions[i].question = e.target.value;
          this.setState({ surveyquestions: questions })
        }
        else{
          e.target.placeholder == 'Name'
            ? this.setState({ surveyName: e.target.value })
            : this.setState({ dcode: e.target.value })
        }
      }

      deleteQuestion(i){
        const questions = this.state.surveyquestions;
        questions.splice(i,1);
        this.setState({ surveyquestions: questions})
      }

      updateSurvey(e){
        e.preventDefault();
        const questions = this.state.surveyquestions.map(item => {
          return { question : item.question }
        })
        this.props.updateSurvey(this.state.surveyCustId, questions, this.state.surveyName, this.state.active, this.state.dcode)
      }

      CreateSurvey(e){
        e.preventDefault();
        this.props.createSurvey(this.state.surveyquestions, this.state.surveyName, this.state.dcode)
      }

      onChangeDropItem(qb, i){
        var squestions = this.state.surveyquestions;
        var sq = { _id: qb._id, question: qb.question }
        squestions[i] = sq;
        this.setState({ surveyquestions: squestions })
      }

      toggleActive(){
        this.setState({ openactive: !this.state.openactive })
      }

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}
          <Card className="card-user">
          <CardHeader className="bg-transparent border-1">
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0 text-white">Surveys</h3>
              </div>
              {
                this.props.location.data 
                ?
                <div className="col text-right">
                <ButtonDropdown isOpen={this.state.openactive} toggle={() => this.toggleActive()}>
                  <DropdownToggle caret>
                    {this.state.active ? "Active" : "Disable"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem  onClick={() => this.setState({ active: true })}>Active</DropdownItem>
                    <DropdownItem  onClick={() => this.setState({ active: false })}>Disable</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
                </div>
                : null
              }
            </Row>
          </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-1" md="6">
                    <FormGroup>
                      <label>Survey Name</label>
                      <Input
                        placeholder="Name"
                        value={this.state.surveyName}
                        onChange={(e) => this.onChange(e)}
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-1" md="6">
                    <FormGroup>
                      <label>Dimple Code</label>
                      <Input
                        value={this.state.dcode}
                        onChange={(e) => this.onChange(e)}
                        placeholder="Dcode"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                { this.state.surveyquestions instanceof Array && this.state.surveyquestions.map((item, i) => (
                  <Row>
                  <Col md="12">
                    <FormGroup>
                      <Col>
                      <label>Question {i+1}</label>
                      </Col>
                      <Row mb="2" className="mb-2">
                        <Col md="10" className="pr-0">
                          <ButtonDropdown color="blue" isOpen={this.state.dropdownOpen[i]} className="btn-block" toggle={() => this.toggleOpen(i)}>
                            <DropdownToggle caret className="btn-block">
                              Questions
                            </DropdownToggle>
                            <DropdownMenu className="btn-block">
                              {
                                this.state.questionbank.map((qb, j) => (
                                  <DropdownItem className="btn-block overflow-hidden" onClick={() => this.onChangeDropItem(qb, i)}>{qb.question}</DropdownItem>
                                ))
                              }
                            </DropdownMenu>
                          </ButtonDropdown>
                        </Col>
                        <Col md="2" className="pl-0">
                          <Button size="md" className="btn btn-block btn-3 btn-outline-danger" onClick={() => this.deleteQuestion(i)}>
                            <span className="btn-inner--text">DELETE</span>
                          </Button>
                        </Col>
                      </Row>
                      <Input
                        type="textarea"
                        value={item.question}
                        onChange={(e) => this.onChange(e,i)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                ))}
                <Row>
                  <div className="update ml-auto mr-auto">
                    <Button
                      className="btn-round"
                      color="primary"
                      type="button"
                      onClick={() => this.addQuestion()}
                    >
                      Add Question
                    </Button>

                    {
                      this.props.location.data ?
                      <Button
                        className="btn-round"
                        color="success"
                        type="button"
                        onClick={(e) => this.updateSurvey(e)}
                      >
                        Update Survey
                      </Button>
                      :
                      <Button
                        className="btn-round"
                        color="success"
                        type="button"
                        onClick={(e) => this.CreateSurvey(e)}
                      >
                        Create Survey
                      </Button>
                    }
                  </div>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

function mapState(state) {
  const {survey,questionbank, alert} = state;
  return { survey, questionbank, alert};
}

const actionCreators = {
  getByIdSurvey: surveyActions.getById,
  getQuestions: questionbankActions.getAll,
  updateSurvey: surveyActions.update,
  createSurvey: surveyActions.create,
  clearAlerts: alertActions.clear
};

const connectedSurvey = connect(mapState, actionCreators)(SurveyEdit);
export { connectedSurvey as SurveyEdit };