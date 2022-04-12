const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bestPracticesSchema = new Schema({
  idAnalysisBestPractices: {
    type: String,
    required: true,
    unique: true
  },
  idUrl: {
    type: String,
    required: true,
    unique: true
  },
  dateAnalysisBestPractices: {
    type: Date,
    required: true
  },
  bestPractices: {
    AddExpiresOrCacheControlHeaders: {
      requests: { type: Array, default: [] },
      cacheHeaderRatio: { type: Number }
    },
    CompressHttp: {
      requests: { type: Array, default: [] },
      compressRatio: { type: Number }
    },
    DomainsNumber: {
      domains: { type: Array, default: [] },
      domainsNumber: { type: Number }
    },
    DontResizeImageInBrowser: {
      imgAnalysed: { type: Array, default: [] },
      imagesResizedInBrowserNumber: { type: Number }
    },
    EmptySrcTag: {
      emptySrcTagNumber: { type: Number }
    },
    ExternalizeCss: {
      inlineStyleSheetsNumber: { type: Number }
    },
    ExternalizeJs: {
      inlineJsScriptsNumber: { type: Number }
    },
    HttpError: {
      errors: { type: Array, default: [] },
      errorNumber: { type: Number }
    },
    HttpRequests: {
      requests: { type: Array, default: [] },
      nbRequest: { type: Number }
    },
    ImageDownloadedNotDisplayed: {
      imgAnalysed: { type: Array, default: [] },
      imageDownloadedNotDisplayedNumber: { type: Number }
    },
    JsValidate: {
      contents: { type: Array, default: [] },
      errors: { type: Number }
    },
    MaxCookiesLength: {
      domains: { type: Array, default: [] },
      maxCookiesLength: { type: Number }
    },
    MinifiedCss: {
      totalCssSize: { type: Number },
      minifiedCssSize: { type: Number },
      percentMinifiedCss: { type: Number },
      contents: { type: Array, default: [] }

    },
    MinifiedJs: {
      totalJsSize: { type: Number },
      minifiedJsSize: { type: Number },
      percentMinifiedJs: { type: Number },
      contents: { type: Array, default: [] }
    },
    NoCookieForStaticRessources: {
      cookies: { type: Array, default: [] },
      nbRessourcesStaticWithCookie: { type: Number },
      totalCookiesSize: { type: Number }
    },
    NoRedirect: {
      redirections: { type: Array, default: [] },
      redirectNumber: { type: Number }
    },
    OptimizeBitmapImages: {
      img: { type: Array, default: [] },
      nbImagesToOptimize: { type: Number },
      totalMinGains: { type: Number }
    },
    OptimizeSvg: {
      img: { type: Array, default: [] },
      totalSizeToOptimize: { type: Number },
      totalResourcesToOptimize: { type: Number }
    },
    Plugins: {
      pluginsNumber: { type: Number }
    },
    PrintStyleSheet: {
      printStyleSheetsNumber: { type: Number }
    },
    SocialNetworkButton: {
      socialNetworks: { type: Array, default: [] },
      nbSocialNetworkButton: { type: Number }
    },
    StyleSheets: {
      styleSheets: { type: Array, default: [] },
      styleSheetsNumber: { type: Number }
    },
    UseETags: {
      staticResourcesSize: { type: Number },
      staticResourcesWithETagsSize: { type: Number },
      eTags: { type: Array, default: [] },
      eTagsRatio: { type: Number }
    },
    UseStandardTypefaces: {
      fonts: { type: Array, default: [] },
      totalFontsSize: { type: Number }
    }
  }
})

const bestPractices = mongoose.model('bestpractices', bestPracticesSchema)
module.exports = bestPractices
