import React from 'react'
import A from '../../../images/A.svg'
import B from '../../../images/B.svg'
import C from '../../../images/C.svg'
import D from '../../../images/D.svg'
import E from '../../../images/E.svg'
import F from '../../../images/F.svg'
import G from '../../../images/G.svg'
import HelpIcon from '../../../images/HelpIcon.svg'
import LoadingIcon from '../../../images/LoadingIcon.svg'

export default function LightHousePanelPerProject (props) {
  const {
    state, lighthouseMetricsForProject,
    lighthousePerformanceForProject,
    lighthouseAccessibilityForProject
  } = props

  function setLetter (value) {
    if (value === 'A') {
      return <img className="image-score" src={A} alt="A" />
    } else if (value === 'B') {
      return <img className="image-score" src={B} alt="B" />
    } else if (value === 'C') {
      return <img className="image-score" src={C} alt="C" />
    } else if (value === 'D') {
      return <img className="image-score" src={D} alt="D" />
    } else if (value === 'E') {
      return <img className="image-score" src={E} alt="E" />
    } else if (value === 'F') {
      return <img className="image-score" src={F} alt="F" />
    } else {
      return <img className="image-score" src={G} alt="G" />
    }
  }

  return (
    <div>
      <div
        className="overview-panel big-spacer-top"
        data-test="overview__activity-panel"
      >
        <h2 className="overview-panel-title">Lighthouse Metrics</h2>
        <div className="overview-panel-content bordered">
          {state.error === ''
            ? (
            <div>
              {state.loading
                ? (
                <div>
                  <img src={LoadingIcon} alt="Loading icon" />
                </div>
                  )
                : (
                <div>
                  {(lighthousePerformanceForProject && lighthouseAccessibilityForProject) && (
                    <div className="display-flex-row overview-measures-row">
                      <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric">
                        <span className="centered-score">
                          Performance:
                          <span className="lightouse-score">
                            {lighthousePerformanceForProject.perfScore}
                            {setLetter(
                              lighthousePerformanceForProject
                                .perfComplianceLevel
                            )}
                          </span>
                        </span>

                        <span className="centered-score">
                          Accessibility:
                          <span className="lightouse-score">
                            {lighthouseAccessibilityForProject.accessScore}
                            {setLetter(
                              lighthouseAccessibilityForProject
                                .accessComplianceLevel
                            )}
                          </span>
                        </span>
                      </div>

                  </div>
                  )}
                  {state.error !== '' && (
                    <p className="format-error">{state.error}</p>
                  )}
                  {lighthouseMetricsForProject && (
                    <div>
                      <div className="display-flex-row overview-measures-row bordered">
                        <div className="overview-panel-big-padded flex-1 small-text display-flex-center big-spacer-left lighthouse-metric">
                          <div className="left-part">
                            <p className="overview-measures-value  a">
                              {
                               lighthouseMetricsForProject
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
                            lighthouseMetricsForProject
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
                                      lighthouseMetricsForProject
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
                            lighthouseMetricsForProject
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
                                   lighthouseMetricsForProject
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
                            lighthouseMetricsForProject
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
                                  lighthouseMetricsForProject
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
                            lighthouseMetricsForProject.speedIndex
                              .complianceLevel
                          )}
                        </div>

                        <div className="overview-panel-huge-padded flex-1 small-text bordered display-flex-center lighthouse-metric">
                          <div className="display-flex-center">
                            <div className="display-flex-column">
                              <span>
                                <p className="overview-measures-value  a">
                                  {
                                  lighthouseMetricsForProject
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
                            lighthouseMetricsForProject
                              .totalBlockingTime.complianceLevel
                          )}
                        </div>

                        <div className="overview-panel-huge-padded flex-1  small-text bordered display-flex-center lighthouse-metric">
                          <div className="display-flex-center">
                            <div className="display-flex-column">
                              <span>
                                <p className="overview-measures-value  a">
                                  {
                                   lighthouseMetricsForProject
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
                            lighthouseMetricsForProject.interactive
                              .complianceLevel
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  )}
            </div>
              )
            : (
            <div className="format-error">
              <p>No Lighthouse Analysis for project {state.projectName} </p>
            </div>
              )}
        </div>
      </div>
    </div>
  )
}
