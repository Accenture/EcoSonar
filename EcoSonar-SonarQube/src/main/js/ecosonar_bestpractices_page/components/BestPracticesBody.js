import React, { useState } from 'react'
import AccordionManager from './Accordion/AccordionManager'
import BestPracticesFilters from './BestPracticesFilters/BestPracticesFilters'
import { allTools, auditTypes, defaultSelectedComplianceLevel, greenITTool, lighthouseAccessibility, lighthousePerformanceTool, setTools, w3cValidator } from './BestPracticesFilters/Filters'

export default function BestPracticesBody (props) {
  const {
    isFolded,
    setIsFolded,
    handleCloseAll,
    error,
    urls,
    selectedUrl,
    changeSelectedUrl,
    bestPracticesEcodesign,
    bestPracticesAccessibility,
    savedProcedure,
    changeProcedure
  } = props

  const [selectedAuditTypes, setSelectedAuditTypes] = useState('All')
  const [selectedAuditTools, setSelectedAuditTools] = useState('All')
  const [auditTools, setAuditTools] = useState([allTools, greenITTool, lighthouseAccessibility, lighthousePerformanceTool, w3cValidator])
  const [selectedComplianceLevel, setSelectedComplianceLevel] = useState(defaultSelectedComplianceLevel)

  function changeAuditType (newAuditType) {
    setSelectedAuditTypes(newAuditType)
    const newAuditTool = setTools(newAuditType)
    setAuditTools(newAuditTool)
    setSelectedAuditTools(newAuditTool[0].label)
  }

  function changeAuditTools (newAuditTool) {
    setSelectedAuditTools(newAuditTool)
  }

  function goToTheTop () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {error
        ? (
        <div className="best-practice-error">
          <p className="text-danger">{error}</p>
        </div>
          )
        : (
          <div>
              <BestPracticesFilters
                auditTypes={auditTypes}
                auditTools={auditTools}
                selectedAuditTypes={selectedAuditTypes}
                selectedAuditTools={selectedAuditTools}
                selectedComplianceArray={selectedComplianceLevel}
                selectedUrl={selectedUrl}
                urls={urls}
                setSelectedAuditTypes={changeAuditType}
                setSelectedAuditTools={changeAuditTools}
                setSelectedComplianceArray={(newValue) => setSelectedComplianceLevel(newValue)}
                changeSelectedUrl={changeSelectedUrl}
              />
            <label className="switch" htmlFor="checkbox">
              <input
                type="checkbox"
                checked={isFolded}
                aria-checked={isFolded}
                tabIndex={0}
                aria-labelledby="checkbox"
                onChange={() => handleCloseAll()}
                id="checkbox"
              />
              <div></div>
              Close all
            </label>
            <AccordionManager
              selectedAuditTypes={selectedAuditTypes}
              selectedAuditTools={selectedAuditTools}
              selectedComplianceLevel={selectedComplianceLevel}
              ecoDesignData={bestPracticesEcodesign}
              accessibilityData={bestPracticesAccessibility}
              isFolded={isFolded}
              setIsFolded={setIsFolded}
              procedure={savedProcedure}
              changeProcedureFct={changeProcedure}
            />
            <div className="go-to-the-top-btn">
              <button
                className="basic-button"
                aria-label="go to the top of the page"
                onClick={() => goToTheTop()}
              >
                Go to the top of the page
              </button>
            </div>
          </div>
          )}
    </>
  )
}
