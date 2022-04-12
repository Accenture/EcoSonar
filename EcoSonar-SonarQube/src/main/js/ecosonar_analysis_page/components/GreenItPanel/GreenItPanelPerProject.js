import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'

export default function GreenItPanelPerProject (props) {
  const { state } = props

  return (
   <div>
  <div className="overview-panel-content bordered">
    {state.error !== '' && (
      <p className="format-error">{state.error}</p>
    )}
    {state.found && (
      <div>
        <div className="display-flex-row overview-measures-row bordered">
          <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
            <div className="left-part">
              <p className="overview-measures-value text-light a">
                {Math.trunc(state.analysis.domSize)}
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
                  little memory and a “small” processor.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="display-flex-row overview-measures-row bordered">
          <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
            <div className="left-part">
              <p className="overview-measures-value text-light a">
                {state.analysis.nbRequest}
              </p>
              <p className="big-spacer-left little-spacer-right"></p>
              Number of requests (sum)
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
          </div>
        </div>
        <div className="display-flex-row overview-measures-row bordered">
          <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left">
            <div className="left-part">
              <p className="overview-measures-value text-light a">
                {Math.trunc(state.analysis.responsesSize)}
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
          </div>
        </div>
        <div className="display-flex-row overview-measures-row">
          <div className="overview-panel-huge-padded flex-1 bordered-right display-flex-center">
            <div className="display-flex-center">
              <div className="display-flex-column">
                <span>
                  <p className="overview-measures-value text-light a">
                    {state.analysis.greenhouseGasesEmission}
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
                    {state.analysis.waterConsumption}
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
