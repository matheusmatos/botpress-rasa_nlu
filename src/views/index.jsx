import React from 'react'
import _ from 'lodash'
import {
  Panel,
  Grid,
  Row,
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  HelpBlock,
  Alert,
  Button
} from 'react-bootstrap'
import Markdown from 'react-markdown'
import style from './style.scss'

const explication = `
Obs: This is a beta module. If you need more options here, please open a pull request at [our repository](http://github.com/matheusmatos/botpress-rasa_nlu).

### Open-source language understanding for bots.

This mode will inject understanding metadata inside incoming messages through the Rasa middleware.

Events will have an \`rasa_nlu\` property populated with the extracted metadata from your Rasa NLU server.


\`\`\`js
bp.hear({'rasa_nlu.itent.name': 'greet'}, (event) => {
  bp.messenger.sendText(event.user.id, 'Hi Human! Nice to meet you!')
})
\`\`\`
`

export default class RasaModule extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      message: null,
      initialStateHash: null,
      rasaAddress: '',
      rasaProject: 'default',
    }

    this.renderAddress = this.renderAddress.bind(this)
    this.renderProject = this.renderProject.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
  }

  getStateHash() {
    return this.state.rasaAddress + '|' + this.state.rasaProject
  }

  getAxios() {
    return this.props.bp.axios
  }

  componentDidMount() {
    this.getAxios().get('/api/botpress-rasa_nlu/config')
    .then((res) => {
      this.setState({
        loading: false,
        ...res.data
      })

      setImmediate(() => {
        this.setState({
          initialStateHash: this.getStateHash()
        })
      })
    })
  }

  onChange(event) {
    if( event.target.name in this.state ){
      this.setState({
        [event.target.name]: event.target.value
      })
    }
    else console.warn("You are trying to set an invalid state property:", event.target.name);
  }

  handleSaveChanges() {
    this.setState({ loading:true })

    return this.getAxios().post('/api/botpress-rasa_nlu/config', {
      rasaAddress: this.state.rasaAddress,
      rasaProject: this.state.rasaProject,
    })
    .then(() => {
      this.setState({
        loading: false,
        initialStateHash: this.getStateHash()
      })
    })
    .catch((err) => {
      this.setState({
        message: {
          type: 'danger',
          text: 'An error occured during you were trying to save configuration: ' + err.response.data.message
        },
        loading: false,
        initialStateHash: this.getStateHash()
      })
    })
  }

  renderAddress() {
    return (
      <Row>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            Rasa Address
          </Col>
          <Col sm={8}>
            <FormControl type="text" name="rasaAddress" value={this.state.rasaAddress} onChange={this.onChange}/>
            <HelpBlock>Example: <code>http://localhost:5000</code> or <code>http://myrasa.mysite.com</code></HelpBlock>
          </Col>
        </FormGroup>
      </Row>
    )
  }

  renderProject() {
    return (
      <Row>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            Project Name
          </Col>
          <Col sm={8}>
            <FormControl type="text" name="rasaProject" value={this.state.rasaProject} onChange={this.onChange}/>
            <HelpBlock>Your Rasa Project Name. Example:<br/><code>{ this.state.rasaAddress }/parse?q=hello&project={this.state.rasaProject}</code></HelpBlock>
          </Col>
        </FormGroup>
      </Row>
    )
  }

  renderExplication() {
    return (
      <Row className={style.explication}>
        <Col sm={12}>
          <Markdown source={explication} />
        </Col>
      </Row>
    )
  }

  renderMessageAlert() {
    return this.state.message
      ? <Alert bsStyle={this.state.message.type}>{this.state.message.text}</Alert>
      : null
  }

  renderSaveButton() {
    const opacityStyle = (this.state.initialStateHash && this.state.initialStateHash !== this.getStateHash())
      ? {opacity:1}
      : {opacity:0}

    return <Button style={opacityStyle} bsStyle="success" onClick={this.handleSaveChanges}>Save</Button>
  }

  render() {
    if (this.state.loading) {
      return <h4>Module is loading...</h4>
    }

    return (
      <Grid className={style.rasa}>
        <Row>
          <Col md={8} mdOffset={2}>
            {this.renderMessageAlert()}
            <Panel className={style.panel} header="Settings">
              {this.renderSaveButton()}
              <div className={style.settings}>
                {this.renderAddress()}
                {this.renderProject()}
              </div>
            </Panel>
            <Panel header="Rasa NLU">
              {this.renderExplication()}
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}
