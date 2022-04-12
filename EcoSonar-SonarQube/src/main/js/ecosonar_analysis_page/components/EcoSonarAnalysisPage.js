import * as React from 'react'
import NoAnalysisWarning from './NoAnalysisWarning'
import EcoIndexPanel from './IndexPanel/EcoIndexPanel'
import LighthousePerformancePanel from './IndexPanel/LighthousePerformancePanel'
import LighthouseAccessibilityPanel from './IndexPanel/LighthouseAccessibilityPanel'
import DisclaimerPanel from './IndexPanel/DisclaimerPanel'
import AnalysisPanel from './AnalysisPanel'
import { getAnalysisForProjectConfiguration } from '../../services/ecosonarService'
import { getUrlsConfiguration } from '../../services/configUrlService'

export default class EcoSonarAnalysisPage extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      projectHasNoAnalysis: false,
      loading: false,
      projectName: '',
      analysisForProjectGreenit: {},
      lighthousePerformanceForProject: {},
      lighthouseAccessibilityForProject: {},
      lighthouseMetrics: {
        largestContentfulPaint: {},
        cumulativeLayoutShift: {},
        firstContentfulPaint: {},
        speedIndex: {},
        totalBlockingTime: {},
        interactive: {}
      },
      urls: [],
      foundUrl: false,
      selectedUrl: false,
      errorUrl: '',
      error: '',
      reqAnalysis: [],
      domAnalysis: [],
      pageAnalysis: [],
      ecoAnalysis: [],
      performanceAnalysis: [],
      accessibilityAnalysis: [],
      cumulativeLayoutshiftAnalysis: [],
      firstContentfulPaintAnalysis: [],
      largestContentfulPaintAnalysis: [],
      interactiveAnalysis: [],
      speedIndexAnalysis: [],
      totalBlockingTimeAnalysis: [],
      foundAll: false,
      found: false,
      date: ''
    }
  }

  componentDidMount () {
    this.setState({
      loading: true,
      error: '',
      date: '',
      found: false,
      projectHasNoAnalysis: false,
      urls: [],
      foundUrl: false,
      foundAll: false,
      selectedUrl: false,
      errorUrl: '',
      projectName: this.props.project.key
    })
    getAnalysisForProjectConfiguration(this.props.project.key)
      .then((analysis) => {
        if (analysis.deployments !== undefined) {
          let date = new Date(analysis.lastAnalysis.dateAnalysis)
          const timeOffsetInMS = date.getTimezoneOffset() / 60
          date.setTime(date.getTime() + timeOffsetInMS)
          date = date + ' .'
          const change = date.split(' ')
          this.setState({
            analysisForProjectGreenit: analysis.lastAnalysis.greenit,
            found: true,
            foundAll: true,
            date: change[0] + ' ' + change[2] + ' ' + change[1] + ' ' + change[3] + ' - ' + change[4],
            reqAnalysis: analysis.deployments.greenit.map((analysis) => [analysis.dateAnalysis, analysis.nbRequest]),
            domAnalysis: analysis.deployments.greenit.map((analysis) => [analysis.dateAnalysis, Math.trunc(analysis.domSize)]),
            pageAnalysis: analysis.deployments.greenit.map((analysis) => [analysis.dateAnalysis, Math.trunc(analysis.responsesSize)]),
            ecoAnalysis: analysis.deployments.greenit.map((analysis) => [analysis.dateAnalysis, analysis.ecoIndex])
          })
          if (analysis.deployments.lighthouse) {
            this.setState({

              performanceAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.performanceScore]),
              accessibilityAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.accessibilityScore]),
              cumulativeLayoutshiftAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.cumulativeLayoutShift]),
              firstContentfulPaintAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.firstContentfulPaint]),
              largestContentfulPaintAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.largestContentfulPaint]),
              interactiveAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.interactive]),
              speedIndexAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.speedIndex]),
              totalBlockingTimeAnalysis: analysis.deployments.lighthouse.map((analysis) => [analysis.dateAnalysis, analysis.totalBlockingTime]),

              lighthousePerformanceForProject: {
                perfScore: analysis.lastAnalysis.lighthouse.performance.displayValue,
                perfComplianceLevel: analysis.lastAnalysis.lighthouse.performance.complianceLevel
              },
              lighthouseAccessibilityForProject: {
                accessScore: analysis.lastAnalysis.lighthouse.accessibility.displayValue,
                accessComplianceLevel: analysis.lastAnalysis.lighthouse.accessibility.complianceLevel
              },
              lighthouseMetrics: {
                largestContentfulPaint: {
                  displayValue: analysis.lastAnalysis.lighthouse.largestContentfulPaint.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.largestContentfulPaint.complianceLevel
                },
                firstContentfulPaint: {
                  displayValue: analysis.lastAnalysis.lighthouse.firstContentfulPaint.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.firstContentfulPaint.complianceLevel
                },
                speedIndex: {
                  displayValue: analysis.lastAnalysis.lighthouse.speedIndex.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.speedIndex.complianceLevel
                },
                totalBlockingTime: {
                  displayValue: analysis.lastAnalysis.lighthouse.totalBlockingTime.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.totalBlockingTime.complianceLevel
                },
                interactive: {
                  displayValue: analysis.lastAnalysis.lighthouse.interactive.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.interactive.complianceLevel
                },
                cumulativeLayoutShift: {
                  displayValue: analysis.lastAnalysis.lighthouse.cumulativeLayoutShift.displayValue,
                  complianceLevel: analysis.lastAnalysis.lighthouse.cumulativeLayoutShift.complianceLevel
                }
              }
            })
          }
        } else {
          this.setState({ projectHasNoAnalysis: true })
        }
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({ error: result.message, loading: false })
        }
      })
    getUrlsConfiguration(this.props.project.key)
      .then((urlList) => {
        if (urlList.length > 0) {
          this.setState({
            urls: urlList,
            foundUrl: true,
            loading: false,
            selectedUrl: urlList[0]
          })
        } else {
          this.setState({
            loading: false,
            errorUrl: 'No URL for projet ' + this.projectName + ' found'
          })
        }
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({ errorUrl: result.message, loading: false })
        }
      })
  }

  render () {
    return (
      <div className='page'>
        <div className='overview'>
          {this.state.projectHasNoAnalysis
            ? (
            <NoAnalysisWarning projectName={this.state.projectName} />
              )
            : (
            <div className='display-flex-row'>
              <div className='index-panel'>
                <EcoIndexPanel loading={this.state.loading} analysis={this.state.analysisForProjectGreenit} found={this.state.found} />
                <LighthousePerformancePanel loading={this.state.loading} analysis={this.state.lighthousePerformanceForProject} found={this.state.found} />
                <LighthouseAccessibilityPanel loading={this.state.loading} analysis={this.state.lighthouseAccessibilityForProject} found={this.state.found} />
                <DisclaimerPanel/>

              </div>
              <AnalysisPanel
                loading={this.state.loading}
                analysis={this.state.analysisForProjectGreenit}
                lighthouseMetricsForProject={this.state.lighthouseMetrics}
                lighthousePerformanceForProject={this.state.lighthousePerformanceForProject}
                lighthouseAccessibilityForProject={this.state.lighthouseAccessibilityForProject}
                error={this.state.error}
                found={this.state.found}
                project={this.state.projectName}
                urls={this.state.urls}
                foundUrl={this.state.foundUrl}
                selectedUrl={this.state.selectedUrl}
                errorUrl={this.state.errorUrl}
                ecoAnalysis={this.state.ecoAnalysis}
                domAnalysis={this.state.domAnalysis}
                pageAnalysis={this.state.pageAnalysis}
                reqAnalysis={this.state.reqAnalysis}
                performanceAnalysis={this.state.performanceAnalysis}
                accessibilityAnalysis={this.state.accessibilityAnalysis}
                cumulativeLayoutshiftAnalysis={this.state.cumulativeLayoutshiftAnalysis}
                firstContentfulPaintAnalysis={this.state.firstContentfulPaintAnalysis}
                largestContentfulPaintAnalysis={this.state.largestContentfulPaintAnalysis}
                interactiveAnalysis={this.state.interactiveAnalysis}
                speedIndexAnalysis={this.state.speedIndexAnalysis}
                totalBlockingTimeAnalysis={this.state.totalBlockingTimeAnalysis}
                foundAll={this.state.foundAll}
                projectName={this.state.projectName}
                date={this.state.date}
              />
            </div>
              )}
        </div>
      </div>
    )
  }
}
