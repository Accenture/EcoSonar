import React from 'react'
import LoadingIcon from '../../images/LoadingIcon.svg'
import { getBestPractices, getBestPracticesForUrl } from '../../services/bestpracticesService'
import { getUrlsConfiguration } from './../../services/configUrlService'
import Accordion from './Accordion/Accordion'
import BestPracticesFilters from './BestPracticesFilters/BestPracticesFilters'
import { auditTypes, selectedComplianceArray, setTools } from './BestPracticesFilters/Filters'
export default class BestPracticesPage extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      loading: true,
      projectName: '',
      error: '',
      greenItBestPractices: {},
      lighthousePerformanceBestPractices: {},
      lighthouseAccessibilityBestPractices: {},
      dateAnalysisBestPractices: '',
      selectedAuditTypes: 'Ecodesign',
      selectedAuditTools: 'All',
      selectedComplianceArray: selectedComplianceArray,
      auditTools: setTools('All'),
      auditTypes: auditTypes,
      ariaHidden: true,
      foundUrl: false,
      urls: [],
      selectedUrl: 'All'
    }
  }

  componentDidMount () {
    this.setState({
      loading: true,
      projectName: this.props.project.key,
      urls: [],
      foundUrl: false
    })
    getBestPractices(this.props.project.key)
      .then((data) => {
        const formattedDate = new Date(data.dateAnalysisBestPractices)
        this.setState({
          loading: false,
          greenItBestPractices: data.greenItBestPractices,
          lighthousePerformanceBestPractices: data.lighthousePerformanceBestPractices,
          lighthouseAccessibilityBestPractices: data.lighthouseAccessibilityBestPractices,
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
    getUrlsConfiguration(this.props.project.key)
      .then((data) => {
        data.unshift('All')
        this.setState({
          urls: data,
          foundUrl: true,
          loading: false
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

  changeSelectedUrl = async (event) => {
    this.setState({ error: null })
    await this.setState({ selectedUrl: event.target.value, loading: true })
    if (this.state.selectedUrl === 'All') {
      getBestPractices(this.state.projectName)
        .then((data) => {
          const formattedDate2 = new Date(data.dateAnalysisBestPractices)
          this.setState({
            loading: false,
            greenItBestPractices: data.greenItBestPractices,
            lighthousePerformanceBestPractices: data.lighthousePerformanceBestPractices,
            lighthouseAccessibilityBestPractices: data.lighthouseAccessibilityBestPractices,
            dateAnalysisBestPractices: `${formattedDate2.toDateString()} - ${formattedDate2.toLocaleTimeString([], { hour12: false })}`
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
    } else {
      getBestPracticesForUrl(this.state.projectName, this.state.selectedUrl)
        .then((data) => {
          const formattedDate3 = new Date(data.dateAnalysisBestPractices)
          this.setState({
            loading: false,
            greenItBestPractices: data.greenItBestPractices,
            lighthousePerformanceBestPractices: data.lighthousePerformanceBestPractices,
            lighthouseAccessibilityBestPractices: data.lighthouseAccessibilityBestPractices,
            dateAnalysisBestPractices: `${formattedDate3.toDateString()} - ${formattedDate3.toLocaleTimeString([], { hour12: false })}`
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
  };

  setSelectedComplianceArray = (selectedComplianceArray) => {
    this.setState({ selectedComplianceArray: selectedComplianceArray })
  };

  setSelectedAuditTypes = (selectedAuditTypes) => {
    this.setState({ selectedAuditTypes: selectedAuditTypes })
    if (selectedAuditTypes === 'Ecodesign') {
      this.setSelectedAuditTools('All ecodesign tools')
      this.setState({
        auditTools: setTools('Ecodesign')
      })
    } else if (selectedAuditTypes === 'Accessibility') {
      this.setSelectedAuditTools('All accessibility tools')
      this.setState({
        auditTools: setTools('Accessibility')
      })
    } else {
      this.setSelectedAuditTools('All')
      this.setState({
        auditTools: setTools('All')
      })
    }
  };

  setSelectedAuditTools = (selectedAuditTools) => {
    this.setState({ selectedAuditTools: selectedAuditTools })
  };

  render () {
    return (
      <main role='main' className='page' aria-hidden={this.state.ariaHidden}>
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

        {!this.state.loading && (
          <div className='best-practices'>
            <BestPracticesFilters
              complianceLevels={this.state.complianceLevels}
              auditTypes={this.state.auditTypes}
              setSelectedAuditTypes={this.setSelectedAuditTypes}
              auditTools={this.state.auditTools}
              selectedAuditTools={this.state.selectedAuditTools}
              setSelectedAuditTools={this.setSelectedAuditTools}
              handleComplianceChange={this.handleComplianceChange}
              selectedComplianceArray={this.state.selectedComplianceArray}
              setSelectedComplianceArray={this.setSelectedComplianceArray}
              selectedUrl={this.state.selectedUrl}
              changeSelectedUrl={this.changeSelectedUrl}
              urls={this.state.urls}
            />
            {!this.state.error && (
              <div>
                {this.state.selectedAuditTools === 'All' && (
                  <div>
                    <Accordion
                      practiceType='All'
                      greenItBestPractices={this.state.greenItBestPractices}
                      lighthousePerformanceBestPractices={this.state.lighthousePerformanceBestPractices}
                      lighthouseAccessibilityBestPractices={this.state.lighthouseAccessibilityBestPractices}
                      selectedComplianceArray={this.state.selectedComplianceArray}
                    />
                  </div>
                )}
                {this.state.selectedAuditTools === 'All ecodesign tools' && (
                  <div>
                    <Accordion
                      practiceType='All ecodesign tools'
                      greenItBestPractices={this.state.greenItBestPractices}
                      lighthousePerformanceBestPractices={this.state.lighthousePerformanceBestPractices}
                      selectedComplianceArray={this.state.selectedComplianceArray}
                    />
                  </div>
                )}
                {this.state.selectedAuditTools === 'All accessibility tools' && (
                  <div>
                    <Accordion
                      practiceType='All accessibility tools'
                      lighthouseAccessibilityBestPractices={this.state.lighthouseAccessibilityBestPractices}
                      selectedComplianceArray={this.state.selectedComplianceArray}
                    />
                  </div>
                )}

                {this.state.selectedAuditTools === 'GreenIT-Analysis' && (
                  <div>
                    <Accordion practiceType='greenit' greenItBestPractices={this.state.greenItBestPractices} selectedComplianceArray={this.state.selectedComplianceArray} />
                  </div>
                )}
                {this.state.selectedAuditTools === 'Lighthouse Performance' && (
                  <div>
                    <Accordion
                      practiceType='performance'
                      lighthousePerformanceBestPractices={this.state.lighthousePerformanceBestPractices}
                      selectedComplianceArray={this.state.selectedComplianceArray}
                    />
                  </div>
                )}
                {this.state.selectedAuditTools === 'Lighthouse Accessibility' && (
                  <div>
                    <Accordion
                      practiceType='accessibility'
                      lighthouseAccessibilityBestPractices={this.state.lighthouseAccessibilityBestPractices}
                      selectedComplianceArray={this.state.selectedComplianceArray}
                    />
                  </div>
                )}
              </div>
            )}
            {!this.state.loading && !!this.state.error && (
              <div className='best-practice-error'>
                <p className='text-danger'>{this.state.error}</p>
              </div>
            )}
          </div>
        )}
      </main>
    )
  }
}
