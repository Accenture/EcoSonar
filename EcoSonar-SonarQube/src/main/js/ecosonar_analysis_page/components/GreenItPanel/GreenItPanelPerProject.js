import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import { setLetter } from '../../../format/setLetterService'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function GreenItPanelPerProject (props) {
  const { analysisForProjectGreenit, error, projectName, found } = props
  return (
    <div>
      <div className='overview-panel-content bordered'>
        {error !== '' && <p className='text-danger'>{error}</p>}
        {error === '' && !analysisForProjectGreenit && <p className='text-danger'>{formatError(errors.errorGreenITAnalysisNotFound, projectName)}</p>}
        {found && analysisForProjectGreenit && (
          <div>
            <ul>
              <li>
                <div className='display-flex-row overview-measures-row bordered'>
                  <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                    <div className='left-part'>
                      <p className='overview-measures-value text-light a'>{Math.trunc(analysisForProjectGreenit.domSize.displayValue)}</p>
                      <p className='big-spacer-left little-spacer-right'></p>
                      Size of the Dom (average)
                      <div role="textbox" className='tooltip little-spacer-left' tabIndex={0}>
                        <img src={HelpIcon} alt='' />
                        <p className='tooltiptext request-tool'>
                          The number of DOM elements reflects the complexity of the site and therefore, the efforts to be made by the browser to display the page. The more complex the site, the more
                          power (especially CPU) is needed to display it. And the more we help to shorten the life of the computer on which it runs. Conversely, a particularly simple and lightweight
                          site helps to extend the life of the equipment because it requires little memory and a “small” processor.
                        </p>
                      </div>
                    </div>
                    {setLetter(analysisForProjectGreenit.domSize.complianceLevel)}
                  </div>
                </div>
              </li>

              <li>
                <div className='display-flex-row overview-measures-row bordered'>
                  <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                    <div className='left-part'>
                      <p className='overview-measures-value text-light a'>{analysisForProjectGreenit.nbRequest.displayValue}</p>
                      <p className='big-spacer-left little-spacer-right'></p>
                      Number of requests (average)
                      <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                        <img src={HelpIcon} alt='' />
                        <p className='tooltiptext request-tool'>
                          The number of HTTP requests gives a good idea of the server load. To put it quickly, the more you send request for a page, the more servers will be needed to serve that page.
                        </p>
                      </div>
                    </div>
                    {setLetter(analysisForProjectGreenit.nbRequest.complianceLevel)}
                  </div>
                </div>
              </li>

              <li>
                <div className='display-flex-row overview-measures-row bordered'>
                  <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                    <div className='left-part'>
                      <p className='overview-measures-value text-light a'>{Math.trunc(analysisForProjectGreenit.responsesSize.displayValue)}</p>
                      <p className='big-spacer-left little-spacer-right'></p>
                      Size of the Page in Kb (average)
                      <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                        <img src={HelpIcon} alt='' />
                        <p className='tooltiptext page-tool'>The weight of the transferred data (KB) reflects the efforts to transport the page to the browser.</p>
                      </div>
                    </div>
                    {setLetter(analysisForProjectGreenit.responsesSize.complianceLevel)}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
