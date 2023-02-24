import React from 'react'
import { setLetter } from '../../../format/setLetterService'
import HelpIcon from '../../../images/HelpIcon.svg'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function LightHousePanelPerUrl (props) {
  const { loading, error, lighthouseLastAnalysis, projectName, urlName } = props
  return (
      <div>
        <div className='overview-panel big-spacer-top' data-test='overview__activity-panel'>
          <h2 className='overview-panel-title'>Lighthouse Metrics
            <div role='textbox' className="tooltip little-spacer-left" tabIndex={0}>
              <img src={HelpIcon} alt=""/>
              <span className="tooltiptext ecoIndex-tool">Lighthouse simulates the page load conditions based on a simulated environment. Variability in performance measurement is introduced via a number of channels with different levels of impact. Several common sources of metric variability are local network availability, client hardware availability, and client resource contention. We recommend you to compare Lighthouse Performance metrics that are running in the same EcoSonar instance.</span>
            </div>
          </h2>
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
                {error === '' && lighthouseLastAnalysis === null && <p className='text-danger'>{formatError(errors.errorlighthouseLastAnalysisNotFoundForURL, projectName, urlName)}</p>}
                {error === '' && lighthouseLastAnalysis && Object.keys(lighthouseLastAnalysis).length !== 0 && lighthouseLastAnalysis && Object.keys(lighthouseLastAnalysis).length !== 0 && (
                  <div>
                    <ul>

                      {/* FIRST ROW */}
                      <li>
                        <div className='display-flex-row overview-measures-row'>
                          <ul className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric'>
                              <li className='centered-lighthouse-score'>
                              <div className='centered-score'>
                                  <p className='title-margin-top'>
                                    Performance:
                                    {lighthouseLastAnalysis.performance.displayValue}
                                  </p>
                                  {setLetter(lighthouseLastAnalysis.performance.complianceLevel, true)}
                                </div>
                              </li>
                              <li className='centered-lighthouse-score'>
                                <div className='centered-score'>
                                  <p className='title-margin-top'>
                                    Accessibility:
                                    {lighthouseLastAnalysis.accessibility.displayValue}
                                  </p>
                                  {setLetter(lighthouseLastAnalysis.accessibility.complianceLevel, true)}
                                </div>
                              </li>
                          </ul>
                        </div>
                      </li>

                      {/* SECOND ROW */}
                      <li>
                        <div className='display-flex-row overview-measures-row bordered'>
                          <div className='overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric'>
                            <div className='left-part'>
                              <p className='overview-measures-value  a'>{lighthouseLastAnalysis.largestContentfulPaint.displayValue}</p>
                              <p className='big-spacer-left little-spacer-right'></p>
                              Largest Contenful Paint
                              <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                <img src={HelpIcon} alt='' />
                                <p className='tooltiptext request-tool'>
                                  Largest Contentful Paint is the metric that measures the time a website takes to show the user the largest content on the screen, complete and ready for interaction.
                                </p>
                              </div>
                            </div>
                            {setLetter(lighthouseLastAnalysis.largestContentfulPaint.complianceLevel)}
                          </div>
                        </div>
                      </li>

                      {/* THIRD ROW */}
                      <li>
                        <ul className='display-flex-row overview-measures-row'>
                            <li>
                              <div className='overview-panel-huge-padded flex-1 small-text bordered-right display-flex-center lighthouse-metric'>
                                <div className='left-part'>
                                  <div className='display-flex-center'>
                                    <div className='display-flex-column'>
                                      <span>
                                        <p className='overview-measures-value  a'>{lighthouseLastAnalysis.cumulativeLayoutShift.displayValue}</p>
                                      </span>
                                      <span className='spacer-top'>
                                        <span> Cumulative Layout Shift</span>
                                        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                          <img src={HelpIcon} alt='' />
                                          <p className='tooltiptext request-tool'>
                                            Cumulative Layout Shift (CLS) is a measure of a website&apos;s instability. This measure determines whether a website behaves as the user expects it to
                                            behave. One of the most frustrating aspects of an unstable website is that the page&apos;s content shifts as the user views it.
                                          </p>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {setLetter(lighthouseLastAnalysis.cumulativeLayoutShift.complianceLevel)}
                              </div>
                            </li>
                            <li>
                              <div className='overview-panel-huge-padded small-text flex-1 display-flex-center lighthouse-metric'>
                                <div className='left-part'>
                                  <div className='display-flex-center'>
                                    <div className='display-flex-column'>
                                      <span>
                                        <p className='overview-measures-value  a'>{lighthouseLastAnalysis.firstContentfulPaint.displayValue}</p>
                                      </span>
                                      <span className='spacer-top'>
                                        <span> First Contentful Paint</span>
                                        <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                          <img src={HelpIcon} alt='' />
                                          <p className='tooltiptext request-tool'>
                                            First Contentful Paint (FCP) is an important, user-centric metric for measuring perceived load speed because it marks the first point in the page load
                                            timeline where the user can see anything on the screen—a fast FCP helps reassure the user that something is happening.
                                          </p>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {setLetter(lighthouseLastAnalysis.firstContentfulPaint.complianceLevel)}
                              </div>
                            </li>
                        </ul>
                      </li>

                      {/* FOURTH ROW */}
                      <li>
                        <ul className='display-flex-row overview-measures-row'>
                            <li>
                              <div className='overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric'>
                                <div className='display-flex-center'>
                                  <div className='display-flex-column'>
                                    <span>
                                      <p className='overview-measures-value  a'>{lighthouseLastAnalysis.speedIndex.displayValue}</p>
                                    </span>
                                    <span className='spacer-top'>
                                      <span> Speed index</span>
                                      <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                        <img src={HelpIcon} alt='' />
                                        <p className='tooltiptext request-tool'>Speed Index measures how quickly content is visually displayed during page load.</p>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                                {setLetter(lighthouseLastAnalysis.speedIndex.complianceLevel)}
                              </div>
                            </li>
                            <li>
                              <div className='overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric'>
                                <div className='display-flex-center'>
                                  <div className='display-flex-column'>
                                    <span>
                                      <p className='overview-measures-value  a'>{lighthouseLastAnalysis.totalBlockingTime.displayValue}</p>
                                    </span>
                                    <span className='spacer-top'>
                                      <span> Total blocking Time</span>
                                      <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                        <img src={HelpIcon} alt='' />
                                        <p className='tooltiptext request-tool'>
                                          Total Blocking Time measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard
                                          presses.
                                        </p>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                                {setLetter(lighthouseLastAnalysis.totalBlockingTime.complianceLevel)}
                              </div>
                            </li>
                            <li>
                              <div className='overview-panel-huge-padded flex-1  small-text bordered display-flex-center lighthouse-metric'>
                                <div className='display-flex-center'>
                                  <div className='display-flex-column'>
                                    <span>
                                      <p className='overview-measures-value  a'>{lighthouseLastAnalysis.interactive.displayValue}</p>
                                    </span>
                                    <span className='spacer-top'>
                                      <span> Time to interactive</span>
                                      <div role='textbox' className='tooltip little-spacer-left' tabIndex={0}>
                                        <img src={HelpIcon} alt='' />
                                        <p className='tooltiptext request-tool'>
                                          Time to Interactive (TTI) is one of six metrics tracked in the Performance section of the Lighthouse report. Each metric captures some aspect of page load
                                          speed. Measuring TTI is important because some sites optimize content visibility at the expense of interactivity. This can create a frustrating user experience:
                                          the site appears to be ready, but when the user tries to interact with it, nothing happens.
                                        </p>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                                {setLetter(lighthouseLastAnalysis.interactive.complianceLevel)}
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
