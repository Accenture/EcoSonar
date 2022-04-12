export function setPanelColor (complianceLevel) {
  const success = complianceLevel === 'A' || complianceLevel === 'B'
  const warning = complianceLevel === 'C' || complianceLevel === 'D'
  const error = complianceLevel === 'E' || complianceLevel === 'F' || complianceLevel === 'G'

  return ({ success, warning, error })
}
