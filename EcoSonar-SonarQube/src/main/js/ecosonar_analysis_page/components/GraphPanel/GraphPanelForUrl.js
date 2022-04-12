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
  const { state, handleChangeGraphs } = props
  return (
    <div>    {!state.loading && (
      <div className="overview-panel big-spacer-top" data-test="overview__activity-panel">
        <h2 className="overview-panel-title">Key Metrics</h2>
        <div className="overview-panel-content">
          <div className="display-flex-row">
            <div className="display-flex-column flex-1">
              <div aria-hidden="true" className="overview-panel-padded display-flex-column flex-1">
                <div className="position-relative">
                  <label htmlFor="graphs">Select a metric to view its evolution during deployments: </label>
                  <select className="select-button" name="graphs" id="graphs" value={state.selectedGraph} onChange={handleChangeGraphs}>
                    <option key="ecoindex" value="ecoindex">EcoIndex</option>
                    <option key="request" value="request">Number of Requests</option>
                    <option key="dom" value="dom">Size of the Dom</option>
                    <option key="page" value="page">Size of the Page</option>
                    <option key="performance" value="performance">Lighthouse Performance Score</option>
                    <option key="accessibility" value="accessibility">Lighthouse Accessibility Score</option>
                    <option key="cumulative" value="cumulative">Cumulative Layout Shift Score</option>
                    <option key="firstcontentfulpaint" value="firstcontentfulpaint">First Contentful Paint Score</option>
                    <option key="largestcontentfulpaint" value="largestcontentfulpaint">Largest Contentful Paint Score</option>
                    <option key="interactive" value="interactive">Time to Interactive Score</option>
                    <option key="speedindex" value="speedindex">Speed Index Score</option>
                    <option key="totalblockingtime" value="totalblockingtime">Total Blocking Time Score</option>
                  </select>
                </div>
                <div className="activity-graph-container flex-grow display-flex-column display-flex-stretch display-flex-justify-center">
                  {!state.foundAnalysis
                    ? (
                    <p className='format-error'>An error occured while retrieving evolution of metrics for url {state.selectedUrl}, please try again.</p>
                      )
                    : (
                    <div>
                      {state.reqSelected && (
                        <RequestGraph
                        reqAnalysis = {state.reqUrl}/>
                      )}
                      {state.domSelected && (
                        <DomGraph
                        domAnalysis = {state.domUrl}/>
                      )}
                      {state.pageSelected && (
                        <PageGraph
                        pageAnalysis = {state.pageUrl}/>
                      )}
                      {state.ecoindexSelected && (
                        <EcoIndexGraph
                        ecoAnalysis = {state.ecoUrl}/>
                      )}
                      {state.performanceSelected && (
                        <PerformanceGraph
                        performanceAnalysis = {state.performanceUrl}/>
                      )}
                      {state.accessibilitySelected && (
                        <AccessibilityGraph
                        accessibilityAnalysis = {state.accessibilityUrl}/>
                      )}
                      {state.cumulativeLayoutShiftSelected && (
                        <CumulativeGraph
                        cumulativeAnalysis = {state.cumulativeLayoutShiftUrl}/>
                      )}
                      {state.firstContentfulPaintSelected && (
                        <FirstContentfulPaintGraph
                        firstContentfulPaintAnalysis = {state.firstContentfulPaintUrl}/>
                      )}
                      {state.largestContentfulPaintSelected && (
                        <LargestContentfulPaintGraph
                        largestContentfulPaintAnalysis = {state.largestContentfulPaintUrl}/>
                      )}
                      {state.interactiveSelected && (
                        <InteractiveGraph
                        interactiveAnalysis = {state.interactiveUrl}/>
                      )}
                      {state.speedIndexSelected && (
                        <SpeedIndexGraph
                        speedIndexAnalysis = {state.speedIndexUrl}/>
                      )}
                      {state.totalBlockingTimeSelected && (
                        <TotalBlockingTimeGraph
                        totalBlockingTimeAnalysis = {state.totalBlockingTimeUrl}/>
                      )}

                    </div>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}</div>

  )
}
