
import React, { useState } from 'react'
import BestPracticesAccordion from '../components/bestPracticesAccordion'
import greenItData from '../data/greenItData'
import lighthouseAccessibilityData from '../data/lighthouseAccessibilityData'
import lighthousePerformanceData from '../data/lighthousePerformanceData'
import FlowerWhite1 from '../images/Flower/FlowerWhite1.svg'
import GreenItLogo from '../images/Logo/GreenITLogo.svg'
import LighthouseLogo from '../images/Logo/LighthouseLogo.svg'

const buttonsList = [
  { value: 'GR491', action: 'https://gr491.isit-europe.org/en/' },
  { value: 'WCAG', action: 'https://www.w3.org/WAI/standards-guidelines/wcag' },
  { value: 'Ecometer', action: 'http://www.ecometer.org/rules/' }
]

export default function BestPractices () {
  const [selectedTab, setSelectedTab] = useState('greenit')

  function switchBestPractice (content) {
    setSelectedTab(content)
  }

  function displayButton (value, action, index) {
    console.log()
    return (
      <form key={index} action={action} method='get' target='_blank'>
        <button aria-label={`redirection to ${value} page`} className='primary contained margin-button' type='submit' >{value}</button>
      </form>
    )
  }

  return (
    <div className='best-practices'>
      <p className='title-pages'>Best practices</p>
      <div className='row block'>
        <div className='content-best-practice'>
          <p className='title'>Ecodesign and Accessibility Best Practices</p>
          <p>EcoSonar has been designed as an audit aggregator included directly into the CI/CD pipeline for a continuous monitoring of eco-design and accessibility scores. Our wish was to easily integrate new rules or new audit tools. Currently, 3 audit tools have been added into EcoSonar audits: GreenIT-Analysis (based on EcoIndex), Lighthouse Performance and Lighthouse Accessibility. For each of them, you will find below best practice descriptions as well as correction examples and references to official eco-design and accessibility referentials.</p>
          <div className='group-btns'>
            {buttonsList.map((button, index) =>
              displayButton(button.value, button.action, index)
            )}
          </div>
        </div>
        <img src={FlowerWhite1} className='img-flower-white-1' alt='' />
      </div>
      <nav className='tab'>
        <ul className='nav tabs'>
          <li>
            <button aria-label='show green-it analysis best practices' onClick={() => switchBestPractice('greenit')} className={`${selectedTab === 'greenit' ? 'tab-btn-selected' : 'tab-btn'}`} >GreenIT-Analysis</button>
          </li>
          <li>
            <button aria-label='show lighthouse performance best practices' onClick={() => switchBestPractice('lighthouseperf')} className={`${selectedTab === 'lighthouseperf' ? 'tab-btn-selected' : 'tab-btn'}`} >Lighthouse Performance</button>
          </li>
          <li>
            <button aria-label='show lighthouse accessibility best practcies' onClick={() => switchBestPractice('lighthouseaccess')} className={`${selectedTab === 'lighthouseaccess' ? 'tab-btn-selected' : 'tab-btn'}`} >Lighthouse Accessibility</button>
          </li>
        </ul>
      </nav>
      <div className='accordions'>
        {(selectedTab === 'greenit') && (
          <>
            {greenItData.map((bestPractice, index) =>
              <BestPracticesAccordion key={index} title={bestPractice.title} icon={GreenItLogo} description={bestPractice.description} correction={bestPractice.correction} />
            )}
          </>
        )}
        {(selectedTab === 'lighthouseperf') && (
          <>
            {lighthousePerformanceData.map((bestPractice, index) =>
              <BestPracticesAccordion key={index} index={index} title={bestPractice.title} icon={LighthouseLogo} description={bestPractice.description} correction={bestPractice.correction} />
            )}
          </>
        )}
        {(selectedTab === 'lighthouseaccess') && (
          <>
            {lighthouseAccessibilityData.map((bestPractice, index) =>
              <BestPracticesAccordion key={index} index={index} title={bestPractice.title} icon={LighthouseLogo} description={bestPractice.description} correction={bestPractice.correction} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
