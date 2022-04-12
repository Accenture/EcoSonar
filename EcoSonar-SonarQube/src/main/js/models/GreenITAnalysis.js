export class GreenITAnalysis {
  setGreenITAnalysis (
    grade,
    ecoIndexGrade,
    water,
    ghg,
    domSize,
    requests,
    pageSize,
    plugins,
    cssFiles,
    inlineCss,
    inlineJs,
    emptySrcTag,
    imagesResized
  ) {
    this.grade = grade
    this.ecoIndexGrade = ecoIndexGrade
    this.water = water
    this.ghg = ghg
    this.domSize = domSize
    this.requests = requests
    this.pageSize = pageSize
    this.plugins = plugins
    this.cssFiles = cssFiles
    this.inlineCss = inlineCss
    this.inlineJs = inlineJs
    this.emptySrcTag = emptySrcTag
    this.imagesResized = imagesResized
  }

  setGreenITAnalysisFromJsonFile (data) {
    this.grade = data.grade
    this.ecoIndexGrade = data.ecoIndex
    this.water = data.waterConsumption
    this.ghg = data.greenhouseGasesEmission
    this.domSize = data.domSize
    this.requests = data.nbRequest
    this.pageSize = Math.round(data.responsesSize / 1000)
    this.plugins = data.pluginsNumber
    this.cssFiles = data.printStyleSheetsNumber
    this.inlineCss = data.inlineStyleSheetsNumber
    this.inlineJs = data.inlineJsScriptsNumber
    this.emptySrcTag = data.emptySrcTagNumber
    this.imagesResized = data.imagesResizedInBrowser.length
  }

  setGreenITAnalysisDate (date) {
    this.date = date
  }
}
