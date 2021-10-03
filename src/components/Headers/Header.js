import React from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { connect } from 'react-redux';
import { dashboardActions } from "../../../_actions";

class Header extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      surveyCount: 0,
      activeSurveyCount: 0,
      inactiveSurveyCount: 0,
      totalsurvey: false,
      inactivesurvey: false, 
      activesurvey: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.surveyCount){
      this.setState({
        surveyCount: nextProps.surveyCount.totalSurveys,
        activeSurveyCount: nextProps.surveyCount.activeSurveys,
        inactiveSurveyCount: nextProps.surveyCount.inactiveSurveys
      })
    }
  }

  componentDidMount(){
    this.props.getDashboardData()
  }

  totalSurveyTable(){
    this.setState({ totalsurvey: !this.state.totalsurvey })
    var survey = {totalsurvey: !this.state.totalsurvey} 
    this.props.getAllSurvey(survey) 
  }

  activeSurveyTable(){
    this.setState({ activesurvey: true  })
    var survey = {activesurvey: true }
    this.props.getAllSurvey(survey)
  }

  inactiveSurveyTable(){
    this.setState({ inactivesurvey: true })
    var survey = {inactivesurvey: true }
    this.props.getAllSurvey(survey)
  }


  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              {
                (!this.props.location)
                ?
                <Row>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0" onClick={() => this.totalSurveyTable()}>
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            surveys
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.surveyCount}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-poll" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0" onClick={() => this.activeSurveyTable()}>
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            ACTIVE SURVEYS
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.activeSurveyCount}
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
                  <Card className="card-stats mb-4 mb-xl-0" onClick={() => this.inactiveSurveyTable()}>
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            INACTIVE SURVEYS
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.state.inactiveSurveyCount}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                            <i className="fa fa-poll " />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              :null
              }
              
            </div>
          </Container>
        </div>
      </>
    );
  }
}

function mapState(state) {
  const surveyCount = state.dashboard.data;
  return {surveyCount};
}

const actionCreators = {
  getDashboardData: dashboardActions.getData
};
const connectedHeaderPage = connect(mapState, actionCreators)(Header);
export { connectedHeaderPage as Header };
