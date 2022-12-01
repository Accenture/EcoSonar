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
    setIsFolded
  } = props
  const [filteredEcodesignData, setFilteredEcodesignData] = useState(ecoDesignData)
  const [filteredAccessibilityData, setFilteredAccessibilityData] = useState(accessibilityData)

  useEffect(() => {
    // Filter Ecodesign Audit Tool
    const filteredEcodesignData = {}
    Object.keys(ecoDesignData).forEach(key => {
      if (selectedAuditTools === allTools.label || selectedAuditTools === allEcodesignTools.label || ecoDesignData[key].tool === selectedAuditTools) {
        filteredEcodesignData[key] = ecoDesignData[key]
      }
    })
    setFilteredEcodesignData(filteredEcodesignData)
  }, [ecoDesignData, selectedAuditTools, selectedComplianceLevel])

  useEffect(() => {
    // Filter Accessibility Audit tool
    const filteredAccessibilityData = {}
    Object.keys(accessibilityData).forEach(key => {
      if (selectedAuditTools === allTools.label || selectedAuditTools === allAccessibilityTools.label || accessibilityData[key].tool === selectedAuditTools) {
        filteredAccessibilityData[key] = accessibilityData[key]
      }
    })
    setFilteredAccessibilityData(filteredAccessibilityData)
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
