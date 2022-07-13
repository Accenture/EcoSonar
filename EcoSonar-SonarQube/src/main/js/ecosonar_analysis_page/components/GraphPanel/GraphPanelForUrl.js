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

export default function GraphPanelForUrl (props) {
  const {
    loading,
    foundAnalysis,
    error,
    selectedGraph,
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
    handleChangeGraphs
  } = props

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
                  <div className='position-relative'>
                    <label htmlFor='graphs'>Select a metric to view its evolution during deployments: </label>
                    <select className='select-button' name='graphs' id='graphs' value={selectedGraph} onChange={handleChangeGraphs}>
                      {ecoUrl.length > 0 && <option key='ecoindex' value='ecoindex'>
                        EcoIndex
                      </option>}
                      {reqUrl.length > 0 && <option key='request' value='request'>
                        Number of Requests
                      </option>}
                      {domUrl.length > 0 && <option key='dom' value='dom'>
                        Size of the Dom
                      </option>}
                      {pageUrl.length > 0 && <option key='page' value='page'>
                        Size of the Page
                      </option>}
                      {performanceUrl.length > 0 && <option key='performance' value='performance'>
                        Lighthouse Performance Score
                      </option>}
                      {accessibilityUrl.length > 0 && <option key='accessibility' value='accessibility'>
                        Lighthouse Accessibility Score
                      </option>}
                      {cumulativeLayoutShiftUrl.length > 0 && <option key='cumulative' value='cumulative'>
                        Cumulative Layout Shift Score
                      </option>}
                      {firstContentfulPaintUrl.length > 0 && <option key='firstcontentfulpaint' value='firstcontentfulpaint'>
                        First Contentful Paint Score
                      </option>}
                      {largestContentfulPaintUrl.length > 0 && <option key='largestcontentfulpaint' value='largestcontentfulpaint'>
                        Largest Contentful Paint Score
                      </option>}
                      {interactiveUrl.length > 0 && <option key='interactive' value='interactive'>
                        Time to Interactive Score
                      </option>}
                      {speedIndexUrl.length > 0 && <option key='speedindex' value='speedindex'>
                        Speed Index Score
                      </option>}
                      {totalBlockingTimeUrl.length > 0 && <option key='totalblockingtime' value='totalblockingtime'>
                        Total Blocking Time Score
                      </option>}
                    </select>
                  </div>
                  <div className='activity-graph-container flex-grow display-flex-column display-flex-stretch display-flex-justify-center'>
                      <div>
                        {reqSelected && <RequestGraph reqAnalysis={reqUrl} />}
                        {domSelected && <DomGraph domAnalysis={domUrl} />}
                        {pageSelected && <PageGraph pageAnalysis={pageUrl} />}
                        {ecoindexSelected && <EcoIndexGraph ecoAnalysis={ecoUrl} />}
                        {performanceSelected && <PerformanceGraph performanceAnalysis={performanceUrl} />}
                        {accessibilitySelected && <AccessibilityGraph accessibilityAnalysis={accessibilityUrl} />}
                        {cumulativeLayoutShiftSelected && <CumulativeGraph cumulativeAnalysis={cumulativeLayoutShiftUrl} />}
                        {firstContentfulPaintSelected && <FirstContentfulPaintGraph firstContentfulPaintAnalysis={firstContentfulPaintUrl} />}
                        {largestContentfulPaintSelected && <LargestContentfulPaintGraph largestContentfulPaintAnalysis={largestContentfulPaintUrl} />}
                        {interactiveSelected && <InteractiveGraph interactiveAnalysis={interactiveUrl} />}
                        {speedIndexSelected && <SpeedIndexGraph speedIndexAnalysis={speedIndexUrl} />}
                        {totalBlockingTimeSelected && <TotalBlockingTimeGraph totalBlockingTimeAnalysis={totalBlockingTimeUrl} />}
                      </div>
                  </div>
                </div>
              </div>
            </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
