import * as React from 'react'
import GreenItPanelPerProject from './GreenItPanel/GreenItPanelPerProject'
import LightHousePanelPerProject from './LighthousePanel/LighthousePanelPerProject'
import GraphPanelForProject from './GraphPanel/GraphPanelForProject'

export default class AnalysisPerProjectPanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
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
      totalBlockingTimeSelected: false,
      error: ''
    }
  }

  componentDidMount () {
    this.setState({ selectedGraph: 'ecoindex', ecoindexSelected: true })
  }

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
        <GreenItPanelPerProject
          state={this.props}
          handleChangeGraphs={this.handleChangeGraphs}
        />

        <LightHousePanelPerProject
        state={this.props}
        lighthouseMetricsForProject= {this.props.lighthouseMetricsForProject}
        lighthousePerformanceForProject= {this.props.lighthousePerformanceForProject}
        lighthouseAccessibilityForProject= {this.props.lighthouseAccessibilityForProject}

        />

        <GraphPanelForProject
          analysis={this.props}
          state={this.state}
          handleChangeGraphs={this.handleChangeGraphs}
        />
      </div>
    )
  }
}
