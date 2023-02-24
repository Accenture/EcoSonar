import classNames from 'classnames'
import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import { setPanelColor } from './PanelColorSetting'

export default function LighthouseAccessibilityPanel (props) {
  const { loading, analysis } = props
  const undefinedStatus = analysis.accessComplianceLevel === undefined
  const panelColor = setPanelColor(analysis.accessComplianceLevel)

  return (
    <div className="ecoindex-panel">
      <h2 className="ecoindex-title">
        Lighthouse Accessibility Score
        <div role='textbox' className="tooltip little-spacer-left" tabIndex={0}>
          <img src={HelpIcon} alt="" />
          <p className="tooltiptext ecoIndex-tool">
            The Lighthouse Accessibility score is a weighted average of all
            accessibility audits. Weighting is based on axe user impact
            assessments. Each accessibility audit is pass or fail. Unlike the
            Performance audits, a page doesn&apos;t get points for partially
            passing an accessibility audit. For example, if some buttons on a
            page have accessible names, but others don&apos;t, the page gets a 0
            page have accessible names, but others don&apos;t, the page gets a 0
            for the Buttons do not have an accessible name audit. The following
            table shows the weighting for each accessibility audit. More heavily
            weighted audits have a bigger effect on your score. Manual audits
            aren&apos;t included in the table because they don&apos;t affect
            your score.
          </p>
        </div>
      </h2>
      <div className="ecoindex-panel-content">
        {loading
          ? (
          <div>
            <div className="loader"></div>
          </div>
            )
          : (
              LighthouseAccessibilityPanelBody(undefinedStatus, panelColor, analysis)
            )}
      </div>
    </div>
  )
}
function LighthouseAccessibilityPanelBody (undefinedStatus, panelColor, analysis) {
  return <>
    {undefinedStatus
      ? (
        <div className="ecoindex-badge undefined">
          <h3 className="ecoindex-badge-title">Undefined</h3>
          <p className="small">
            Lighthouse Accessibility Score for project could not be
            calculated
          </p>
        </div>
        )
      : (
        <div className={classNames('ecoindex-badge', panelColor)}>
          <h3 className="ecoindex-badge-title">
            {analysis.accessComplianceLevel}
          </h3>
          <p className="small">
            Lighthouse Accessibility Score for project (average from all
            pages) is <span className="score"> {analysis.accessScore}</span>

          </p>
        </div>
        )}
  </>
}
