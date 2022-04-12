import React from 'react'
import ConfigurationPage from './components/ConfigurationPage'
import '../styles/index.scss'

//  You can access it at /project/extension/ecosonar/configuration_ecosonar_page?id={COMPONENT_ID}&qualifier=TRK
window.registerExtension('ecosonar/ecosonar_configuration_page', options => {
  return <ConfigurationPage project={options.component}/>
})
