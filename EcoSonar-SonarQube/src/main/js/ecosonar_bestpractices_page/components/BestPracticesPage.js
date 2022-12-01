import React, { useEffect, useState } from 'react'
import LoadingIcon from '../../images/LoadingIcon.svg'
import { getBestPractices, getBestPracticesForUrl } from '../../services/bestpracticesService'
import { getUrlsConfiguration } from './../../services/configUrlService'
import AccordionManager from './Accordion/AccordionManager'
import BestPracticesFilters from './BestPracticesFilters/BestPracticesFilters'
import { allTools, auditTypes, defaultSelectedComplianceLevel, greenITTool, lighthouseAccessibility, lighthousePerformanceTool, w3cValidator, setTools } from './BestPracticesFilters/Filters'

export default function BestPracticesPage (props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFolded, setIsFolded] = useState(false)

  const [selectedUrl, setSelectedUrl] = useState('All')
  const [bestPracticesEcodesign, setBestPracticesEcodesign] = useState({})
  const [bestPracticesAccessibility, setBestPracticesAccessibility] = useState({})
  const [dateAnalysisBestPractices, setDateAnalysisBestPractices] = useState('')
  const [auditTools, setAuditTools] = useState([allTools, greenITTool, lighthouseAccessibility, lighthousePerformanceTool, w3cValidator])

  const [urls, setUrls] = useState([])
  const [selectedAuditTypes, setSelectedAuditTypes] = useState('All')
  const [selectedAuditTools, setSelectedAuditTools] = useState('All')
  const [selectedComplianceLevel, setSelectedComplianceLevel] = useState(defaultSelectedComplianceLevel)

  const ariaHidden = true

  useEffect(() => {
    getBestPractices(props.project.key)
      .then((data) => {
        setResultData(data)
      })
      .catch((result) => {
        if (result instanceof Error) {
          setError(result.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    getUrlsConfiguration(props.project.key)
      .then((data) => {
        data.unshift('All')
        setUrls(data)
      })
      .catch((result) => {
        if (result instanceof Error) {
          setError(result.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function changeSelectedUrl (event) {
    setError(null)
    setLoading(true)
    setSelectedUrl(event.target.value)
    if (event.target.value === 'All') {
      getBestPractices(props.project.key)
        .then((data) => {
          setResultData(data)
        })
        .catch((result) => {
          if (result instanceof Error) {
            setError(result.message)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      getBestPracticesForUrl(props.project.key, event.target.value)
        .then((data) => {
          setResultData(data)
        })
        .catch((result) => {
          if (result instanceof Error) {
            setError(result.message)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  function setResultData (data) {
    setBestPracticesEcodesign(data.ecodesign)

    setBestPracticesAccessibility(data.accessibility)
    const formattedDate3 = new Date(data.dateAnalysisBestPractices)
    setDateAnalysisBestPractices(`${formattedDate3.toDateString()} - ${formattedDate3.toLocaleTimeString([], { hour12: false })}`)
  }

  function changeAuditType (newAuditType) {
    setSelectedAuditTypes(newAuditType)
    const newAuditTool = setTools(newAuditType)
    setAuditTools(newAuditTool)
    setSelectedAuditTools(newAuditTool[0].label)
  }

  function changeAuditTools (newAuditTool) {
    setSelectedAuditTools(newAuditTool)
  }

  return (
    <main role='main' className='page' aria-hidden={ariaHidden}>
      <h1 className='title-best-practices'>
        Best Practices for project {props.project.key} - last analysis at {dateAnalysisBestPractices}
      </h1>
      <div className='header-best-practices'>
        <p>
          When analysing the different pages from your website, EcoSonar will be able to detect if some ecodesign good practices have been implemented in your web application. For each practices
          analysed, it will give you a score from A to G according to the compliance level and will guide you to apply them. Achieve an A Score in each of the practices to better optimize your
          ressources.
        </p>
      </div>
      <div className='best-practices'>
        <BestPracticesFilters
          auditTypes={auditTypes}
          auditTools={auditTools}
          selectedAuditTools={selectedAuditTools}
          selectedComplianceArray={selectedComplianceLevel}
          selectedUrl={selectedUrl}
          urls={urls}
          setSelectedAuditTypes={changeAuditType}
          setSelectedAuditTools={changeAuditTools}
          setSelectedComplianceArray={(newValue) => setSelectedComplianceLevel(newValue)}
          changeSelectedUrl={changeSelectedUrl}
        />
        {loading
          ? < img src={LoadingIcon} alt='Loading icon' />
          : (
            <>
              <label className='switch' htmlFor='checkbox' >
                <input
                  type='checkbox'
                  checked={isFolded}
                  aria-checked={isFolded}
                  tabIndex={0}
                  aria-labelledby="checkbox"
                  onChange={() => setIsFolded(!isFolded)}
                  id='checkbox' />
                <div></div>
                Close all
              </label>
              {error
                ? <div className='best-practice-error'>
                  <p className='text-danger'>{error}</p>
                </div>
                : <AccordionManager
                  selectedAuditTypes={selectedAuditTypes}
                  selectedAuditTools={selectedAuditTools}
                  selectedComplianceLevel={selectedComplianceLevel}
                  ecoDesignData={bestPracticesEcodesign}
                  accessibilityData={bestPracticesAccessibility}
                  isFolded={isFolded}
                  setIsFolded={setIsFolded}
                />
              }
            </>
            )}
      </div>
    </main>
  )
}
