import classNames from 'classnames'
import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'

export default function W3cPanel (props) {
  const { loading, analysis, found } = props

  let grade, score
  if (found && analysis) {
    grade = analysis.grade
    score = analysis.score
  } else {
    grade = undefined
    score = undefined
  }

  const undefinedStatus = grade === undefined
  const success = grade === 'A' || grade === 'B'
  const warning = grade === 'C' || grade === 'D'
  const error = grade === 'E' || grade === 'F' || grade === 'G'

  return (
    <div className='ecoindex-panel'>
      <h2 className='ecoindex-title'>
        W3C Validator Project Grade
        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
          <img src={HelpIcon} alt='' />
          <span className='tooltiptext ecoIndex-tool'>
            The Markup Validator is a free service by W3C that helps check the validity of Web documents. Validating Web documents is an important step which can dramatically help improving and
            ensuring their quality, and it can save a lot of time and money. Validating Web Pages is also an important accessibility best practices to resolve (RGAA, criteria 8.2). If the HTML code is
            not well formatted, the browser will dynamically correct a certain number of elements to best display the pages causing problems. These dynamic corrections consume resources unnecessarily
            each time the pages concerned are loaded.
          </span>
        </div>
      </h2>
      <div className='ecoindex-panel-content'>
        {loading
          ? (
          <div>
            <div className="loader"></div>
          </div>
            )
          : (
              W3cPanelBody(undefinedStatus, success, warning, error, grade, score)
            )}
      </div>
    </div>
  )
}
function W3cPanelBody (undefinedStatus, success, warning, error, grade, score) {
  return <>
    {undefinedStatus
      ? (
        <div className='ecoindex-badge undefined'>
          <h3 className='ecoindex-badge-title'>Undefined</h3>
          <p className='small'>W3C Validator Score for project could not be calculated</p>
        </div>
        )
      : (
        <div
          className={classNames('ecoindex-badge', {
            success,
            warning,
            error
          })}
        >
          <h3 className='ecoindex-badge-title'>{grade}</h3>
          <p className='small'>
            W3C Validator Score for project is <span className='score'> {score}</span>
          </p>
        </div>
        )}
  </>
}
