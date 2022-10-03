import classNames from 'classnames'
import * as React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import LoadingIcon from '../../../images/LoadingIcon.svg'
import { setPanelColor } from './PanelColorSetting'

export default function LighthousePerformancePanel (props) {
  const { loading, analysis } = props
  const undefinedStatus = analysis.perfComplianceLevel === undefined
  const panelColor = setPanelColor(analysis.perfComplianceLevel)

  return (
    <div className="ecoindex-panel">
      <h2 className="ecoindex-title">
        Lighthouse performance Score
        <div className="tooltip little-spacer-left">
          <img src={HelpIcon} alt="" />
          <span className="tooltiptext ecoIndex-tool">
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
                      Lighthouse Performance Score could not be calculated                </span>
                  </div>
                  )
                : (
                  <div className={classNames('ecoindex-badge', panelColor)}>
                    <h3 className="ecoindex-badge-title">
                      {analysis.perfComplianceLevel}
                    </h3>
                    <span className="small">
                      Lighthouse Performance Score for project (average from all
                      pages) is
                    </span>
                    <span className="score"> {analysis.perfScore}</span>
                  </div>
                  )}
            </>
            )}
      </div>
    </div>
  )
}
