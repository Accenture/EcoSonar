import * as React from 'react'
import { getBestPractices } from '../../services/bestpracticesService'
import Accordion from './Accordion/Accordion'

export default class BestPracticesPage extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      loading: true,
      projectName: '',
      error: '',
      bestPractices: {}
    }
  }

  componentDidMount () {
    this.setState({
      loading: true,
      projectName: this.props.project.key
    })
    getBestPractices(this.props.project.key)
      .then((bestPractices) => {
        this.setState({ loading: false, bestPractices: bestPractices })
      })
      .catch((result) => {
        this.setState({
          loading: false,
          error: result.message
        })
      })
  }

  render () {
    return (
      <div className="page">
        {this.state.loading && <i className="spinner" />}
        {!this.state.loading && !!this.state.error && (
          <div className="boxed-group">{this.state.error}</div>
        )}
        {!this.state.loading && !this.state.error && (
          <div>
            <h1 className="title-best-practices">
              
              Best Practices GreenIT for project {this.props.project.key}
            </h1>
            <div className="header-best-practices">
              <p>
                When analysing the different pages from your website, EcoSonar
                will be able to detect if some ecodesign good practices have
                been implemented in your web application. For each of the 22
                practices analysed, it will give you a score from A to C
                according to the compliance level and will guide you to apply
                them. Achieve an A Score in each of the practices to better
                optimize your ressources.
              </p>
            </div>
            <div className="best-practices">
              <Accordion bestPractices={this.state.bestPractices} />
            </div>
          </div>
        )}
      </div>
    )
  }
}
