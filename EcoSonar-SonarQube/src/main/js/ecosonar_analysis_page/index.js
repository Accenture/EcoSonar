import React from 'react'
import GreenItAnalysisPage from './components/EcoSonarAnalysisPage'
import '../styles/index.scss'

//  You can access it at /project/extension/ecosonar/ecosonar_analysis_page?id={COMPONENT_ID}&qualifier=TRK
window.registerExtension('ecosonar/ecosonar_analysis_page', (options) => {
  return (

  <GreenItAnalysisPage project={options.component} />
  )
})
