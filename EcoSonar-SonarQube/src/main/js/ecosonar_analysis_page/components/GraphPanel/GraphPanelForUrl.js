import React, { useContext } from 'react'
import RequestGraph from '../Graphs/RequestGraph'
import DomGraph from '../Graphs/DomGraph'
import EcoIndexGraph from '../Graphs/EcoIndexGraph'
import PageGraph from '../Graphs/PageGraph'
import PerformanceGraph from '../Graphs/PerformanceGraph'
import AccessibilityGraph from '../Graphs/AccessibilityGraph'
import CumulativeGraph from '../Graphs/CumulativeGraph'
import FirstContentfulPaintGraph from '../Graphs/FirstContentfulPaintGraph'
import LargestContentfulPaintGraph from '../Graphs/LargestContentfulPaintGraph'
import InteractiveGraph from '../Graphs/InteractiveGraph'
import SpeedIndexGraph from '../Graphs/SpeedIndexGraph'
import TotalBlockingTimeGraph from '../Graphs/TotalBlockingTimeGraph'
import { GraphContext } from '../../../context/GraphContext'
import AccessibleArray from './AccessibleArray'
import W3cGraph from '../Graphs/W3cGraph'
import SelectGraphPanel from './SelectGraphPanel'

export default function GraphPanelForUrl (props) {
  const {
    allowW3c,
    loading,
    foundAnalysis,
    error,
    ecoUrl,
    reqUrl,
    domUrl,
    pageUrl,
    performanceUrl,
    accessibilityUrl,
    cumulativeLayoutShiftUrl,
    firstContentfulPaintUrl,
    largestContentfulPaintUrl,
    interactiveUrl,
    speedIndexUrl,
    totalBlockingTimeUrl,
    w3cAnalysis
  } = props
  // Context is used to manage graphs in both URL and Project components
  const { selectedGraph, setSelectedGraph } = useContext(GraphContext)

  const [displayArrayForAccessibility, setDisplayArrayForAccessibility] = React.useState(false)

  function handleDisplayArrayForAccessibility () {
    setDisplayArrayForAccessibility(!displayArrayForAccessibility)
  }

  return (
    <div>
      {!loading && (
        <div className='overview-panel big-spacer-top' data-test='overview__activity-panel'>
          <h2 className='overview-panel-title'>Key Metrics</h2>
          <div className='overview-panel-content'>
            {!foundAnalysis
              ? (
              <p className='text-danger'>{error}</p>
                )
              : (
              <div className='display-flex-row'>
                <div className='display-flex-column flex-1'>
                  <div aria-hidden='true' className='overview-panel-padded display-flex-column flex-1'>
                    <SelectGraphPanel
                      selectedGraph={selectedGraph}
                      setSelectedGraph={setSelectedGraph}
                      ecoAnalysis={ecoUrl}
                      reqAnalysis={reqUrl}
                      domAnalysis={domUrl}
                      pageAnalysis={pageUrl}
                      performanceAnalysis={performanceUrl}
                      accessibilityAnalysis={accessibilityUrl}
                      cumulativeLayoutshiftAnalysis={cumulativeLayoutShiftUrl}
                      firstContentfulPaintAnalysis={firstContentfulPaintUrl}
                      largestContentfulPaintAnalysis={largestContentfulPaintUrl}
                      interactiveAnalysis={interactiveUrl}
                      speedIndexAnalysis={speedIndexUrl}
                      totalBlockingTimeAnalysis={totalBlockingTimeUrl}
                      allowW3c={allowW3c}
                      w3cAnalysis={w3cAnalysis}
                      />
                    <div className='activity-graph-container flex-grow display-flex-column display-flex-stretch display-flex-justify-center'>
                      <div>
                        {selectedGraph === 'request' && <RequestGraph reqAnalysis={reqUrl} />}
                        {selectedGraph === 'dom' && <DomGraph domAnalysis={domUrl} />}
                        {selectedGraph === 'page' && <PageGraph pageAnalysis={pageUrl} />}
                        {selectedGraph === 'ecoindex' && <EcoIndexGraph ecoAnalysis={ecoUrl} />}
                        {selectedGraph === 'performance' && <PerformanceGraph performanceAnalysis={performanceUrl} />}
                        {selectedGraph === 'accessibility' && <AccessibilityGraph accessibilityAnalysis={accessibilityUrl} />}
                        {selectedGraph === 'cumulative' && <CumulativeGraph cumulativeAnalysis={cumulativeLayoutShiftUrl} />}
                        {selectedGraph === 'firstcontentfulpaint' && <FirstContentfulPaintGraph firstContentfulPaintAnalysis={firstContentfulPaintUrl} />}
                        {selectedGraph === 'largestcontentfulpaint' && <LargestContentfulPaintGraph largestContentfulPaintAnalysis={largestContentfulPaintUrl} />}
                        {selectedGraph === 'interactive' && <InteractiveGraph interactiveAnalysis={interactiveUrl} />}
                        {selectedGraph === 'speedindex' && <SpeedIndexGraph speedIndexAnalysis={speedIndexUrl} />}
                        {selectedGraph === 'totalblockingtime' && <TotalBlockingTimeGraph totalBlockingTimeAnalysis={totalBlockingTimeUrl} />}
                        {selectedGraph === 'w3c' && <W3cGraph w3cAnalysis={w3cAnalysis} />}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
                )}
            <div className='graph-accessibility-button'>
              <button className='basic-button' onClick={() => handleDisplayArrayForAccessibility()}>
                Display as a table
              </button>
            </div>

            {displayArrayForAccessibility && (
              <div className='accessibility-array'>
                <AccessibleArray
                  ecoUrl={ecoUrl}
                  reqUrl={reqUrl}
                  domUrl={domUrl}
                  pageUrl={pageUrl}
                  performanceUrl={performanceUrl}
                  accessibilityUrl={accessibilityUrl}
                  cumulativeLayoutShiftUrl={cumulativeLayoutShiftUrl}
                  firstContentfulPaintUrl={firstContentfulPaintUrl}
                  largestContentfulPaintUrl={largestContentfulPaintUrl}
                  interactiveUrl={interactiveUrl}
                  speedIndexUrl={speedIndexUrl}
                  totalBlockingTimeUrl={totalBlockingTimeUrl}
                  selectedGraph={selectedGraph}
                  w3c = {w3cAnalysis}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
