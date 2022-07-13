import React from 'react'
import { getBestPractices } from '../../services/bestpracticesService'
import Accordion from './Accordion/Accordion'
import AccordionNotApplicable from './Accordion/AccordionNotApplicable'
import BestPracticesTabs from './BestPracticesTabs'
import LoadingIcon from '../../images/LoadingIcon.svg'

export default class BestPracticesPage extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      loading: true,
      projectName: '',
      error: '',
      greenItBestPractices: {},
      lighthousePerformanceBestPractices: {},
      lighthouseAccesssibilityBestPractices: {},
      dateAnalysisBestPractices: '',
      bestPracticesPanelTabs: [
        { key: 'GREENIT', label: 'GreenIt best practices' },
        { key: 'LIGHTHOUSE PERFORMANCE', label: 'Lighthouse performance best practices' },
        { key: 'LIGHTHOUSE ACCESSIBILITY', label: 'Lighthouse Accessibility best practices' }
      ],
      selectedTab: 'GREENIT'
    }
  }

  componentDidMount () {
    this.setState({
      loading: true,
      projectName: this.props.project.key
    })
    getBestPractices(this.props.project.key)
      .then((data) => {
        const formattedDate = new Date(data.dateAnalysisBestPractices)
        this.setState({
          loading: false,
          greenItBestPractices: data.greenItBestPractices,
          lighthousePerformanceBestPractices: data.lighthousePerformanceBestPractices,
          lighthouseAccesssibilityBestPractices: data.lighthouseAccesssibilityBestPractices,
          dateAnalysisBestPractices: `${formattedDate.toDateString()} - ${formattedDate.toLocaleTimeString([], { hour12: false })}`
        })
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({
            loading: false,
            error: result.message
          })
        }
      })
  }

  setSelectedTab = (value) => {
    this.setState({ selectedTab: value })
  };

  render () {
    return (
      <div className='page'>
        <h1 className='title-best-practices'>
          Best Practices for project {this.props.project.key} - last analysis at {this.state.dateAnalysisBestPractices}
        </h1>
        <div className='header-best-practices'>
          <p>
            When analysing the different pages from your website, EcoSonar will be able to detect if some ecodesign good practices have been implemented in your web application. For each practices
            analysed, it will give you a score from A to G according to the compliance level and will guide you to apply them. Achieve an A Score in each of the practices to better optimize your
            ressources.
          </p>
        </div>
        {this.state.loading && <img src={LoadingIcon} alt='Loading icon' />}
        {!this.state.loading && !!this.state.error && (
          <div className='best-practice-error'>
            <p className='text-danger'>{this.state.error}</p>
          </div>
        )}
        {!this.state.loading && !this.state.error && (
          <div>
            <div className='best-practices'>
              <BestPracticesTabs state={this.state} setSelectedTab={this.setSelectedTab} tabs={this.state.bestPracticesPanelTabs} />

              {this.state.selectedTab === 'GREENIT' && (
                <div>
                  <Accordion practiceType='greenit' bestPractices={this.state.greenItBestPractices} />
                  <AccordionNotApplicable practiceType='greenit' bestPractices={this.state.greenItBestPractices} />
                </div>
              )}
              {this.state.selectedTab === 'LIGHTHOUSE PERFORMANCE' && (
                <div>
                  <Accordion practiceType='performance' bestPractices={this.state.lighthousePerformanceBestPractices} />
                  <AccordionNotApplicable practiceType='performance' bestPractices={this.state.lighthousePerformanceBestPractices} />
                </div>
              )}
              {this.state.selectedTab === 'LIGHTHOUSE ACCESSIBILITY' && (
                <div>
                  {' '}
                  <Accordion practiceType='accessibility' bestPractices={this.state.lighthouseAccesssibilityBestPractices} />
                  <AccordionNotApplicable practiceType='accessibility' bestPractices={this.state.lighthouseAccesssibilityBestPractices} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}
