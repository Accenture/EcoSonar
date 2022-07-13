import React from 'react'
import BestPracticesPage from './components/BestPracticesPage'
import '../styles/index.scss'

//  You can access it at /project/extension/ecosonar/ecosonar_bestpractices_page?id={COMPONENT_ID}&qualifier=TRK
window.registerExtension('ecosonar/ecosonar_bestpractices_page', options => {
  return <BestPracticesPage project={options.component}/>
})
