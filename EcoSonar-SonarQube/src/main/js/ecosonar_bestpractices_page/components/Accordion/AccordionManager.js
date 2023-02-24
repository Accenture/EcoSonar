import React, { useEffect, useState } from 'react'
import { allAccessibilityTools, allEcodesignTools, allTools } from '../BestPracticesFilters/Filters'
import Accordion from './Accordion'

export default function AccordionManager (props) {
  const {
    selectedAuditTypes,
    selectedAuditTools,
    selectedComplianceLevel,
    ecoDesignData,
    accessibilityData,
    isFolded,
    setIsFolded,
    procedure,
    changeProcedureFct
  } = props
  const [filteredEcodesignData, setFilteredEcodesignData] = useState(ecoDesignData)
  const [filteredAccessibilityData, setFilteredAccessibilityData] = useState(accessibilityData)

  useEffect(() => {
    // Filter Ecodesign Audit Tool
    const filteredEcodesignDataToSave = {}
    Object.keys(ecoDesignData).forEach(key => {
      if (selectedAuditTools === allTools.label || selectedAuditTools === allEcodesignTools.label || ecoDesignData[key].tool === selectedAuditTools) {
        filteredEcodesignDataToSave[key] = ecoDesignData[key]
      }
    })
    setFilteredEcodesignData(filteredEcodesignDataToSave)
  }, [ecoDesignData, selectedAuditTools, selectedComplianceLevel])

  useEffect(() => {
    // Filter Accessibility Audit tool
    const filteredAccessibilityDataToSave = {}
    Object.keys(accessibilityData).forEach(key => {
      if (selectedAuditTools === allTools.label || selectedAuditTools === allAccessibilityTools.label || accessibilityData[key].tool === selectedAuditTools) {
        filteredAccessibilityDataToSave[key] = accessibilityData[key]
      }
    })
    setFilteredAccessibilityData(filteredAccessibilityDataToSave)
  }, [accessibilityData, selectedAuditTools, selectedComplianceLevel])

  return (
    <div>
      {selectedAuditTypes !== 'Accessibility' && (
          <Accordion
            practiceType='Ecodesign'
            data={filteredEcodesignData}
            selectedComplianceArray={selectedComplianceLevel}
            isFolded={isFolded}
            setIsFolded={setIsFolded}
            procedure={procedure}
            changeProcedureFct={changeProcedureFct}
          />
      )}
      {selectedAuditTypes !== 'Ecodesign' && (
        <Accordion
          practiceType='Accessibility'
          data={filteredAccessibilityData}
          selectedComplianceArray={selectedComplianceLevel}
          isFolded={isFolded}
          setIsFolded={setIsFolded}
        />
      )}
    </ div>
  )
}
