import React from 'react'
import RequestGraph from '../Graphs/RequestGraph'
import DomGraph from '../Graphs/DomGraph'
import EcoIndexGraph from '../Graphs/EcoIndexGraph'
import PageGraph from '../Graphs/PageGraph'
import PerformanceGraph from '../Graphs/PerformanceGraph'
import AccessibilityGraph from '../Graphs/AccessibilityGraph'
import CumulativeGraph from '../Graphs/CumulativeGraph'
import FirstContentfulPaintGraph from '../Graphs/FirstContentfulPaintGraph'
import LargestContentfulPaintGraph from '../Graphs/LargestContentfulGraph'
import InteractiveGraph from '../Graphs/InteractiveGraph'
import SpeedIndexGraph from '../Graphs/SpeedIndexGraph'
import TotalBlockingTimeGraph from '../Graphs/TotalBlockingTimeGraph'

export default function GraphPanelForProject (props) {
  const {
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
    selectedGraph,
    reqSelected,
    domSelected,
    pageSelected,
    ecoindexSelected,
    performanceSelected,
    accessibilitySelected,
    cumulativeLayoutShiftSelected,
    firstContentfulPaintSelected,
    largestContentfulPaintSelected,
    interactiveSelected,
    speedIndexSelected,
    totalBlockingTimeSelected,
    handleChangeGraphs,
    error
  } = props

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
              <div className='position-relative'>
                <label htmlFor='graphs'>Select a metric to view its evolution during deployments:</label>
                <select className='select-button' name='graphs' id='graphs' value={selectedGraph} onChange={handleChangeGraphs}>
                  {ecoAnalysis.length > 0 && <option key='ecoindex' value='ecoindex'>
                    EcoIndex
                  </option>}
                  {reqAnalysis.length > 0 && <option key='request' value='request'>
                    Number of Requests
                  </option>}
                  {domAnalysis.length > 0 && <option key='dom' value='dom'>
                    Size of the Dom
                  </option>}
                  {pageAnalysis.length > 0 && <option key='page' value='page'>
                    Size of the page
                  </option>}
                  {performanceAnalysis.length > 0 && <option key='performance' value='performance'>
                    Lighthouse Performance Score
                  </option>}
                  {accessibilityAnalysis.length > 0 && <option key='accessibility' value='accessibility'>
                    Lighthouse Accessibility Score
                  </option>}
                  {cumulativeLayoutshiftAnalysis.length > 0 && <option key='cumulative' value='cumulative'>
                    Cumulative Layout Shift Score
                  </option>}
                  {firstContentfulPaintAnalysis.length > 0 && <option key='firstcontentfulpaint' value='firstcontentfulpaint'>
                    First Contentful Paint Score
                  </option>}
                  {largestContentfulPaintAnalysis.length > 0 && <option key='largestcontentfulpaint' value='largestcontentfulpaint'>
                    Largest Contentful Paint Score
                  </option>}
                  {interactiveAnalysis.length > 0 && <option key='interactive' value='interactive'>
                    Time to Interactive Score
                  </option>}
                  {speedIndexAnalysis.length > 0 && <option key='speedindex' value='speedindex'>
                    Speed Index Score
                  </option>}
                  {totalBlockingTimeAnalysis.length > 0 && <option key='totalblockingtime' value='totalblockingtime'>
                    Total Blocking Time Score
                  </option>}
                </select>
              </div>
              <div className='activity-graph-container flex-grow display-flex-column display-flex-stretch display-flex-justify-center'>
                <div>
                {reqSelected && <RequestGraph reqAnalysis={reqAnalysis} />}
                {domSelected && <DomGraph domAnalysis={domAnalysis} />}
                {pageSelected && <PageGraph pageAnalysis={pageAnalysis} />}
                {ecoindexSelected && <EcoIndexGraph ecoAnalysis={ecoAnalysis} />}
                {performanceSelected && <PerformanceGraph performanceAnalysis={performanceAnalysis} />}
                {accessibilitySelected && <AccessibilityGraph accessibilityAnalysis={accessibilityAnalysis} />}
                {cumulativeLayoutShiftSelected && <CumulativeGraph cumulativeAnalysis={cumulativeLayoutshiftAnalysis} />}
                {firstContentfulPaintSelected && <FirstContentfulPaintGraph firstContentfulPaintAnalysis={firstContentfulPaintAnalysis} />}
                {largestContentfulPaintSelected && <LargestContentfulPaintGraph largestContentfulPaintAnalysis={largestContentfulPaintAnalysis} />}
                {interactiveSelected && <InteractiveGraph interactiveAnalysis={interactiveAnalysis} />}
                {speedIndexSelected && <SpeedIndexGraph speedIndexAnalysis={speedIndexAnalysis} />}
                {totalBlockingTimeSelected && <TotalBlockingTimeGraph totalBlockingTimeAnalysis={totalBlockingTimeAnalysis} />}
                </div></div>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  )
}
