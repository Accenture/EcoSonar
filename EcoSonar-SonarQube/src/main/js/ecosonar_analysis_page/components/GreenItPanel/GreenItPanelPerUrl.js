import React from 'react'
import formatError from '../../../format/formatError'
import { setLetter } from '../../../format/setLetterService'
import HelpIcon from '../../../images/HelpIcon.svg'
import LoadingIcon from '../../../images/LoadingIcon.svg'
import errors from '../../../utils/errors.json'

export default function GreenItPanelPerUrl (props) {
  const { state, handleChange } = props

  return (
    <div className='overview-panel-content bordered'>
      {state.loading
        ? (
          <div>
            <img src={LoadingIcon} alt='Loading icon' />
          </div>
          )
        : (
        <div>
          {state.foundUrl && (
            <div className='display-flex-row overview-measures-row'>
                  <div className='overview-panel-big-padded flex-1 display-flex-center'>
                    <div className='url-selector'>
                      <label htmlFor='urls'>Select URL you want to analyze:</label>
                      <select className='select-button' name='url' id='urls' value={state.selectedUrl} onChange={handleChange}>
                        {state.urls.map((url, index) => {
                          return (
                            <option key={index} value={url}>
                              {url}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  {state.foundAnalysis && !state.error && (
                    <div className='overview-panel-big-padded overview-measures-aside display-flex-center'>
                      <span className='flex-1 big-spacer-right text-right'>EcoIndex: {state.greenItAnalysis.ecoIndex}</span>
                      {setLetter(state.greenItAnalysis.grade)}
                    </div>
                  )}
            </div>
          )}
          {state.error !== '' && <p className='text-danger'>{state.error}</p>}
          {state.greenItAnalysis === null && (
              <p className='text-danger'>{formatError(errors.errorGreenITAnalysisNotFoundForURL, state.selectedUrl, state.projectName)}</p>
          )}
          {state.greenItAnalysis !== null && state.foundAnalysis && (
            <div>
              <div className='display-flex-row overview-measures-row bordered'>
                <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                  <div className='left-part'>
                    <p className='overview-measures-value  a'>{Math.trunc(state.greenItAnalysis.domSize.displayValue)}</p>
                    <p className='big-spacer-left little-spacer-right'></p>
                    Size of the Dom
                    <div className='tooltip little-spacer-left'>
                      <img src={HelpIcon} alt='Help icon' />
                      <span className='tooltiptext request-tool'>
                        The number of DOM elements reflects the complexity of the site and therefore, the efforts to be made by the browser to display the page. The more complex the site, the more
                        power (especially CPU) is needed to display it. And the more we help to shorten the life of the computer on which it runs. Conversely, a particularly simple and lightweight
                        site helps to extend the life of the equipment because it requires little memory and a “small” processor.
                      </span>
                    </div>
                  </div>
                  {setLetter(state.greenItAnalysis.domSize.complianceLevel)}
                </div>
              </div>
              <div className='display-flex-row overview-measures-row bordered'>
                <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                  <div className='left-part'>
                    <p className='overview-measures-value  a'>{state.greenItAnalysis.nbRequest.displayValue}</p>
                    <p className='big-spacer-left little-spacer-right'></p>
                    Number of requests
                    <div className='tooltip little-spacer-left'>
                      <img src={HelpIcon} alt='Help icon' />
                      <span className='tooltiptext request-tool'>
                        The number of HTTP requests gives a good idea of the server load. To put it quickly, the more you send request for a page, the more servers will be needed to serve that page.
                      </span>
                    </div>
                  </div>

                  {setLetter(state.greenItAnalysis.nbRequest.complianceLevel)}
                </div>
              </div>
              <div className='display-flex-row overview-measures-row bordered'>
                <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                  <div className='left-part'>
                    <p className='overview-measures-value  a'>{Math.trunc(state.greenItAnalysis.responsesSize.displayValue)}</p>
                    <p className='big-spacer-left little-spacer-right'></p>
                    Size of the Page in Kb
                    <div className='tooltip little-spacer-left'>
                      <img src={HelpIcon} alt='Help icon' />
                      <span className='tooltiptext page-tool'>The weight of the transferred data (KB) reflects the efforts to transport the page to the browser.</span>
                    </div>
                  </div>
                  {setLetter(state.greenItAnalysis.responsesSize.complianceLevel)}
                </div>
              </div>
              </div>
          )}
          </div>
          )}
    </div>
  )
}
