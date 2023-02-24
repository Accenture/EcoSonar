import React from 'react'
import handleChangeGraphs from './handleChangeGraphs'

export default function SelectGraphPanel (props) {
  const {
    selectedGraph,
    setSelectedGraph,
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
    allowW3c,
    w3cAnalysis
  } = props
  return (
        <div className='position-relative'>
                <label htmlFor='graphs'>Select a metric to view its evolution during deployments:</label>
                <select className='select-button' name='graphs' id='graphs' value={selectedGraph} onChange={(event) => handleChangeGraphs(event, setSelectedGraph)}>
                <optgroup label='List of graphs'>

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
                  {allowW3c === 'true' && w3cAnalysis.length > 0 && <option key='w3c' value='w3c'>
                    W3C Score
                  </option>}
                  </optgroup>
                </select>
              </div>
  )
}
