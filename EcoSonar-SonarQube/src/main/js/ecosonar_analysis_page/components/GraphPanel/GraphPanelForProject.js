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

export default function GraphPanelForProject (props) {
  const {
    allowW3c,
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
    found,
    error,
    w3cAnalysis
  } = props
  // Context is used to manage graphs in both URL and Project components
  const { selectedGraph, setSelectedGraph } = useContext(GraphContext)
  const [displayArrayForAccessibility, setDisplayArrayForAccessibility] = React.useState(false)

  function handleDisplayArrayForAccessibility () {
    setDisplayArrayForAccessibility(!displayArrayForAccessibility)
  }

  return (
    <div className='overview-panel'>
      <h2 className='overview-panel-title'>Key Metrics</h2>
      <div className='overview-panel-content'>
      {!found
        ? (
          <p className='text-danger'>{error}</p>)
        : (
        <div className='display-flex-row'>
          <div className='display-flex-column flex-1'>
            <div aria-hidden='true' className='overview-panel-padded display-flex-column flex-1'>
              <SelectGraphPanel
              selectedGraph={selectedGraph}
              setSelectedGraph={setSelectedGraph}
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
              allowW3c={allowW3c}
              w3cAnalysis={w3cAnalysis}
              />
              <div className='activity-graph-container flex-grow display-flex-column display-flex-stretch display-flex-justify-center'>
                <div>
                {selectedGraph === 'request' && <RequestGraph reqAnalysis={reqAnalysis} />}
                {selectedGraph === 'dom' && <DomGraph domAnalysis={domAnalysis} />}
                {selectedGraph === 'page' && <PageGraph pageAnalysis={pageAnalysis} />}
                {selectedGraph === 'ecoindex' && <EcoIndexGraph ecoAnalysis={ecoAnalysis} />}
                {selectedGraph === 'performance' && <PerformanceGraph performanceAnalysis={performanceAnalysis} />}
                {selectedGraph === 'accessibility' && <AccessibilityGraph accessibilityAnalysis={accessibilityAnalysis} />}
                {selectedGraph === 'cumulative' && <CumulativeGraph cumulativeAnalysis={cumulativeLayoutshiftAnalysis} />}
                {selectedGraph === 'firstcontentfulpaint' && <FirstContentfulPaintGraph firstContentfulPaintAnalysis={firstContentfulPaintAnalysis} />}
                {selectedGraph === 'largestcontentfulpaint' && <LargestContentfulPaintGraph largestContentfulPaintAnalysis={largestContentfulPaintAnalysis} />}
                {selectedGraph === 'interactive' && <InteractiveGraph interactiveAnalysis={interactiveAnalysis} />}
                {selectedGraph === 'speedindex' && <SpeedIndexGraph speedIndexAnalysis={speedIndexAnalysis} />}
                {selectedGraph === 'totalblockingtime' && <TotalBlockingTimeGraph totalBlockingTimeAnalysis={totalBlockingTimeAnalysis} />}
                {selectedGraph === 'w3c' && <W3cGraph w3cAnalysis={w3cAnalysis} />}
                </div>
              </div>
            </div>
          </div>
        </div>)}
        <div className='graph-accessibility-button'>
              <button className='basic-button' onClick={() => handleDisplayArrayForAccessibility()}>
                Display as a table
              </button>
            </div>

            {displayArrayForAccessibility && (
              <div className='accessibility-array'>
                <AccessibleArray
                  ecoUrl={ecoAnalysis}
                  reqUrl={reqAnalysis}
                  domUrl={domAnalysis}
                  pageUrl={pageAnalysis}
                  performanceUrl={performanceAnalysis}
                  accessibilityUrl={accessibilityAnalysis}
                  cumulativeLayoutShiftUrl={cumulativeLayoutshiftAnalysis}
                  firstContentfulPaintUrl={firstContentfulPaintAnalysis}
                  largestContentfulPaintUrl={largestContentfulPaintAnalysis}
                  interactiveUrl={interactiveAnalysis}
                  speedIndexUrl={speedIndexAnalysis}
                  totalBlockingTimeUrl={totalBlockingTimeAnalysis}
                  w3cAnalysis={w3cAnalysis}
                  selectedGraph={selectedGraph}
                />
              </div>
            )}
      </div>
    </div>
  )
}
