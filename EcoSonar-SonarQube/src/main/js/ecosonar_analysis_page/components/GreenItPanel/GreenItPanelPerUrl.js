/* eslint-disable jsx-a11y/no-onchange */
import React from 'react'
import formatError from '../../../format/formatError'
import { setLetter } from '../../../format/setLetterService'
import HelpIcon from '../../../images/HelpIcon.svg'
import errors from '../../../utils/errors.json'

export default function GreenItPanelPerUrl (props) {
  const { loading, error, greenItLastAnalysis, foundAnalysis, foundUrl, projectName, urlName, handleChange, selectedUrl, urls } = props

  return (
    <div className='overview-panel-content bordered'>
      {loading
        ? (
        <div>
          <div className="loader"></div>
        </div>
          )
        : (
        <div>
          {foundUrl && (
            <div className='display-flex-row overview-measures-row'>
              <div className='overview-panel-big-padded flex-1 display-flex-center'>
                <div className='url-selector'>
                  <label htmlFor='urls'>Select URL you want to analyze:</label>
                  <select className='select-button' name='url' id='urls' value={selectedUrl} onChange ={handleChange}>
                    <optgroup label='List of URLs'>
                      {urls.map((url, index) => {
                        return (
                          <option key={index} value={url}>
                            {url}
                          </option>
                        )
                      })}
                    </optgroup>
                  </select>
                </div>
              </div>
              {greenItLastAnalysis !== null && foundAnalysis && !error && (
                <div className='overview-panel-big-padded overview-measures-aside display-flex-center'>
                  <p className='flex-1 big-spacer-right text-right'>EcoIndex: {greenItLastAnalysis.ecoIndex}</p>
                  {setLetter(greenItLastAnalysis.grade)}
                </div>
              )}
            </div>
          )}
          {error !== '' && <p className='text-danger'>{error}</p>}
          {greenItLastAnalysis === null && <p className='text-danger'>{formatError(errors.errorGreenITLastAnalysisNotFoundForURL, projectName, urlName)}</p>}
          {greenItLastAnalysis !== null && foundAnalysis && (
            <div>
              <ul>
                <li>
                  <div className='display-flex-row overview-measures-row bordered'>
                    <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                      <div className='left-part'>
                        <p className='overview-measures-value  a'>{Math.trunc(greenItLastAnalysis.domSize.displayValue)}</p>
                        <p className='big-spacer-left little-spacer-right'></p>
                        Size of the Dom
                        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                          <img src={HelpIcon} alt='' />
                          <p className='tooltiptext request-tool'>
                            The number of DOM elements reflects the complexity of the site and therefore, the efforts to be made by the browser to display the page. The more complex the site, the more
                            power (especially CPU) is needed to display it. And the more we help to shorten the life of the computer on which it runs. Conversely, a particularly simple and lightweight
                            site helps to extend the life of the equipment because it requires little memory and a “small” processor.
                          </p>
                        </div>
                      </div>
                      {setLetter(greenItLastAnalysis.domSize.complianceLevel)}
                    </div>
                  </div>
                </li>

                <li>
                  <div className='display-flex-row overview-measures-row bordered'>
                    <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                      <div className='left-part'>
                        <p className='overview-measures-value  a'>{greenItLastAnalysis.nbRequest.displayValue}</p>
                        <p className='big-spacer-left little-spacer-right'></p>
                        Number of requests
                        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                          <img src={HelpIcon} alt='' />
                          <p className='tooltiptext request-tool'>
                            The number of HTTP requests gives a good idea of the server load. To put it quickly, the more you send request for a page, the more servers will be needed to serve that
                            page.
                          </p>
                        </div>
                      </div>

                      {setLetter(greenItLastAnalysis.nbRequest.complianceLevel)}
                    </div>
                  </div>
                </li>

                <li>
                  <div className='display-flex-row overview-measures-row bordered'>
                    <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left'>
                      <div className='left-part'>
                        <p className='overview-measures-value  a'>{Math.trunc(greenItLastAnalysis.responsesSize.displayValue)}</p>
                        <p className='big-spacer-left little-spacer-right'></p>
                        Size of the Page in Kb
                        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                          <img src={HelpIcon} alt='' />
                          <p className='tooltiptext page-tool'>The weight of the transferred data (KB) reflects the efforts to transport the page to the browser.</p>
                        </div>
                      </div>
                      {setLetter(greenItLastAnalysis.responsesSize.complianceLevel)}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
          )}
    </div>
  )
}
