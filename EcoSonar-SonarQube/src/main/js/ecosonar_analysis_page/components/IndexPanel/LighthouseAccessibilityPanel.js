import classNames from 'classnames'
import * as React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import LoadingIcon from '../../../images/LoadingIcon.svg'
import { setPanelColor } from './PanelColorSetting'

export default function LighthouseAccessibilityPanel (props) {
  const { loading, analysis } = props
  const undefinedStatus = analysis.accessComplianceLevel === undefined
  const panelColor = setPanelColor(analysis.accessComplianceLevel)

  return (
    <div className="ecoindex-panel">
      <h2 className="ecoindex-title">
        Lighthouse Accessibility Score
        <div className="tooltip little-spacer-left">
          <img src={HelpIcon} alt="" />
          <span className="tooltiptext ecoIndex-tool">
            The Lighthouse Accessibility score is a weighted average of all
            accessibility audits. Weighting is based on axe user impact
            assessments. Each accessibility audit is pass or fail. Unlike the
            Performance audits, a page doesn&apos;t get points for partially
            passing an accessibility audit. For example, if some buttons on a
            page have accessible names, but others don&apos;t, the page gets a 0
            for the Buttons do not have an accessible name audit. The following
            table shows the weighting for each accessibility audit. More heavily
            weighted audits have a bigger effect on your score. Manual audits
            aren&apos;t included in the table because they don&apos;t affect
            your score.
          </span>
        </div>
      </h2>
      <div className="ecoindex-panel-content">
        {loading
          ? (
            <div>
              <img src={LoadingIcon} alt="Loading icon" />
            </div>
            )
          : (
            <>
              {undefinedStatus
                ? (
                  <div className="ecoindex-badge undefined">
                    <h3 className="ecoindex-badge-title">Undefined</h3>
                    <span className="small">
                      Lighthouse Accessibility Score for project could not be
                      calculated
                    </span>
                  </div>
                  )
                : (
                  <div className={classNames('ecoindex-badge', panelColor)}>
                    <h3 className="ecoindex-badge-title">
                      {analysis.accessComplianceLevel}
                    </h3>
                    <span className="small">
                      Lighthouse Accessibility Score for project (average from all
                      pages) is
                    </span>
                    <span className="score"> {analysis.accessScore}</span>
                  </div>
                  )}
            </>
            )}
      </div>
    </div>
  )
}
