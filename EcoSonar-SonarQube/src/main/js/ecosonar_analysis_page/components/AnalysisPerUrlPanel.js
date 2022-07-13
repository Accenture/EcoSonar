import React from 'react'
import { getAnalysisUrlConfiguration } from '../../services/ecosonarService'
import GraphPanelForUrl from './GraphPanel/GraphPanelForUrl'
import GreenItPanelPerUrl from './GreenItPanel/GreenItPanelPerUrl'
import LightHousePanelPerUrl from './LighthousePanel/LighthousePanelPerUrl'

export default class AnalysisPerUrlPanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: this.props.errorUrl,
      projectName: this.props.project,
      urls: this.props.urls,
      foundUrl: this.props.foundUrl,
      foundAnalysis: false,
      selectedUrl: this.props.selectedUrl,
      greenItAnalysis: {},
      lighthouseAnalysis: {},
      ecoUrl: [],
      reqUrl: [],
      pageUrl: [],
      domUrl: [],
      performanceUrl: [],
      accessibilityUrl: [],
      cumulativeLayoutShiftUrl: [],
      firstContentfulPaintUrl: [],
      largestContentfulPaintUrl: [],
      interactiveUrl: [],
      speedIndexUrl: [],
      totalBlockingTimeUrl: [],
      selectedGraph: '',
      reqSelected: false,
      ecoindexSelected: false,
      domSelected: false,
      pageSelected: false,
      performanceSelected: false,
      accessibilitySelected: false,
      cumulativeLayoutShiftSelected: false,
      firstContentfulPaintSelected: false,
      largestContentfulPaintSelected: false,
      interactiveSelected: false,
      speedIndexSelected: false,
      totalBlockingTimeSelected: false

    }
  }

  componentDidMount () {
    if (this.state.foundUrl) {
      this.getAnalysis()
    }
  }

  getAnalysis = () => {
    this.setState({
      greenItAnalysis: {},
      lighthouseAnalysis: {},
      error: '',
      foundAnalysis: false,
      reqUrl: [],
      pageUrl: [],
      domUrl: [],
      ecoUrl: [],
      performanceUrl: [],
      accessibilityUrl: [],
      cumulativeLayoutShiftUrl: [],
      firstContentfulPaintUrl: [],
      largestContentfulPaintUrl: [],
      interactiveUrl: [],
      speedIndexUrl: [],
      totalBlockingTimeUrl: [],
      loading: true
    })
    getAnalysisUrlConfiguration(this.state.projectName, this.state.selectedUrl)
      .then((res) => {
        if (res !== undefined) {
          this.setState({
            greenItAnalysis: res.lastAnalysis.greenit,
            lighthouseAnalysis: res.lastAnalysis.lighthouse,
            foundAnalysis: true,
            loading: false,
            reqUrl: res.deployments.greenit.map((analysis) => [
              analysis.dateAnalysis,
              analysis.nbRequest
            ]),
            domUrl: res.deployments.greenit.map((analysis) => [
              analysis.dateAnalysis,
              Math.trunc(analysis.domSize)
            ]),
            pageUrl: res.deployments.greenit.map((analysis) => [
              analysis.dateAnalysis,
              Math.trunc(analysis.responsesSize)
            ]),
            ecoUrl: res.deployments.greenit.map((analysis) => [
              analysis.dateAnalysis,
              analysis.ecoIndex
            ]),
            performanceUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.performanceScore
            ]),
            accessibilityUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.accessibilityScore
            ]),
            cumulativeLayoutShiftUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.cumulativeLayoutShift
            ]),
            firstContentfulPaintUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.firstContentfulPaint
            ]),
            largestContentfulPaintUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.largestContentfulPaint
            ]),
            interactiveUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.interactive
            ]),
            speedIndexUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.speedIndex
            ]),
            totalBlockingTimeUrl: res.deployments.lighthouse.map((analysis) => [
              analysis.dateAnalysis,
              analysis.totalBlockingTime
            ])
          })
          if (res.deployments.greenit && res.deployments.greenit.length > 0) {
            this.setState({ selectedGraph: 'ecoindex', ecoindexSelected: true, performanceSelected: false })
          } else {
            this.setState({ selectedGraph: 'performance', performanceSelected: true, ecoindexSelected: false })
          }
        }
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({ error: result.message, loading: false })
        }
      })
  };

  handleChange = async (event) => {
    await this.setState({ selectedUrl: event.target.value })
    this.getAnalysis()
  };

  handleChangeGraphs = async (event) => {
    await this.setState({ selectedGraph: event.target.value })
    if (this.state.selectedGraph === 'request') {
      this.setState({
        reqSelected: true,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false

      })
    } else if (this.state.selectedGraph === 'dom') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: true,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false

      })
    } else if (this.state.selectedGraph === 'page') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: true,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false

      })
    } else if (this.state.selectedGraph === 'performance') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: true,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false

      })
    } else if (this.state.selectedGraph === 'accessibility') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: true,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false
      })
    } else if (this.state.selectedGraph === 'cumulative') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: true,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false

      })
    } else if (this.state.selectedGraph === 'firstcontentfulpaint') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: true,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false
      })
    } else if (this.state.selectedGraph === 'largestcontentfulpaint') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: true,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false
      })
    } else if (this.state.selectedGraph === 'interactive') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: true,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false
      })
    } else if (this.state.selectedGraph === 'speedindex') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: true,
        totalBlockingTimeSelected: false
      })
    } else if (this.state.selectedGraph === 'totalblockingtime') {
      this.setState({
        reqSelected: false,
        ecoindexSelected: false,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: true
      })
    } else {
      this.setState({
        reqSelected: false,
        ecoindexSelected: true,
        domSelected: false,
        pageSelected: false,
        performanceSelected: false,
        accessibilitySelected: false,
        cumulativeLayoutShiftSelected: false,
        firstContentfulPaintSelected: false,
        largestContentfulPaintSelected: false,
        interactiveSelected: false,
        speedIndexSelected: false,
        totalBlockingTimeSelected: false
      })
    }
  };

  render () {
    return (
      <div>
        <GreenItPanelPerUrl
          state={this.state}
          handleChange={this.handleChange}
          handleChangeGraphs={this.handleChangeGraphs}
        />
        <LightHousePanelPerUrl
          state={this.state}
          handleChange={this.handleChange}
          handleChangeGraphs={this.handleChangeGraphs}
        />
        <GraphPanelForUrl
          loading={this.state.loading}
          foundAnalysis={this.state.foundAnalysis}
          error={this.state.error}
          selectedGraph={this.state.selectedGraph}
          ecoUrl={this.state.ecoUrl}
          reqUrl={this.state.reqUrl}
          domUrl={this.state.domUrl}
          pageUrl={this.state.pageUrl}
          performanceUrl={this.state.performanceUrl}
          accessibilityUrl={this.state.accessibilityUrl}
          cumulativeLayoutShiftUrl={this.state.cumulativeLayoutShiftUrl}
          firstContentfulPaintUrl={this.state.firstContentfulPaintUrl}
          largestContentfulPaintUrl={this.state.largestContentfulPaintUrl}
          interactiveUrl={this.state.interactiveUrl}
          speedIndexUrl={this.state.speedIndexUrl}
          totalBlockingTimeUrl={this.state.totalBlockingTimeUrl}
          reqSelected={this.state.reqSelected}
          domSelected={this.state.domSelected}
          pageSelected={this.state.pageSelected}
          ecoindexSelected={this.state.ecoindexSelected}
          performanceSelected={this.state.performanceSelected}
          accessibilitySelected={this.state.accessibilitySelected}
          cumulativeLayoutShiftSelected={this.state.cumulativeLayoutShiftSelected}
          firstContentfulPaintSelected={this.state.firstContentfulPaintSelected}
          largestContentfulPaintSelected={this.state.largestContentfulPaintSelected}
          interactiveSelected={this.state.interactiveSelected}
          speedIndexSelected={this.state.speedIndexSelected}
          totalBlockingTimeSelected={this.state.totalBlockingTimeSelected}
          handleChangeGraphs={this.handleChangeGraphs}
        />
      </div>
    )
  }
}
