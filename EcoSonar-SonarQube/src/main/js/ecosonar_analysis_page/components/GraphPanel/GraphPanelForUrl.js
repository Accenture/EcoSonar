import React, { useContext } from 'react'
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
import { GraphContext } from '../../../context/GraphContext'
import handleChangeGraphs from './GraphManager'
import AccessibleArray from '../GraphPanel/AccessibleArray'
import W3cGraph from '../Graphs/W3c'

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
                    <div className='position-relative'>
                      <label htmlFor='graphs'>Select a metric to view its evolution during deployments: </label>
                      <select className='select-button' name='graphs' id='graphs' value={selectedGraph} onChange={(event) => handleChangeGraphs(event, setSelectedGraph)}>
                        <optgroup label='List of graphs'>
                        {ecoUrl.length > 0 && (
                          <option key='ecoindex' value='ecoindex'>
                            EcoIndex
                          </option>
                        )}
                        {reqUrl.length > 0 && (
                          <option key='request' value='request'>
                            Number of Requests
                          </option>
                        )}
                        {domUrl.length > 0 && (
                          <option key='dom' value='dom'>
                            Size of the Dom
                          </option>
                        )}
                        {pageUrl.length > 0 && (
                          <option key='page' value='page'>
                            Size of the Page
                          </option>
                        )}
                        {performanceUrl.length > 0 && (
                          <option key='performance' value='performance'>
                            Lighthouse Performance Score
                          </option>
                        )}
                        {accessibilityUrl.length > 0 && (
                          <option key='accessibility' value='accessibility'>
                            Lighthouse Accessibility Score
                          </option>
                        )}
                        {cumulativeLayoutShiftUrl.length > 0 && (
                          <option key='cumulative' value='cumulative'>
                            Cumulative Layout Shift Score
                          </option>
                        )}
                        {firstContentfulPaintUrl.length > 0 && (
                          <option key='firstcontentfulpaint' value='firstcontentfulpaint'>
                            First Contentful Paint Score
                          </option>
                        )}
                        {largestContentfulPaintUrl.length > 0 && (
                          <option key='largestcontentfulpaint' value='largestcontentfulpaint'>
                            Largest Contentful Paint Score
                          </option>
                        )}
                        {interactiveUrl.length > 0 && (
                          <option key='interactive' value='interactive'>
                            Time to Interactive Score
                          </option>
                        )}
                        {speedIndexUrl.length > 0 && (
                          <option key='speedindex' value='speedindex'>
                            Speed Index Score
                          </option>
                        )}
                        {totalBlockingTimeUrl.length > 0 && (
                          <option key='totalblockingtime' value='totalblockingtime'>
                            Total Blocking Time Score
                          </option>
                        )}
                        {allowW3c === 'true' && w3cAnalysis.length > 0 && (
                          <option key='w3c' value='w3c'>
                            W3C Score
                          </option>
                        )}
                        </optgroup>
                      </select>
                    </div>
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
              <button active='false' className='basic-button' onClick={() => handleDisplayArrayForAccessibility()}>
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
