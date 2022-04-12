import { GreenITAnalysis } from './GreenITAnalysis'
import { PractisesAnalysis } from './PracticesAnalysis'

export class Analysis {
  constructor (url) {
    this.url = url
    this.greenITAnalysis = new GreenITAnalysis()
    this.devPractices = new PractisesAnalysis()
  }

  setAnalysisFromJsonFile (data) {
    this.greenITAnalysis.setGreenITAnalysis(
      data.grade,
      data.ecoIndex,
      data.waterConsumption,
      data.greenhouseGasesEmission,
      data.domSize,
      data.nbRequest,
      Math.round(data.responsesSize / 1000),
      data.pluginsNumber,
      data.printStyleSheetsNumber,
      data.inlineStyleSheetsNumber,
      data.inlineJsScriptsNumber,
      data.emptySrcTagNumber,
      data.imagesResizedInBrowser.length
    )
    this.devPractices.setPracticesAnalysis(
      data.bestPractices.AddExpiresOrCacheControlHeaders.complianceLevel || 'A',
      data.bestPractices.CompressHttp.complianceLevel || 'A',
      data.bestPractices.DomainsNumber.complianceLevel || 'A',
      data.bestPractices.DontResizeImageInBrowser.complianceLevel || 'A',
      data.bestPractices.EmptySrcTag.complianceLevel || 'A',
      data.bestPractices.ExternalizeCss.complianceLevel || 'A',
      data.bestPractices.ExternalizeJs.complianceLevel || 'A',
      data.bestPractices.HttpError.complianceLevel || 'A',
      data.bestPractices.HttpRequests.complianceLevel || 'A',
      data.bestPractices.ImageDownloadedNotDisplayed.complianceLevel || 'A',
      data.bestPractices.JsValidate.complianceLevel || 'A',
      data.bestPractices.MaxCookiesLength.complianceLevel || 'A',
      data.bestPractices.MinifiedCss.complianceLevel || 'A',
      data.bestPractices.MinifiedJs.complianceLevel || 'A',
      data.bestPractices.NoCookieForStaticRessources.complianceLevel || 'A',
      data.bestPractices.NoRedirect.complianceLevel || 'A',
      data.bestPractices.OptimizeBitmapImages.complianceLevel || 'A',
      data.bestPractices.OptimizeSvg.complianceLevel || 'A',
      data.bestPractices.Plugins.complianceLevel || 'A',
      data.bestPractices.PrintStyleSheet.complianceLevel || 'A',
      data.bestPractices.SocialNetworkButton.complianceLevel || 'A',
      data.bestPractices.StyleSheets.complianceLevel || 'A',
      data.bestPractices.UseETags.complianceLevel || 'A',
      data.bestPractices.UseStandardTypefaces.complianceLevel || 'A'
    )
  }
}
