import React from 'react'
import GreenItPanelPerProject from './GreenItPanel/GreenItPanelPerProject'
import LightHousePanelPerProject from './LighthousePanel/LighthousePanelPerProject'
import GraphPanelForProject from './GraphPanel/GraphPanelForProject'

export default function AnalysisPerProjectPanel (props) {
  const {
    analysisForProjectGreenit,
    ecoAnalysis,
    reqAnalysis,
    domAnalysis,
    pageAnalysis,
    performanceAnalysis,
    accessibilityAnalysis,
    cumulativeLayoutshiftAnalysis,
    firstContentfulPaintAnalysis,
    largestContentfulPaintAnalysis,
    interactiveAnalysis,
    speedIndexAnalysis,
    totalBlockingTimeAnalysis,
    error,
    found,
    projectName,
    loading,
    lighthouseMetricsForProject,
    lighthousePerformanceForProject,
    lighthouseAccessibilityForProject,
    selectedGraph,
    setSelectedGraph,
    ecoindexSelected,
    setEcoIndexSelected,
    performanceSelected,
    setPerformanceSelected
  } = props

  const [reqSelected, setReqSelected] = React.useState(false)
  const [domSelected, setDomSelected] = React.useState(false)
  const [pageSelected, setPageSelected] = React.useState(false)
  const [accessibilitySelected, setAccessibilitySelected] = React.useState(false)
  const [cumulativeLayoutShiftSelected, setCumulativeLayoutShiftSelected] = React.useState(false)
  const [firstContentfulPaintSelected, setFirstContentfulPaintSelected] = React.useState(false)
  const [largestContentfulPaintSelected, setLargestContentfulPaintSelected] = React.useState(false)
  const [interactiveSelected, setInteractiveSelected] = React.useState(false)
  const [speedIndexSelected, setSpeedIndexSelected] = React.useState(false)
  const [totalBlockingTimeSelected, setTotalBlockingTimeSelected] = React.useState(false)

  const handleChangeGraphs = async (event) => {
    const graphToSelect = event.target.value
    setSelectedGraph(graphToSelect)
    if (graphToSelect === 'request') {
      setReqSelected(true)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'dom') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(true)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'page') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(true)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'performance') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(true)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'accessibility') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(true)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'cumulative') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(true)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'firstcontentfulpaint') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(true)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'largestcontentfulpaint') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(true)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'interactive') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(true)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'speedindex') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(true)
      setTotalBlockingTimeSelected(false)
    } else if (graphToSelect === 'totalblockingtime') {
      setReqSelected(false)
      setEcoIndexSelected(false)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(true)
    } else {
      setReqSelected(false)
      setEcoIndexSelected(true)
      setDomSelected(false)
      setPageSelected(false)
      setPerformanceSelected(false)
      setAccessibilitySelected(false)
      setCumulativeLayoutShiftSelected(false)
      setFirstContentfulPaintSelected(false)
      setLargestContentfulPaintSelected(false)
      setInteractiveSelected(false)
      setSpeedIndexSelected(false)
      setTotalBlockingTimeSelected(false)
    }
  }

  return (
      <div>
        <GreenItPanelPerProject
          analysisForProjectGreenit={analysisForProjectGreenit}
          projectName={projectName}
          error={error}
          found={found}
        />

        <LightHousePanelPerProject
        loading={loading}
        error={error}
        projectName={projectName}
        lighthouseMetricsForProject= {lighthouseMetricsForProject}
        lighthousePerformanceForProject= {lighthousePerformanceForProject}
        lighthouseAccessibilityForProject= {lighthouseAccessibilityForProject}
        />

        {found && <GraphPanelForProject
          ecoAnalysis={ecoAnalysis}
          reqAnalysis={reqAnalysis}
          domAnalysis={domAnalysis}
          pageAnalysis={pageAnalysis}
          performanceAnalysis={performanceAnalysis}
          accessibilityAnalysis={accessibilityAnalysis}
          cumulativeLayoutshiftAnalysis={cumulativeLayoutshiftAnalysis}
          firstContentfulPaintAnalysis={firstContentfulPaintAnalysis}
          largestContentfulPaintAnalysis={largestContentfulPaintAnalysis}
          interactiveAnalysis={interactiveAnalysis}
          speedIndexAnalysis={speedIndexAnalysis}
          totalBlockingTimeAnalysis={totalBlockingTimeAnalysis}
          found={found}
          selectedGraph={selectedGraph}
          reqSelected={reqSelected}
          domSelected={domSelected}
          pageSelected={pageSelected}
          ecoindexSelected={ecoindexSelected}
          performanceSelected={performanceSelected}
          accessibilitySelected={accessibilitySelected}
          cumulativeLayoutShiftSelected={cumulativeLayoutShiftSelected}
          firstContentfulPaintSelected={firstContentfulPaintSelected}
          largestContentfulPaintSelected={largestContentfulPaintSelected}
          interactiveSelected={interactiveSelected}
          speedIndexSelected={speedIndexSelected}
          totalBlockingTimeSelected={totalBlockingTimeSelected}
          error = {error}
          handleChangeGraphs={handleChangeGraphs}
        />}
      </div>
  )
}
