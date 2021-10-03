import React from "react";
// reactstrap components
import {
  ButtonGroup,
  Card,
  CardHeader,
  Table,
  Label,
  Container,
  Row,
  Col,
  Dropdown,
  Popover,
  PopoverHeader,
  PopoverBody,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import Select from 'react-select';
// core components
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import { history } from '../../_helpers';
import classnames from "classnames";
import QRCode from 'qrcode.react';
import { surveyActions, alertActions } from '../../_actions';
import {Header} from "../components/Headers/Header.js";
const selectOption = [
  { value: 5, label: 5},
  { value: 10, label: 10},
  { value: 20, label: 20},
  { value: 30, label: 30}
]
import { URL_CONSTANTS } from '../../_constants';

class Survey extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          deleteModal: false,
          qrModal: false,
          surveyCustId: '',
          popSurvey: [],
          survey: {},
          linkModal: false,
          selectSurveyQR: '',
          searchText: '',
          comments: [],
          initialrow:0,
          rowsperpage: 5,
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

      toggleCommentModal(surveyCustId, answerId){
        console.log(surveyCustId, answerId)
        if(surveyCustId){
          this.props.getComments(surveyCustId, answerId);
        }
        this.setState({ commentModal: !this.state.commentModal })
      }

      
      toggleLinkModal(dcode){
        this.setState({ linkModal: !this.state.linkModal, selectSurveyQR: (dcode) ? dcode: '' })
      }

      togglePopover(item, i){
        var pSurvey = this.state.popSurvey;
        pSurvey[i] = !pSurvey[i];
        this.setState({ popSurvey: pSurvey, surveyCustId: item.surveyCustId })
      }
      
      componentDidMount(){
        this.props.getSurveys();
      }

      componentWillReceiveProps(nextProps){
        if(nextProps.alert.message && nextProps.alert.message != 'Invalid dcode'){
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
          this.props.clearAlerts()
        }
        if(nextProps.survey.data && nextProps.survey.data instanceof Array){
          var popAr = []
          nextProps.survey.data.map((i) => {
            popAr.push(false);
          })
          this.setState({ survey: nextProps.survey.data, popSurvey: popAr })
        }
        if(nextProps.survey.comments){
          this.setState({ comments: nextProps.survey.comments })
        }
      }

      onChangeSearch(e){
        this.setState({ searchText: e.target.value})
        if(e.target.value == '')
          this.props.getSurveys()
        else
        this.props.searchSurvey(e.target.value)
      }

      downloadQR = () => {
        const canvas = document.getElementById("qrcode");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      copyLink(text){
        navigator.clipboard.writeText(text);
      }
      
      editSurvey(data){
        history.push({
          pathname: '/admin/survey/edit',
          data: data
        })
      }

      surveyResult(data){
        history.push({
          pathname: '/admin/survey/result',
          data: data
        })
      }

      deleteSurvey(surveyCustId){
        this.toggleModal();
        this.props.deleteSurveys(surveyCustId);
      }

      addSurvey(){
        history.push('/admin/survey/add')
      }

      toggleDeleteModal(surveyCustId){
        this.setState({ deleteModal: !this.state.deleteModal, surveyCustId: surveyCustId})
      }

      toggleModal(){
        this.setState({ deleteModal: !this.state.deleteModal })
      }

      toggleQRModal(dcode){
        this.setState({ qrModal: !this.state.qrModal, selectSurveyQR: (dcode) ? dcode: '' })
      }

      updateStatus(surveyCustId, status, e){
        e.preventDefault();
        this.props.updateSurveyStatus(surveyCustId, status)
      }

      onRowsChange(item){
        this.setState({ rowsperpage: item.value + this.state.initialrow })
      }

      prevPagination(){
        if(this.state.initialrow != 0)
          this.setState({ initialrow: this.state.initialrow - this.state.rowsperpage })
      }
    
      fixedPagination(num){
        this.setState({ initialrow: (num - 1) * this.state.rowsperpage })
        }
    
      nextPagination(){
          this.setState({ initialrow: this.state.initialrow + this.state.rowsperpage })
      }
  render() {
    console.log("render123",this.state.initialrow, this.state.rowsperpage)
    return (
      <>
        <Header />
        
        {/* Page content */}
        <Container className="mt--7" fluid>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={this.state.deleteModal} toggle={() => toggleModal()}>
          <ModalHeader>Delete Survey</ModalHeader>
          <ModalBody>
          Permanently DELETE this Survey?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.deleteSurvey(this.state.surveyCustId)}>Delete</Button>{' '}
            <Button color="secondary" onClick={() => this.toggleModal()} >Cancel</Button>
          </ModalFooter>
        </Modal>
          {/* Dark table */}
            <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-1">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0 text-white">Surveys</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#add"
                        onClick={() => this.addSurvey()}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </Row>
                  <Row>
                    <Input                                     
                      placeholder="Search" 
                      type="search" 
                      autoComplete="search-survey"
                      className="bg-default shadow mt-3"
                      value={this.state.searchText}
                      onChange={(e) => this.onChangeSearch(e)}
                    />
                  </Row>
                </CardHeader>

                <Table  className="align-items-center table-flush table-white" responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Survey name</th>
                      <th scope="col">Questions</th>
                      <th scope="col">Active</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                      <th scope="col">Link</th>
                      <th scope="col">Survey Code</th>
                      <th scope="col">QR Code</th>
                      <th scope="col">Report</th>
                      <th scope="col">Result</th>
                    </tr>
                  </thead>
                  <tbody style={{ height: 100 }}>
                  {
                    (this.props.survey.error == "No matched surveys") && this.state.searchText != ""
                    ?
                    <td colSpan={10} className="align-items-center bg-white">
                      <div className="col">
                        <h3 className="m-3 text-center text-dark">No matched surveys</h3>
                      </div>
                    </td>
                    : 
                    this.state.survey && this.state.survey instanceof Array && this.state.survey.slice(this.state.initialrow,this.state.rowsperpage + this.state.initialrow).map((item, i) => (
                      <tr scope="row">
                      <th onClick={() => this.togglePopover(item,i)} id={"survey" + i}>{item.surveyName}</th>
                      <Modal isOpen={this.state.popSurvey[i]} centered toggle={() => this.togglePopover(item,i)}>
                      <ModalHeader>{item.surveyName}</ModalHeader>
                      <ModalBody className="bg-default shadow">
                        <Row className="justify-content-between">
                          <span className="avatar avatar-sm rounded-circle mx-1 my-1">
                              <img src={this.state.imgSrc[0].icon}/>
                          </span>
                          <span className="avatar avatar-sm rounded-circle mx-1 my-1">
                              <img src={this.state.imgSrc[1].icon}/>
                          </span>
                          <span className="avatar avatar-sm rounded-circle mx-1 my-1">
                              <img src={this.state.imgSrc[2].icon}/>
                          </span>
                          <span className="avatar avatar-sm rounded-circle mx-1 my-1">
                              <img src={this.state.imgSrc[3].icon}/>
                          </span>
                          <span className="avatar avatar-sm rounded-circle mx-1 my-1">
                              <img src={this.state.imgSrc[4].icon}/>
                          </span>
                          <h3 className="text-info mt-1">{item.firstQuestionDetail.totalRatings} out of 5</h3>
                        </Row>
                        <h3 className="text-info text-center my-1">{item.visitorsCount} Customer Ratings</h3>
                          <Row className="justify-content-between">
                            <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                              <img src={this.state.imgSrc[0].icon}/>
                            </span>
                            <div style={{width: 200}} className="mt-3">
                              
                            <Progress value={item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0}/>
                            </div>
                            <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0)}%</h2>
                          </Row>
                          <Row className="justify-content-between">
                            <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                              <img src={this.state.imgSrc[1].icon}/>
                            </span>
                            <div style={{width: 200}} className="mt-3">
                            <Progress value={item.firstQuestionDetail.satisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0}/>
                            </div>
                            <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.satisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0)}%</h2>
                          </Row>
                          <Row className="justify-content-between">
                            <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                              <img src={this.state.imgSrc[2].icon}/>
                            </span>
                            <div style={{width: 200}} className="mt-3">
                            <Progress value={item.firstQuestionDetail.neutral/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0}/>
                            </div>
                            <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.neutral/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0)}%</h2>
                          </Row>
                          <Row className="justify-content-between">
                            <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                              <img src={this.state.imgSrc[3].icon}/>
                            </span>
                            <div style={{width: 200}} className="mt-3">
                            <Progress value={item.firstQuestionDetail.unsatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0}/>
                            </div>
                            <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.unsatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0)}%</h2>
                          </Row>
                          <Row className="justify-content-between">
                            <span className="avatar avatar-sm rounded-circle mx-3 my-1">
                              <img src={this.state.imgSrc[4].icon}/>
                            </span>
                            <div style={{width: 200}} className="mt-3">
                            <Progress value={item.firstQuestionDetail.veryUnsatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0}/>
                            </div>
                            <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.veryUnsatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100 || 0)}%</h2>
                          </Row>
                          <Row className="justify-content-center">
                            <Button size="lg" className="btn btn-icon btn-3 btn-outline-primary align-center" onClick={() => this.toggleCommentModal(this.state.surveyCustId, item.firstQuestionId)}>
                              <i className="fas fa-th-list text-warning"/>
                              <span className="btn-inner--text">Comments</span>
                            </Button>
                          </Row>
                        </ModalBody>
                      </Modal>
                      <td>{item.totalQuestions}</td>
                      <td>
                        <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active, e )}>
                          <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                          <span className="custom-toggle-slider rounded-circle "></span>
                        </Label>
                      </td>
                      <td>
                        <Button size="sm" className="btn btn-icon btn-3 btn-outline-success" onClick={() => this.editSurvey(item)}>
                            <span className="btn-inner--text">EDIT</span>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" className="btn btn-icon btn-3 btn-outline-danger" data-toggle="modal" data-target="#modal-default" onClick={() => this.toggleDeleteModal(item.surveyCustId)}>
                          <span className="btn-inner--text">DELETE</span>
                        </Button>
                      </td>
                      <td>
                      <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                          <i className="fas fa-link text-warning"/>
                          <span className="btn-inner--text">Link</span>
                        </Button>

                      </td>
                      <th className="text-center">{item.dcode}</th>
                      <td>
                        <Button size="sm" className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
                          <i className="fas fa-qrcode text-success"/>
                          <span className="btn-inner--text">QR CODE</span>
                        </Button>
                      </td>

                      <td>
                        <Button size="sm" className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.props.reportDownload(item.surveyCustId)}>
                          <i className="fas fa-download text-success"/>
                          <span className="btn-inner--text">REPORT</span>
                        </Button>
                      </td>

                      <td>
                        <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary"  onClick={() => this.surveyResult(item)}>
                          <i className="fas fa-th-list text-warning"/>
                          <span className="btn-inner--text">RESULT</span>
                        </Button>
                      </td>
                    </tr>
                    ))
                  }

                    <Modal isOpen={this.state.linkModal} centered toggle={() => this.toggleLinkModal()}>
                      <ModalHeader className="bg-info" toggle={() => this.toggleLinkModal()}>
                        <h2 color="primary" className="text-left">Link</h2>
                      </ModalHeader>
                      <ModalBody className="d-block text-center">
                        <Card className="p-2 bg-default">
                        <a href={URL_CONSTANTS.SURVEY_URL + this.state.selectSurveyQR } className="text-white" target="_blank">{URL_CONSTANTS.SURVEY_URL + this.state.selectSurveyQR }</a>
                        </Card>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="success" onClick={() => this.copyLink(URL_CONSTANTS.SURVEY_URL + this.state.selectSurveyQR)}>Copy</Button>{' '}
                      </ModalFooter>
                    </Modal>


                    <Modal isOpen={this.state.qrModal} centered toggle={() => this.toggleQRModal()}>
                      <ModalHeader  className="bg-info" toggle={() => this.toggleQRModal()}>
                      <Row>
                           <Col>
                            <h2 color="primary" className="text-left">Survey QRCode</h2>
                          </Col>
                      </Row>
                      </ModalHeader>
                      <ModalBody className="d-block text-center">
                        <QRCode
                          id="qrcode"
                          value= {URL_CONSTANTS.SURVEY_URL + this.state.selectSurveyQR }
                          size={290}
                          imageSettings= {{
                            src: "/src/assets/img/icons/smiley/satisfied.png",
                            x: null,
                            y: null,
                            height: 60,
                            width: 60,
                            excavate: true,
                          }}
                          level={"H"}
                          includeMargin={true}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="success" onClick={() => this.downloadQR()}>Download QR</Button>{' '}
                      </ModalFooter>
                    </Modal>
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
                  <CardFooter>
                    <Row className="float-right">
                      <h3 className="mt-1 mx-1 font-weight-normal">Rows per table</h3>
                      <div style={{width: '70px', marginRight: '20px'}}>
                        <Select options={selectOption} autosize={true} defaultValue={{ value: 5, label: 5}} onChange={(value) => this.onRowsChange(value)}/>
                      </div>
                      <ButtonGroup className="mx-1">
                        <Button disabled={this.state.initialrow == 0} onClick={() => this.prevPagination()}>Previous</Button>
                        <Button onClick={() => this.fixedPagination(1)}>1</Button>
                        <Button onClick={() => this.fixedPagination(2)}>2</Button>
                        <Button onClick={() => this.fixedPagination(3)}>3</Button>
                        <Button onClick={() => this.nextPagination()}>Next</Button>
                      </ButtonGroup>
                    </Row>
                  </CardFooter>
              </Card>
        </Container>
      </>
    );
  }
}

function mapState(state) {
  console.log("State", state)
  const survey = state.survey;
  const alert = state.alert;
  return { survey, alert };
}

const actionCreators = {
  getSurveys: surveyActions.getAll,
  deleteSurveys: surveyActions._delete,
  searchSurvey: surveyActions.search,
  getComments: surveyActions.getComments,
  reportDownload: surveyActions.downloadReport,
  updateSurveyStatus: surveyActions.updateStatus,
  clearAlerts: alertActions.clear
};

const connectedSurvey = connect(mapState, actionCreators)(Survey);
export { connectedSurvey as Survey };