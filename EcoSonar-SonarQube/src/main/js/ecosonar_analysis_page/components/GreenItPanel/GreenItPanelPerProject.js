import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import { setLetter } from '../../../format/setLetterService'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function GreenItPanelPerProject (props) {
  const { analysisForProjectGreenit, error, projectName, found } = props
  return (
     <div>
    <div className="overview-panel-content bordered">
      {error !== '' && (
        <p className="text-danger">{error}</p>
      )}
      {error === '' && !analysisForProjectGreenit && (
        <p className="text-danger">{formatError(errors.errorGreenITAnalysisNotFound, projectName)}</p>
      )}
      {found && analysisForProjectGreenit && (
        <div>
          <div className="display-flex-row overview-measures-row bordered">
            <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
              <div className="left-part">
                <p className="overview-measures-value text-light a">
                  {Math.trunc(analysisForProjectGreenit.domSize.displayValue)}
                </p>
                <p className="big-spacer-left little-spacer-right"></p>
                Size of the Dom (average)
                <div className="tooltip little-spacer-left">
                  <img src={HelpIcon} alt="Help icon" />
                  <span className="tooltiptext request-tool">
                    The number of DOM elements reflects the complexity of
                    the site and therefore, the efforts to be made by the
                    browser to display the page. The more complex the
                    site, the more power (especially CPU) is needed to
                    display it. And the more we help to shorten the life
                    of the computer on which it runs. Conversely, a
                    particularly simple and lightweight site helps to
                    extend the life of the equipment because it requires
                    little memory and a ???small??? processor.
                  </span>
                </div>
              </div>
              {setLetter(analysisForProjectGreenit.domSize.complianceLevel)}
            </div>
          </div>
          <div className="display-flex-row overview-measures-row bordered">
            <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
              <div className="left-part">
                <p className="overview-measures-value text-light a">
                  {analysisForProjectGreenit.nbRequest.displayValue}
                </p>
                <p className="big-spacer-left little-spacer-right"></p>
                Number of requests (average)
                <div className="tooltip little-spacer-left">
                  <img src={HelpIcon} alt="Help icon" />
                  <span className="tooltiptext request-tool">
                    The number of HTTP requests gives a good idea of the
                    server load. To put it quickly, the more you send
                    request for a page, the more servers will be needed to
                    serve that page.
                  </span>
                </div>
              </div>
              {setLetter(analysisForProjectGreenit.nbRequest.complianceLevel)}
            </div>
          </div>
          <div className="display-flex-row overview-measures-row bordered">
            <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
              <div className="left-part">
                <p className="overview-measures-value text-light a">
                  {Math.trunc(analysisForProjectGreenit.responsesSize.displayValue)}
                </p>
                <p className="big-spacer-left little-spacer-right"></p>
                Size of the Page in Kb (average)
                <div className="tooltip little-spacer-left">
                  <img src={HelpIcon} alt="Help icon" />
                  <span className="tooltiptext page-tool">
                    The weight of the transferred data (KB) reflects the
                    efforts to transport the page to the browser.
                  </span>
                </div>
              </div>
              {setLetter(analysisForProjectGreenit.responsesSize.complianceLevel)}
            </div>
          </div>
          <div className="display-flex-row overview-measures-row">
            <div className="overview-panel-huge-padded flex-1 bordered-right display-flex-center">
              <div className="display-flex-center">
                <div className="display-flex-column">
                  <span>
                    <p className="overview-measures-value text-light a">
                      {analysisForProjectGreenit.greenhouseGasesEmission}
                    </p>
                  </span>
                  <span className="spacer-top">
                    <span>

                      GreenHouse Gases Emission in gCO2e (average)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="overview-panel-huge-padded flex-1 display-flex-center">
              <div className="display-flex-center">
                <div className="display-flex-column">
                  <span>
                    <p className="overview-measures-value text-light a">
                      {analysisForProjectGreenit.waterConsumption}
                    </p>
                  </span>
                  <span className="spacer-top">
                    <span>

                      Water Consumption in centiliter (average)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div></div>
  )
}
