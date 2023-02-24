import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import classNames from 'classnames'
import { setPanelColor } from './PanelColorSetting'

export default function LighthousePerformancePanel (props) {
  const { loading, analysis } = props
  const undefinedStatus = analysis.perfComplianceLevel === undefined
  const panelColor = setPanelColor(analysis.perfComplianceLevel)

  return (
    <div className="ecoindex-panel">
      <h2 className="ecoindex-title">
        Lighthouse performance Score
        <div role='textbox' className="tooltip little-spacer-left" tabIndex={0}>
          <img src={HelpIcon} alt="" />
          <p className="tooltiptext ecoIndex-tool">
            These checks ensure that your page is optimized for users to be able
            to see and interact with page content. The Performance score is a
            weighted average of the performance metric scores. The weightings
            are chosen to provide a balanced representation of the user&apos;s
            perception of performance. The weightings have changed over time
            because the Lighthouse team is regularly doing research and
            gathering feedback to understand what has the biggest impact on
            user-perceived performance. To have more details on Lightouse
            Performance scoring, have a look at this calculator :
            https://googlechrome.github.io/lighthouse/scorecalc/
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
              LighthousePerformancePanelBody(undefinedStatus, panelColor, analysis)
            )}
      </div>
    </div>
  )
}
function LighthousePerformancePanelBody (undefinedStatus, panelColor, analysis) {
  return <>
    {undefinedStatus
      ? (
        <div className="ecoindex-badge undefined">
          <h3 className="ecoindex-badge-title">Undefined</h3>
          <span className="small">
            Lighthouse Performance Score could not be calculated </span>
        </div>
        )
      : (
        <div className={classNames('ecoindex-badge', panelColor)}>
          <h3 className="ecoindex-badge-title">
            {analysis.perfComplianceLevel}
          </h3>
          <p className="small">
            Lighthouse Performance Score for project (average from all
            pages) is <span className="score"> {analysis.perfScore}</span>

          </p>
        </div>
        )}
  </>
}
