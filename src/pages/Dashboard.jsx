import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import QRCode from 'qrcode.react';
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  TabContent,
  TabPane,
  Col,
  Form,
  FormGroup,
  ButtonToggle,
  NavbarToggler,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { connect } from 'react-redux';
import Select from 'react-select';
import { history } from '../../_helpers';
import { store } from 'react-notifications-component';
import { userActions, alertActions, surveyActions, dashboardActions } from '../../_actions';
import QrReader from 'react-qr-reader';
import {Header} from "../components/Headers/Header.js";
import { Redirect } from "react-router-dom";
import { survey } from "../../_reducers/survey.reducer";
import { URL_CONSTANTS } from '../../_constants';

const selectOption = [
  { value: 5, label: 5},
  { value: 10, label: 10},
  { value: 20, label: 20},
  { value: 30, label: 30}
]

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      recentCreatedSurveys: [],
      recentSubmittedSurveys: [],
      sureys:[],
      activesurveylist: [],
      inactivesurveylist: [],
      tabs: 1,
      deleteModal: false,
      linkModal: false,
      qrModal: false,
      selectSurveyQR: '',
      surveyCount: 0,
      survey: false,
      activesurvey: false,
      inactivesurvey: false,
      activeSurveyCount: 0,
      inactiveSurveyCount: 0,
      searchText: '',
      comments: [],
      commentModal: false,
      surveyCustId: '',
      initialrow:0,
      rowsperpage: 5,
      popSurvey: [],
      imgSrc : [
        { icon: '/src/assets/img/icons/smiley/very-satisfied.png' },
        { icon: '/src/assets/img/icons/smiley/satisfied.png' },
        { icon: '/src/assets/img/icons/smiley/neutral.png' },
        { icon: '/src/assets/img/icons/smiley/unsatisfied.png' },
        { icon: '/src/assets/img/icons/smiley/very-unsatisfied.png' },
      ]
    };

    history.listen((location, action) => {
      this.props.clearAlerts();
    });
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

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };

  onChangeSearchText(e){
    this.setState({ searchText: e.target.value })
  }

  togglePopover(item, i){
    var pSurvey = this.state.popSurvey;
    pSurvey[i] = !pSurvey[i];
    this.setState({ popSurvey: pSurvey, surveyCustId: item.surveyCustId })
  }

  addSurvey(){
    history.push('/admin/survey/add')
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    
    if(this.state.searchText == '' && nextProps.dashboarddata.data){
      this.setState({ 
        recentCreatedSurveys: nextProps.dashboarddata.data.recentCreatedSurveys,
        recentSubmittedSurveys: nextProps.dashboarddata.data.recentSubmittedSurveys
      })
    }

    if(nextProps.survey.comments){
      this.setState({ comments: nextProps.survey.comments })
    }

    if(nextProps.survey.data){
      this.setState({ sureys: nextProps.survey.data})
    }

    if(nextProps.activesurvey.data){
      this.setState({ activesurveylist: nextProps.activesurvey.data})
    }

    if(nextProps.inactivesurvey.data){
      this.setState({ inactivesurveylist: nextProps.inactivesurvey.data})
    }

    if(nextProps.alert.message){
      console.log(nextProps.alert)
      store.addNotification({
        title: 'Survey',
        isMobile: true,
        breakpoint: 769,
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
  }

  surveyResult(data){
    history.push({
      pathname: '/admin/survey/result',
      data: data
    })
  }

  componentDidMount(){
    this.props.getDashboardData()
    this.props.getSurvey()
    this.props.getActiveSurvey()
    this.props.getInactiveSurvey()
  }

  onChangeSearch(e){
    this.setState({ searchText: e.target.value })
    if(this.state.searchText == '')
      this.props.getDashboardData()
    else
      this.props.searchSurvey(this.state.searchText)
  }

  updateStatus(surveyCustId, status, e){
    e.preventDefault()
    this.props.updateSurveyStatus(surveyCustId, status)
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
  
  toggleDeleteModal(surveyCustId){
    this.setState({ deleteModal: !this.state.deleteModal, surveyCustId: surveyCustId})
  }

  toggleModal(){
    this.setState({ deleteModal: !this.state.deleteModal })
  }

  toggleLinkModal(dcode){
    this.setState({ linkModal: !this.state.linkModal, selectSurveyQR: (dcode) ? dcode: '' })
  }

  toggleQRModal(dcode){
    this.setState({ qrModal: !this.state.qrModal, selectSurveyQR: (dcode) ? dcode: '' })
  }

  toggleCommentModal(surveyCustId, answerId){
    if(surveyCustId){
      this.props.getComments(surveyCustId, answerId);
    }
    this.setState({ commentModal: !this.state.commentModal })
  }

  surveyactive(active){
    this.setState({
      survey: (active.totalsurvey) ? active.totalsurvey : false,
      activesurvey: (active.activesurvey) ? active.activesurvey : false,
      inactivesurvey: (active.inactivesurvey) ? active.inactivesurvey : false,
    })
  }

  
  render() {
    var surveyList = (this.state.searchText != '') ? this.state.sureys :this.state.recentCreatedSurveys;
    return (
      <>
        <Header getAllSurvey={(value) => this.surveyactive(value)}/>
        {/* Page content */}
        <Container className="mb-7" fluid>
        {!this.state.activesurvey && !this.state.inactivesurvey && !this.state.survey
         ?<div className="nav-wrapper">
          <Nav
            className="nav-fill flex-column flex-sm-row"
            id="tabs-icons-text"
            pills
            role="tablist"
          >
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 1}
                className={classnames("mb-sm-3 mb-md-0", {
                  active: this.state.tabs === 1
                })}
                onClick={e => this.toggleNavs(e, "tabs", 1)}
                href=""
                role="tab"
              >
                <i className="ni ni-cloud-upload-96 mr-2" />
                Recently Created Surveys
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 2}
                className={classnames("mb-sm-3 mb-md-0", {
                  active: this.state.tabs === 2
                })}
                onClick={e => this.toggleNavs(e, "tabs", 2)}
                href="#pablo"
                role="tab"
              >
                <i className="ni ni-bell-55 mr-2" />
                Recently Submitted Surveys
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        : null}
        <Modal isOpen={this.state.linkModal} centered toggle={() => this.toggleLinkModal()}>
                        <ModalHeader className="bg-default" toggle={() => this.toggleLinkModal()}>
                          <h2 className="text-white text-left">Link</h2>
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
        {
          this.state.survey
          ?
          <Row className="">
          <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-1">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0 text-white">Surveys</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={() => history.push('/admin/surveys')}
                      size="sm"
                    >
                      SEE ALL
                    </Button>
                  </div> */}
                </Row>
                <Row>
                <Input                                     
                  placeholder="Search" 
                  type="search" 
                  // style={{ width: "900px", marginRight: "20px"}}
                  autoComplete="search-survey"
                  className="bg-default shadow mt-1"
                  value={this.state.searchText}
                  onChange={(e) => this.onChangeSearch(e)}
                />
                {/* <Button color="primary" size="md" onClick={() => this.onChangeSearch()}>Search</Button> */}
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush table-white" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Survey name</th>
                    <th scope="col">Questions</th>
                    <th scope="col">Active</th>
                    <th scope="col">Link</th>
                    <th scope="col">Survey Code</th>
                    <th scope="col">QR Code</th>
                    <th scope="col">Report</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                
                {
                    (this.props.survey.error == "No matched surveys") && this.state.searchText != ""
                    ?
                    <td colSpan={10} className="align-items-center bg-white">
                      <div className="col">
                        <h3 className="m-3 text-center text-dark">No matched surveys</h3>
                      </div>
                    </td>
                    : 
                    this.state.sureys && this.state.sureys instanceof Array && this.state.sureys.slice(this.state.initialrow,this.state.rowsperpage + this.state.initialrow).map((item, i) => (
                      <tr>
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
                              <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100) || 0}%</h2>
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
                        <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active,e )}>
                          <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                        <span className="custom-toggle-slider rounded-circle "></span>
                        </Label>

                      </td>
                      <td>
                      <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                          <i className="fas fa-link text-warning"/>
                          <span className="btn-inner--text">Link</span>
                        </Button>
                      </td>

                      <th className="text-center">{item.dcode}</th>

                      <td>
                        <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
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
                <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.surveyResult(item)}>
                  <i className="fas fa-th-list text-warning"/>
                  <span className="btn-inner--text">RESULT</span>
                </Button>
              </td>
                    </tr>
                    ))
                }

                <Modal isOpen={this.state.qrModal} centered toggle={() => toggleModal()}>
                  <ModalHeader><h2 color="primary">Survey QRCode</h2></ModalHeader>
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
                    <Button color="secondary" onClick={() => this.toggleQRModal()} >Close</Button>
                  </ModalFooter>
                </Modal>
                </tbody>
              </Table>
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
          </Col>
        </Row>
        : null
        }
        {
          this.state.activesurvey
          ?
          <Row className="">
          <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-1">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0 text-white">Active Surveys</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={() => history.push('/admin/surveys')}
                      size="sm"
                    >
                      SEE ALL
                    </Button>
                  </div> */}
                </Row>
                <Row>
                <Input                                     
                  placeholder="Search" 
                  type="search" 
                  // style={{ width: "950px", marginRight: "20px", marginTop: "20px"}}
                  autoComplete="search-survey"
                  className="bg-default shadow mt-1"
                  value={this.state.searchText}
                  onChange={(e) => this.onChangeSearch(e)}
                />
                {/* <Button color="primary" size="md" onClick={() => this.onChangeSearch()}>Search</Button> */}
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush table-white" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Survey name</th>
                    <th scope="col">Questions</th>
                    <th scope="col">Active</th>
                    <th scope="col">Link</th>
                    <th scope="col">Survey Code</th>
                    <th scope="col">QR Code</th>
                    <th scope="col">Report</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                
                {
                    (this.props.survey.error == "No matched surveys") && this.state.searchText != ""
                    ?
                    <td colSpan={10} className="align-items-center bg-white">
                      <div className="col">
                        <h3 className="m-3 text-center text-dark">No matched surveys</h3>
                      </div>
                    </td>
                    : 
                    this.state.activesurveylist && this.state.activesurveylist instanceof Array && this.state.activesurveylist.map((item, i) => (
                      <tr>
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
                              <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100) || 0}%</h2>
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
                        <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active,e )}>
                          <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                        <span className="custom-toggle-slider rounded-circle "></span>
                        </Label>

                      </td>
                      <td>
                      <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                          <i className="fas fa-link text-warning"/>
                          <span className="btn-inner--text">Link</span>
                        </Button>
                      </td>

                      <th className="text-center">{item.dcode}</th>

                      <td>
                        <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
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
                <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.surveyResult(item)}>
                  <i className="fas fa-th-list text-warning"/>
                  <span className="btn-inner--text">RESULT</span>
                </Button>
              </td>
                    </tr>
                    ))
                }

                <Modal isOpen={this.state.qrModal} centered toggle={() => toggleModal()}>
                  <ModalHeader><h2 color="primary">Survey QRCode</h2></ModalHeader>
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
                    <Button color="secondary" onClick={() => this.toggleQRModal()} >Close</Button>
                  </ModalFooter>
                </Modal>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        : null
        }
        {
          this.state.inactivesurvey
          ?
          <Row className="">
          <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-1">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0 text-white">Inactive Survey</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={() => history.push('/admin/surveys')}
                      size="sm"
                    >
                      SEE ALL
                    </Button>
                  </div> */}
                </Row>
                <Row>
                <Input                                     
                  placeholder="Search" 
                  type="search" 
                  // style={{ width: "950px", marginRight: "20px", marginTop: "20px"}}
                  autoComplete="search-survey"
                  className="bg-default shadow mt-1"
                  value={this.state.searchText}
                  onChange={(e) => this.onChangeSearch(e)}
                />
                {/* <Button color="primary" size="md" onClick={() => this.onChangeSearch()}>Search</Button> */}
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush table-white" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Survey name</th>
                    <th scope="col">Questions</th>
                    <th scope="col">Active</th>
                    <th scope="col">Link</th>
                    <th scope="col">Survey Code</th>
                    <th scope="col">QR Code</th>
                    <th scope="col">Report</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                
                {
                    (this.props.survey.error == "No matched surveys") && this.state.searchText != ""
                    ?
                    <td colSpan={10} className="align-items-center bg-white">
                      <div className="col">
                        <h3 className="m-3 text-center text-dark">No matched surveys</h3>
                      </div>
                    </td>
                    : 
                    this.state.inactivesurveylist && this.state.inactivesurveylist instanceof Array && this.state.inactivesurveylist.map((item, i) => (
                      <tr>
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
                              <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100) || 0}%</h2>
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
                        <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active,e )}>
                          <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                        <span className="custom-toggle-slider rounded-circle "></span>
                        </Label>

                      </td>
                      <td>
                      <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                          <i className="fas fa-link text-warning"/>
                          <span className="btn-inner--text">Link</span>
                        </Button>
                      </td>

                      <th className="text-center">{item.dcode}</th>

                      <td>
                        <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
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
                <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.surveyResult(item)}>
                  <i className="fas fa-th-list text-warning"/>
                  <span className="btn-inner--text">RESULT</span>
                </Button>
              </td>
                    </tr>
                    ))
                }

                <Modal isOpen={this.state.qrModal} centered toggle={() => toggleModal()}>
                  <ModalHeader><h2 color="primary">Survey QRCode</h2></ModalHeader>
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
                    <Button color="secondary" onClick={() => this.toggleQRModal()} >Close</Button>
                  </ModalFooter>
                </Modal>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        : null
        }

        {
          !this.state.activesurvey && !this.state.inactivesurvey && !this.state.survey
          ?
          <Card className="shadow">
            <CardBody>
              <TabContent activeTab={"tabs" + this.state.tabs}>
                <TabPane tabId="tabs1">
                  <Row className="">
                    <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="bg-default shadow">
                        <CardHeader className="bg-transparent border-1">
                          <Row className="align-items-center">
                            <div className="col">
                              <h3 className="mb-0 text-white">Recently Created Surveys</h3>
                            </div>
                            <div className="col text-right">
                              <Button
                                color="primary"
                                href="#pablo"
                                style={{ marginBottom: "10px"}}
                                onClick={() => this.addSurvey()}
                                size="sm"
                              >
                                ADD
                              </Button>
                              <Button
                                color="primary"
                                href="#pablo"
                                style={{ marginBottom: "10px"}}
                                onClick={() => history.push('/admin/surveys')}
                                size="sm"
                              >
                                SEE ALL
                              </Button>
                            </div>
                          </Row>
                          <Row>
                            <Input                                     
                              placeholder="Search" 
                              type="search" 
                              // style={{ width: "900px", marginRight: "20px"}}
                              autoComplete="search-survey"
                              className="bg-default shadow mt-1"
                              value={this.state.searchText}
                              onChange={(e) => this.onChangeSearch(e)}
                            />
                            {/* <Button color="primary" size="md" onClick={() => this.onChangeSearch()}>Search</Button> */}
                          </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush table-white" responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col">Survey name</th>
                              <th scope="col">Questions</th>
                              <th scope="col">Active</th>
                              <th scope="col">Link</th>
                              <th scope="col">Survey Code</th>
                              <th scope="col">QR Code</th>
                              <th scope="col">Report</th>
                              <th scope="col">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                          
                          {
                              (this.props.survey.error == "No matched surveys") && this.state.searchText != ""
                              ?
                              <td colSpan={10} className="align-items-center bg-white">
                                <div className="col">
                                  <h3 className="m-3 text-center text-dark">No matched surveys</h3>
                                </div>
                              </td>
                              : 
                              surveyList && surveyList instanceof Array && surveyList.map((item, i) => (
                                <tr>
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
                                        <h2 className="text-white mt-1 mx-2">{Math.round(item.firstQuestionDetail.verySatisfied/ (item.firstQuestionDetail.verySatisfied + item.firstQuestionDetail.satisfied + item.firstQuestionDetail.neutral + item.firstQuestionDetail.unsatisfied + item.firstQuestionDetail.veryUnsatisfied) * 100) || 0}%</h2>
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
                                  <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active,e )}>
                                    <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                                  <span className="custom-toggle-slider rounded-circle "></span>
                                  </Label>

                                </td>
                                <td>
                                <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                                    <i className="fas fa-link text-warning"/>
                                    <span className="btn-inner--text">Link</span>
                                  </Button>
                                </td>

                                <th className="text-center">{item.dcode}</th>

                                <td>
                                  <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
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
                          <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.surveyResult(item)}>
                            <i className="fas fa-th-list text-warning"/>
                            <span className="btn-inner--text">RESULT</span>
                          </Button>
                        </td>
                              </tr>
                              ))
                          }

                          <Modal isOpen={this.state.qrModal} centered toggle={() => toggleModal()}>
                            <ModalHeader><h2 color="primary">Survey QRCode</h2></ModalHeader>
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
                              <Button color="secondary" onClick={() => this.toggleQRModal()} >Close</Button>
                            </ModalFooter>
                          </Modal>
                          </tbody>
                        </Table>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="tabs2">
                  <Row className="">
                    <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="bg-default shadow">
                        <CardHeader className="bg-transparent border-1">
                          {
                            this.state.recentSubmittedSurveys.length > 1
                            ?
                              <Row className="align-items-center">
                                <div className="col">
                                  <h3 className="mb-0 text-white">Recently Submitted Surveys</h3>
                                </div>
                                <div className="col text-right">
                                  <Button
                                    color="primary"
                                    href="#pablo"
                                    onClick={() => this.addSurvey()}
                                    size="sm"
                                  >
                                    ADD
                                  </Button>
                                </div>
                              </Row>
                              :
                              <Row className="align-items-center">
                                {/* <div className="col">
                                  <h3 className="mb-0 text-white">No Surveys Submitted</h3>
                                </div> */}
                              </Row>
                          }
                        </CardHeader>
                        {
                          this.state.recentSubmittedSurveys.length < 1
                            ?
                              <div className="text-center vertical-center">
                              <h3 className="m-2 text-white">No Surveys Submitted</h3>
                            </div>
                            
                            :
                            <Table className="align-items-center table-flush table-white" responsive>
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">Survey name</th>
                                  <th scope="col">Questions</th>
                                  <th scope="col">Active</th>
                                  <th scope="col">Link</th>
                                  <th scope="col">QR Code</th>
                                  <th scope="col">Report</th>
                                  <th scope="col">Result</th>
                                </tr>
                              </thead>
                              <tbody>
                              {
                                this.state.recentSubmittedSurveys && this.state.recentSubmittedSurveys instanceof Array && this.state.recentSubmittedSurveys.map((item, i) => (
                                  <tr>
                                  <th onClick={() => this.togglePopover(item,i)} id={"survey" + i}>{item.surveyName}</th>
                                  <td>{item.totalQuestions}</td>
                                  <td>
                                    <Label className="custom-toggle" onClick={(e) => this.updateStatus(item.surveyCustId, !item.active,e )}>
                                      <Input type="checkbox" id='2' name="activeSwitch" checked={item.active}/>
                                    <span className="custom-toggle-slider rounded-circle "></span>
                                    </Label>

                                  </td>
                                  <td>
                                  <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.toggleLinkModal(item.dcode )}>
                                      <i className="fas fa-link text-warning"/>
                                      <span className="btn-inner--text">Link</span>
                                    </Button>

                                  </td>
                                  <td>
                                    <Button size="sm" disabled={!item.active} className="btn btn-icon btn-3 btn-outline-info" onClick={() => this.toggleQRModal(item.dcode)}>
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
                                    <Button size="sm" className="btn btn-icon btn-3 btn-outline-primary" onClick={() => this.surveyResult(item)}>
                                      <i className="fas fa-th-list text-warning"/>
                                      <span className="btn-inner--text">RESULT</span>
                                    </Button>
                                  </td>
                                </tr>
                                ))
                              }
                              </tbody>
                            </Table>
                        }
                      </Card>
                      

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
                          {/* <Button color="secondary" onClick={() => this.toggleQRModal()} >Close</Button> */}
                        </ModalFooter>
                      </Modal>
                    </Col>
                  </Row> 
                </TabPane>
              </TabContent>
            </CardBody>
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
          : null
        }
        
        </Container>
      </>
    );
  }
}

function mapState(state) {
  const survey = state.survey;
  const activesurvey = state.activesurvey;
  const inactivesurvey = state.inactivesurvey;
  const dashboarddata = state.dashboard;
  const alert = state.alert;
    return { survey, dashboarddata, alert, activesurvey, inactivesurvey };
}

const actionCreators = {
  getDashboardData: dashboardActions.getData,
  getSurvey: surveyActions.getAll,
  getActiveSurvey: surveyActions.getActiveSurvey,
  getInactiveSurvey: surveyActions.getInactiveSurvey,
  searchSurvey: surveyActions.search,
  updateSurveyStatus: surveyActions.updateStatus,
  getComments: surveyActions.getComments,
  reportDownload: surveyActions.downloadReport,
  clearAlerts: alertActions.clear
};
const connectedDashboardPage = connect(mapState, actionCreators)(Dashboard);
export { connectedDashboardPage as Dashboard };
