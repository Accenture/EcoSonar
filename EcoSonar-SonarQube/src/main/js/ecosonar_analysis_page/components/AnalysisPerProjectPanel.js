import React from 'react'
import GreenItPanelPerProject from './GreenItPanel/GreenItPanelPerProject'
import LightHousePanelPerProject from './LighthousePanel/LighthousePanelPerProject'
import GraphPanelForProject from './GraphPanel/GraphPanelForProject'
import W3CPanelPerProject from './W3cPanel/W3cPanelPerProject'
export default function AnalysisPerProjectPanel (props) {
  const {
    allowW3c,
    analysisForProjectGreenit,
    ecoAnalysis,
    reqAnalysis,
    domAnalysis,
    pageAnalysis,
    performanceAnalysis,
    accessibilityAnalysis,
    cumulativeLayoutshiftAnalysis,
    firstContentfulPaintAnalysis,
    largestContentfulPaintAnalysis,
    interactiveAnalysis,
    speedIndexAnalysis,
    totalBlockingTimeAnalysis,
    error,
    found,
    projectName,
    loading,
    lighthouseMetricsForProject,
    lighthousePerformanceForProject,
    lighthouseAccessibilityForProject,
    analysisForProjectW3c,
    w3cAnalysis
  } = props

  return (
    <div>
      <GreenItPanelPerProject analysisForProjectGreenit={analysisForProjectGreenit} projectName={projectName} error={error} found={found} />

      <LightHousePanelPerProject
        loading={loading}
        error={error}
        projectName={projectName}
        lighthouseMetricsForProject={lighthouseMetricsForProject}
        lighthousePerformanceForProject={lighthousePerformanceForProject}
        lighthouseAccessibilityForProject={lighthouseAccessibilityForProject}
      />

     {allowW3c === 'true' && <W3CPanelPerProject loading={loading} error={error} projectName={projectName} analysisForProjectW3c={analysisForProjectW3c} />}

      {found && (
        <GraphPanelForProject
          allowW3c={allowW3c}
          ecoAnalysis={ecoAnalysis}
          reqAnalysis={reqAnalysis}
          domAnalysis={domAnalysis}
          pageAnalysis={pageAnalysis}
          performanceAnalysis={performanceAnalysis}
          accessibilityAnalysis={accessibilityAnalysis}
          cumulativeLayoutshiftAnalysis={cumulativeLayoutshiftAnalysis}
          firstContentfulPaintAnalysis={firstContentfulPaintAnalysis}
          largestContentfulPaintAnalysis={largestContentfulPaintAnalysis}
          interactiveAnalysis={interactiveAnalysis}
          speedIndexAnalysis={speedIndexAnalysis}
          totalBlockingTimeAnalysis={totalBlockingTimeAnalysis}
          found={found}
          error={error}
          w3cAnalysis={w3cAnalysis}
        />
      )}
    </div>
  )
}
