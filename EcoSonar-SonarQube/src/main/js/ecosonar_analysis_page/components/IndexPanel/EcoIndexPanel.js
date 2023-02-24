import classNames from 'classnames'
import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'

export default function EcoIndexPanel (props) {
  const { loading, analysis, found } = props

  let grade, ecoindex
  if (found && analysis) {
    grade = analysis.grade
    ecoindex = analysis.ecoIndex
  } else {
    grade = undefined
    ecoindex = undefined
  }

  const undefinedStatus = grade === undefined
  const success = grade === 'A' || grade === 'B'
  const warning = grade === 'C' || grade === 'D'
  const error = grade === 'E' || grade === 'F' || grade === 'G'

  return (
        <div className="ecoindex-panel">
            <h2 className="ecoindex-title">
                EcoIndex Project Grade
                <div role='textbox' className="tooltip little-spacer-left" tabIndex={0}>
                  <img src={HelpIcon} alt=""/>
                  <span className="tooltiptext ecoIndex-tool">EcoIndex is an open source tool which, for a given URL,
                   makes it possible to evaluate its environemental performance using a score out of 100 (higher is better).
                   EcoIndex is calculated based on application metrics such as number of DOM elements, number of requests or
                   size of the page. The EcoSonar plugin allows you to aggregate all metrics from the pages of your
                   application to infer the EcoIndex of your project. You can find more information here (http://www.ecoindex.fr/)
                   or on this blog (https://blog.octo.com/sous-le-capot-de-la-mesure-ecoindex/)</span>
                </div>
            </h2>
            <div className="ecoindex-panel-content">
                {loading
                  ? (
                      <div>
                          <div className="loader"></div>
                      </div>
                    )
                  : EcoIndexPanelBody(undefinedStatus, success, warning, error, grade, ecoindex)
                    }
            </div>
        </div>
  )
}
function EcoIndexPanelBody (undefinedStatus, success, warning, error, grade, ecoindex) {
  return <>
    {undefinedStatus
      ? (<div
        className='ecoindex-badge undefined'>
        <h3 className="ecoindex-badge-title">Undefined</h3>
        <p className="small">
          EcoIndex Score for project could not be calculated
        </p>
      </div>)
      : (<div
        className={classNames('ecoindex-badge', {
          success,
          warning,
          error
        })}>
        <h3 className="ecoindex-badge-title">{grade}</h3>
        <p className="small">
          EcoIndex Score for project (average from all pages) is <span className="score"> {ecoindex}</span>
        </p>
      </div>)}
  </>
}
