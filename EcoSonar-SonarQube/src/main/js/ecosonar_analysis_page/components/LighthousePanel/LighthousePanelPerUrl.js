import React from 'react'
import HelpIcon from '../../../images/HelpIcon.svg'
import LoadingIcon from '../../../images/LoadingIcon.svg'
import { setLetter } from '../../../format/setLetterService'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function LightHousePanelPerUrl (props) {
  const { state } = props

  return (
    <div>
      <div
        className="overview-panel big-spacer-top"
        data-test="overview__activity-panel"
      >
        <h2 className="overview-panel-title">Lighthouse Metrics</h2>
        <div className="overview-panel-content bordered">
        {state.loading
          ? (
                <div>
                  <img src={LoadingIcon} alt="Loading icon" />
                </div>
            )
          : (<div>
            {state.error !== '' && (
              <p className="text-danger">{state.error}</p>
            )}
            {state.error === '' && state.lighthouseAnalysis === null && (
              <p className="text-danger">{formatError(errors.errorLighthouseAnalysisNotFoundForURL, state.projectName)}</p>
            )}
            {state.error === '' && (state.lighthouseAnalysis && Object.keys(state.lighthouseAnalysis).length !== 0 && state.lighthouseAnalysis && Object.keys(state.lighthouseAnalysis).length !== 0) && (
              <div>
                <div className="display-flex-row overview-measures-row">
                  <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric">
                  <span className="centered-score">
                    Performance:
                    <span className="lightouse-score">
                      {state.lighthouseAnalysis.performance.score}
                      {setLetter(
                        state.lighthouseAnalysis.performance.complianceLevel
                      )}
                    </span>
                  </span>

                  <span className="centered-score">
                    Accessibility:
                    <span className="lightouse-score">
                      {state.lighthouseAnalysis.accessibility.score}
                      {setLetter(
                        state.lighthouseAnalysis.accessibility.complianceLevel
                      )}
                    </span>
                  </span>
                </div>
                </div>
                <div className="display-flex-row overview-measures-row bordered">
                  <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric">
                    <div className="left-part">
                      <p className="overview-measures-value  a">
                        {
                          state.lighthouseAnalysis
                            .largestContentfulPaint.displayValue
                        }
                      </p>
                      <p className="big-spacer-left little-spacer-right"></p>
                      Largest Contenful Paint
                      <div className="tooltip little-spacer-left">
                        <img src={HelpIcon} alt="Help icon" />
                        <span className="tooltiptext request-tool">
                                                          Largest Contentful Paint is the metric that
                          measures the time a website takes to show the
                          user the largest content on the screen, complete
                          and ready for interaction.
                        </span>
                      </div>
                    </div>
                    {setLetter(
                      state.lighthouseAnalysis
                        .largestContentfulPaint.complianceLevel
                    )}
                  </div>
                </div>

                <div className="display-flex-row overview-measures-row">
                  <div className="overview-panel-huge-padded flex-1 small-text bordered-right display-flex-center lighthouse-metric">
                    <div className="left-part">
                      <div className="display-flex-center">
                        <div className="display-flex-column">
                          <span>
                            <p className="overview-measures-value  a">
                              {
                                state.lighthouseAnalysis
                                  .cumulativeLayoutShift.displayValue
                              }
                            </p>
                          </span>
                          <span className="spacer-top">
                            <span> Cumulative Layout Shift</span>
                            <div className="tooltip little-spacer-left">
                              <img src={HelpIcon} alt="Help icon" />
                              <span className="tooltiptext request-tool">
                                                                      Cumulative Layout Shift (CLS) is a measure
                                of a website&apos;s instability. This
                                measure determines whether a website
                                behaves as the user expects it to behave.
                                One of the most frustrating aspects of an
                                unstable website is that the page&apos;s
                                content shifts as the user views it.
                              </span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    {setLetter(
                      state.lighthouseAnalysis
                        .cumulativeLayoutShift.complianceLevel
                    )}
                  </div>

                  <div className="overview-panel-huge-padded small-text flex-1 display-flex-center lighthouse-metric">
                    <div className="left-part">
                      <div className="display-flex-center">
                        <div className="display-flex-column">
                          <span>
                            <p className="overview-measures-value  a">
                              {
                              state.lighthouseAnalysis
                                .firstContentfulPaint.displayValue
                              }
                            </p>
                          </span>
                          <span className="spacer-top">
                            <span> First Contentful Paint</span>
                            <div className="tooltip little-spacer-left">
                              <img src={HelpIcon} alt="Help icon" />
                              <span className="tooltiptext request-tool">
                                                                      First Contentful Paint (FCP) is an
                                important, user-centric metric for
                                measuring perceived load speed because it
                                marks the first point in the page load
                                timeline where the user can see anything
                                on the screen—a fast FCP helps reassure
                                the user that something is happening.
                              </span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    {setLetter(
                      state.lighthouseAnalysis
                        .firstContentfulPaint.complianceLevel
                    )}
                  </div>
                </div>

                <div className="display-flex-row overview-measures-row">
                  <div className="overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric">
                    <div className="display-flex-center">
                      <div className="display-flex-column">
                        <span>
                          <p className="overview-measures-value  a">
                            {
                            state.lighthouseAnalysis
                              .speedIndex.displayValue
                            }
                          </p>
                        </span>
                        <span className="spacer-top">
                          <span> Speed index</span>
                          <div className="tooltip little-spacer-left">
                            <img src={HelpIcon} alt="Help icon" />
                            <span className="tooltiptext request-tool">
                                                                  Speed Index measures how quickly content is
                              visually displayed during page load.
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                    {setLetter(
                      state.lighthouseAnalysis.speedIndex
                        .complianceLevel
                    )}
                  </div>

                  <div className="overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric">
                    <div className="display-flex-center">
                      <div className="display-flex-column">
                        <span>
                          <p className="overview-measures-value  a">
                            {
                            state.lighthouseAnalysis
                              .totalBlockingTime.displayValue
                            }
                          </p>
                        </span>
                        <span className="spacer-top">
                          <span> Total blocking Time</span>
                          <div className="tooltip little-spacer-left">
                            <img src={HelpIcon} alt="Help icon" />
                            <span className="tooltiptext request-tool">
                            Total Blocking Time measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses.
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>                          {setLetter(
                      state.lighthouseAnalysis
                        .totalBlockingTime.complianceLevel
                    )}
                  </div>

                  <div className="overview-panel-huge-padded flex-1  small-text bordered display-flex-center lighthouse-metric">
                    <div className="display-flex-center">
                      <div className="display-flex-column">
                        <span>
                          <p className="overview-measures-value  a">
                            {
                              state.lighthouseAnalysis
                                .interactive.displayValue
                            }
                          </p>
                        </span>
                        <span className="spacer-top">
                          <span> Time to interactive</span>
                          <div className="tooltip little-spacer-left">
                            <img src={HelpIcon} alt="Help icon" />
                            <span className="tooltiptext request-tool">
                                                                  Time to Interactive (TTI) is one of six
                              metrics tracked in the Performance section
                              of the Lighthouse report. Each metric
                              captures some aspect of page load speed.
                              Measuring TTI is important because some
                              sites optimize content visibility at the
                              expense of interactivity. This can create a
                              frustrating user experience: the site
                              appears to be ready, but when the user tries
                              to interact with it, nothing happens.
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>                          {setLetter(
                      state.lighthouseAnalysis.interactive
                        .complianceLevel
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>)
                }
        </div>
      </div>
    </div>
  )
}
