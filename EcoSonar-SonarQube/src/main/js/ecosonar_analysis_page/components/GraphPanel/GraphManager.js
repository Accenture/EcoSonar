const handleChangeGraphs = (event, setSelectedGraph) => {
  if (event.target.value === 'request') {
    setSelectedGraph('request')
  } else if (event.target.value === 'dom') {
    setSelectedGraph('dom')
  } else if (event.target.value === 'page') {
    setSelectedGraph('page')
  } else if (event.target.value === 'performance') {
    setSelectedGraph('performance')
  } else if (event.target.value === 'accessibility') {
    setSelectedGraph('accessibility')
  } else if (event.target.value === 'cumulative') {
    setSelectedGraph('cumulative')
  } else if (event.target.value === 'firstcontentfulpaint') {
    setSelectedGraph('firstcontentfulpaint')
  } else if (event.target.value === 'largestcontentfulpaint') {
    setSelectedGraph('largestcontentfulpaint')
  } else if (event.target.value === 'interactive') {
    setSelectedGraph('interactive')
  } else if (event.target.value === 'speedindex') {
    setSelectedGraph('speedindex')
  } else if (event.target.value === 'totalblockingtime') {
    setSelectedGraph('totalblockingtime')
  } else if (event.target.value === 'w3c') {
    setSelectedGraph('w3c')
  } else {
    setSelectedGraph('ecoindex')
  }
}
export default handleChangeGraphs
