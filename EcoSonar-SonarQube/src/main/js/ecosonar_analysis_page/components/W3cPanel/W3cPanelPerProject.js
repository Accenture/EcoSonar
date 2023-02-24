import React from 'react'
import { setLetter } from '../../../format/setLetterService'
import HelpIcon from '../../../images/HelpIcon.svg'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function W3CPanelPerProject (props) {
  const { loading, error, projectName, analysisForProjectW3c } = props

  return (
    <div>
      <div className='overview-panel big-spacer-top' data-test='overview__activity-panel'>
        <h2 className='overview-panel-title'>W3C Metrics</h2>
        <div className='overview-panel-content bordered'>
          {loading
            ? (
              <div>
                <div className="loader"></div>
              </div>
              )
            : (
              <div>
                {error !== '' && <p className='text-danger'>{error}</p>}
                {error === '' && analysisForProjectW3c === null && <p className='text-danger'>{formatError(errors.errorW3cAnalysisNotFound, projectName)}</p>}
                {error === '' && analysisForProjectW3c && (
                  <div>
                    <ul>
                      {/* FIRST ROW */}
                      <li>
                        <div className='display-flex-row overview-measures-row'>
                          <ul className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric'>
                            <li className='centered-lighthouse-score'>
                              <div className='centered-score'>
                                <p className='title-margin-top'>
                                  Score :
                                  {analysisForProjectW3c.score}
                                </p>
                                {setLetter(analysisForProjectW3c.grade, true)}
                              </div>
                              <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                <img src={HelpIcon} alt='' />
                                <p className='tooltiptext request-tool'>W3C score is calculated from every errors found in W3C analysis.</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* SECOND ROW */}
                      <li>
                        <ul className='display-flex-row overview-measures-row'>
                          <li>
                            <div className='overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric'>
                              <div className='display-flex-center'>
                                <div className='display-flex-column'>
                                  <span>
                                    <p className='overview-measures-value  a'>{analysisForProjectW3c.totalInfo}</p>
                                  </span>
                                  <span className='spacer-top'>
                                    <span> Infos </span>
                                    <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                      <img src={HelpIcon} alt='' />
                                      <p className='tooltiptext request-tool'>This is the amount of issues with type info given by the W3C analysis.</p>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className='overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric'>
                              <div className='display-flex-center'>
                                <div className='display-flex-column'>
                                  <span>
                                    <p className='overview-measures-value  a'>{analysisForProjectW3c.totalWarning}</p>
                                  </span>
                                  <span className='spacer-top'>
                                    <span> Warnings </span>
                                    <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                      <img src={HelpIcon} alt='' />
                                      <p className='tooltiptext request-tool'>
                                        This is the amount of issues with type warning given by the W3C analysis.</p>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className='overview-panel-huge-padded flex-1  small-text bordered display-flex-center lighthouse-metric'>
                              <div className='display-flex-center'>
                                <div className='display-flex-column'>
                                  <span>
                                    <p className='overview-measures-value  a'>{analysisForProjectW3c.totalError}</p>
                                  </span>
                                  <span className='spacer-top'>
                                    <span> Errors </span>
                                    <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                      <img src={HelpIcon} alt='' />
                                      <p className='tooltiptext request-tool'>
                                        This is the amount of issues with type error given by the W3C analysis.</p>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className='overview-panel-huge-padded flex-1  small-text bordered display-flex-center lighthouse-metric'>
                              <div className='display-flex-center'>
                                <div className='display-flex-column'>
                                  <span>
                                    <p className='overview-measures-value  a'>{analysisForProjectW3c.totalFatalError}</p>
                                  </span>
                                  <span className='spacer-top'>
                                    <span> Fatal Errors </span>
                                    <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                      <img src={HelpIcon} alt='' />
                                      <p className='tooltiptext request-tool'>
                                        This is the amount of issues with type fatal error given by the W3C analysis.</p>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              )}
        </div>
      </div>
    </div>
  )
}
