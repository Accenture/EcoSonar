
import React from 'react'

export default function AccessibleArray (props) {
  const {
    ecoUrl,
    reqUrl,
    domUrl,
    pageUrl,
    performanceUrl,
    accessibilityUrl,
    cumulativeLayoutShiftUrl,
    firstContentfulPaintUrl,
    largestContentfulPaintUrl,
    interactiveUrl,
    speedIndexUrl,
    totalBlockingTimeUrl,
    selectedGraph,
    w3cAnalysis
  } = props
  let accessibleArray

  function formatDate (string) {
    const formattedDate = new Date(string).toLocaleDateString()
    return formattedDate
  }

  switch (selectedGraph) {
    case 'ecoindex':
      accessibleArray = ecoUrl
      break
    case 'request':
      accessibleArray = reqUrl
      break
    case 'dom':
      accessibleArray = domUrl
      break
    case 'page':
      accessibleArray = pageUrl
      break
    case 'performance':
      accessibleArray = performanceUrl
      break
    case 'accessibility':
      accessibleArray = accessibilityUrl
      break
    case 'cumulative':
      accessibleArray = cumulativeLayoutShiftUrl
      break
    case 'firstcontentfulpaint':
      accessibleArray = firstContentfulPaintUrl
      break
    case 'largestcontentfulpaint':
      accessibleArray = largestContentfulPaintUrl
      break
    case 'interactive':
      accessibleArray = interactiveUrl
      break
    case 'speedindex':
      accessibleArray = speedIndexUrl
      break
    case 'totalblockingtime':
      accessibleArray = totalBlockingTimeUrl
      break
    case 'w3c':
      accessibleArray = w3cAnalysis
      break
    default:
      accessibleArray = []
      break
  }

  return (
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Metric</th>
          </tr>

          {accessibleArray.map((element, index) => (
            <tr key={index}>
              <td>{formatDate(element[0])}</td>
              <td>{element[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}
