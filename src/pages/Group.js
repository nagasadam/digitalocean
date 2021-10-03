import React from "react";
// reactstrap components
import {
  Alert,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Col,
  Spinner,
  Table,
  Form,
  FormGroup,
  FormText,
  Container,
  Row,
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
import { questionbankActions, alertActions } from '../../_actions';
import {Header} from "../components/Headers/Header.js";


class Group extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            question: '',
            add :false,
            questionState: "",
            update: false,
            updatekey: '',
            updatequestion: ''
        }
      }

      handleAddComponent(){
          this.setState({ add: !this.state.add })
      }

      handleUpdateComponent(question, key){
        this.setState({ 
          update: !this.state.update,
          updatekey: key,
          updatequestion: question
        })
      }

      componentDidMount(){
        this.props.getQuestions();
      }

      handleDeleteQuestion(id) {
        this.props.deleteQuestions(id);
      }

      handleChangeQuestion(e){
        if(this.state.add){
          this.setState({ question: e.target.value, questionState: (this.state.question == '') ? 'invalid' : 'valid' })
        }
        else
          this.setState({ updatequestion: e.target.value, questionState: (this.state.updatequestion == '') ? 'invalid' : 'valid' })
      }

      submitQuestion(question){
        if(this.state.question == ''){
          this.setState({ questionState : 'invalid' })
        }
        else{
          this.props.createQuestions(question);
        }
      }

      handleUpdateQuestion(id, question){
        if(this.state.updatequestion == ''){
          this.setState({ questionState : 'invalid' })
        }
        else{
          this.props.updateQuestions(id, question);
        }
      }

      renderSpinner(){
        return(
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

  render() {
    const { question }  = this.props;
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}

              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-1">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="text-white mb-0">Question Bank</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href=""
                        onClick={() => this.handleAddComponent()}
                        size="sm"
                      >
                        ADD
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                
                <Table
                  className="align-items-center table-white table-flush"
                  responsive="md"
                >
                  <thead className="thead-dark" >
                    <tr>
                      <th scope="col" className="col-12">Question</th>
                      <th scope="col" className="col-8">UPDATE</th>
                      <th scope="col" className="col-8">DELETE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {  this.state.add &&
                      <tr>
                      <th scope="row">
                          <Media className="align-items-center">
                            <a
                                className="avatar rounded-circle"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                <img
                                alt="..."
                                src={"/src/assets/img/theme/bootstrap.jpg"}
                                />
                            </a>
                            <Media body>
                            <Form role="form">
                              <FormGroup                   
                                className={classnames(
                                  "mb-3",
                                  { focused: this.state.question },
                                  { "has-danger": this.state.questionState === "invalid" },
                                  { "has-success": this.state.questionState === "valid" }
                                )}
                              >
                                <InputGroup 
                                  className={classnames("input-group-merge input-group-alternative", {
                                    "is-invalid": this.state.questionState === "invalid"
                                  })}
                                >
                                  <Input 
                                    placeholder="question" 
                                    type="question" 
                                    autoComplete="new-question"
                                    className={classnames(
                                      { "text-danger": this.state.questionState === "invalid" },
                                      { "text-success": this.state.questionState === "valid" }
                                    )}
                                    value={this.state.question} 
                                    onChange={(e) => this.handleChangeQuestion(e)}
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Form>
                            </Media>
                          </Media>
                      </th>
                      <td className="justify-content">
                          <Button color="" className="btn btn-icon btn-3 btn-outline-success" onClick={() => this.submitQuestion(this.state.question)}>
                            {/* <span class="btn-inner--icon" ><i class="fas fa-edit"></i></span> */}
                            <span className="btn-inner--text">ADD</span>
                          </Button> 

                      </td>
                      <td>
                          <Button 
                            color="" 
                            className="btn btn-icon btn-3 btn-outline-danger"
                            onClick={() => this.handleAddComponent()}>
                            {/* <span class="btn-inner--icon "><i class="fas fa-trash"></i></span> */}
                              <span className="btn-inner--text">CANCEL</span>
                          </Button>
                      </td>
                      </tr>
                    }
                  {

                    question.data && question.data.map((item,i) => (
                      <tr>
                      <th scope="row">
                          <Media className="align-items-center">
                            <a
                                className="avatar rounded-circle"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                <img
                                alt="..."
                                src={"/src/assets/img/theme/bootstrap.jpg"}
                                />
                            </a>
                            <Media body>
                              {
                                this.state.update === true && this.state.updatekey === i
                                ?
                                <Form role="form">
                                <FormGroup                   
                                  className={classnames(
                                    "mb-3","ml-3",
                                    { focused: this.state.question },
                                    { "has-danger": this.state.questionState === "invalid" },
                                    { "has-success": this.state.questionState === "valid" }
                                  )}
                                >
                                  <InputGroup 
                                    className={classnames("input-group-merge input-group-alternative", {
                                      "is-invalid": this.state.questionState === "invalid"
                                    })}
                                  >
                                    <Input 
                                      placeholder="question" 
                                      type="question" 
                                      autoComplete="new-question"
                                      className={classnames(
                                        { "text-danger": this.state.questionState === "invalid" },
                                        { "text-success": this.state.questionState === "valid" }
                                      )}
                                      value={this.state.updatequestion} 
                                      onChange={(e) => this.handleChangeQuestion(e)}
                                    />
                                  </InputGroup>
                                </FormGroup>
                              </Form>
                                
                                : 
                                <div>
                                  <span>
                                  {item.question}
                                  </span>
                                </div>
                              }
                                
                            </Media>
                          </Media>
                      </th>
                        {
                          this.state.update === true && this.state.updatekey === i
                          ?
                          
                          <td className="justify-content">
                          <Button color="" className="btn btn-icon btn-3 btn-outline-success" 
                            onClick={() => this.handleUpdateQuestion(item._id, this.state.updatequestion)}>
                            {/* <span class="btn-inner--icon" ><i class="fas fa-edit"></i></span> */}
                            <span className="btn-inner--text">SAVE</span>
                          </Button>
                        </td>
                          :
                          <td className="justify-content">
                            <Button color="" className="btn btn-icon btn-3 btn-outline-success" 
                              onClick={() => this.handleUpdateComponent(item.question, i)}>
                              {/* <span class="btn-inner--icon" ><i class="fas fa-edit"></i></span> */}
                              <span className="btn-inner--text">UPDATE</span>
                            </Button>
                          </td>
                        }
                        {
                          this.state.update === true && this.state.updatekey === i
                          ? 
                          <td>
                          <Button color="" className="btn btn-icon btn-3 btn-outline-danger" 
                            onClick={() => this.handleUpdateComponent()}>
                            {/* <span class="btn-inner--icon "><i class="fas fa-trash"></i></span> */}
                            <span className="btn-inner--text">CANCEL</span>
                          </Button>
                        </td>

                          :
                            <td>
                            <Button color="" className="btn btn-icon btn-3 btn-outline-danger" 
                              onClick={() => this.handleDeleteQuestion(item._id)}>
                              {/* <span class="btn-inner--icon "><i class="fas fa-trash"></i></span> */}
                              <span className="btn-inner--text">DELETE</span>
                            </Button>
                          </td>

                        }

                      
                      </tr>
                    ))
                  }
                  </tbody>
                </Table>
              </Card>
        </Container>
      </>
    );
  }
}

function mapState(state) {
  const question = state.questionbank;
  return { question };
}

const actionCreators = {
  createQuestions: questionbankActions.create,
  updateQuestions: questionbankActions.update,
  getQuestions: questionbankActions.getAll,
  deleteQuestions: questionbankActions._delete,
  clearAlerts: alertActions.clear
};

const connectedGroup = connect(mapState, actionCreators)(Group);
export { connectedGroup as Group };