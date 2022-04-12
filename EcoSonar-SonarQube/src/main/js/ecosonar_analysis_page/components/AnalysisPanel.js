import * as React from 'react'
import BoxedTabs from './BoxedTabs'
import LoadingIcon from '../../images/LoadingIcon.svg'
import AnalysisPerUrlPanel from './AnalysisPerUrlPanel'
import AnalysisPerProjectPanel from './AnalysisPerProjectPanel'

const AnalysisPanelTabs = {
  URL: 'URL',
  PROJECT: 'PROJECT'
}

export default function AnalysisPanel (props) {
  const {
    loading,
    analysis,
    lighthouseMetricsForProject,
    lighthousePerformanceForProject,
    lighthouseAccessibilityForProject,
    date,
    error,
    projectName,
    found,
    ecoAnalysis,
    domAnalysis,
    pageAnalysis,
    reqAnalysis,
    performanceAnalysis,
    accessibilityAnalysis,
    cumulativeLayoutshiftAnalysis,
    firstContentfulPaintAnalysis,
    largestContentfulPaintAnalysis,
    interactiveAnalysis,
    speedIndexAnalysis,
    totalBlockingTimeAnalysis,
    project,
    urls,
    foundUrl,
    selectedUrl,
    errorUrl,
    foundAll
  } = props
  const [tab, selectTab] = React.useState(AnalysisPanelTabs.PROJECT)
  const isPerUrlTab = tab === AnalysisPanelTabs.URL
  const tabs = [
    {
      key: AnalysisPanelTabs.URL,
      label: (
        <div className='analysis-tab'>
          <span className='text-bold'>EcoSonar Analysis per URL</span>
        </div>
      )
    },
    {
      key: AnalysisPanelTabs.PROJECT,
      label: (
        <div className='analysis-tab'>
          <span className='text-bold'>EcoSonar Analysis for project</span>
        </div>
      )
    }
  ]

  return (
    <div className='analysis-panel'>
      <div className='analysis-panel-title'>
        <h2 className='ecoindex-title'>EcoSonar Analysis -</h2>
        {analysis !== {} && <h6>- last analysis at {date} </h6>}
      </div>

      {loading
        ? (
        <div className='loading'>
          <img src={LoadingIcon} alt='Loading icon' />
        </div>
          )
        : (
        <>
          <BoxedTabs onSelect={selectTab} selected={tab} tabs={tabs} />

          <div className='analysis-panel-content'>
            {isPerUrlTab
              ? (
              <AnalysisPerUrlPanel project={project} urls={urls} foundUrl={foundUrl} selectedUrl={selectedUrl} errorUrl={errorUrl} />
                )
              : (
              <AnalysisPerProjectPanel
                analysis={analysis}
                lighthouseMetricsForProject={lighthouseMetricsForProject}
                lighthousePerformanceForProject={lighthousePerformanceForProject}
                lighthouseAccessibilityForProject={lighthouseAccessibilityForProject}
                error={error}
                found={found}
                ecoAnalysis={ecoAnalysis}
                domAnalysis={domAnalysis}
                pageAnalysis={pageAnalysis}
                reqAnalysis={reqAnalysis}
                performanceAnalysis={performanceAnalysis}
                accessibilityAnalysis={accessibilityAnalysis}
                cumulativeLayoutshiftAnalysis={cumulativeLayoutshiftAnalysis}
                firstContentfulPaintAnalysis={firstContentfulPaintAnalysis}
                largestContentfulPaintAnalysis={largestContentfulPaintAnalysis}
                interactiveAnalysis={interactiveAnalysis}
                speedIndexAnalysis={speedIndexAnalysis}
                totalBlockingTimeAnalysis={totalBlockingTimeAnalysis}
                foundAll={foundAll}
                projectName={projectName}
              />
                )}
          </div>
        </>
          )}
    </div>
  )
}
