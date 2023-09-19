const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bestPracticesSchema = new Schema({
  idAnalysisBestPractices: {
    type: String,
    default: '',
    required: true,
    unique: true
  },
  idUrl: {
    type: String,
    default: '',
    required: true,
    unique: false
  },
  dateAnalysisBestPractices: {
    type: Date,
    required: true
  },
  bestPractices: {
    addExpiresOrCacheControlHeaders: {
      requests: { type: Array },
      cacheHeaderRatio: { type: Number },
      score: { type: Number }
    },
    compressHttp: {
      requests: { type: Array },
      compressRatio: { type: Number },
      score: { type: Number }
    },
    domainsNumber: {
      domains: { type: Array },
      domainsNumber: { type: Number },
      score: { type: Number }
    },
    dontResizeImageInBrowser: {
      imgAnalysed: { type: Array },
      imagesResizedInBrowserNumber: { type: Number },
      score: { type: Number }
    },
    emptySrcTag: {
      emptySrcTagNumber: { type: Number },
      score: { type: Number }
    },
    externalizeCss: {
      inlineStyleSheetsNumber: { type: Number },
      score: { type: Number }
    },
    externalizeJs: {
      inlineJsScriptsNumber: { type: Number },
      score: { type: Number }
    },
    httpError: {
      errors: { type: Array },
      errorNumber: { type: Number },
      score: { type: Number }
    },
    httpRequests: {
      requests: { type: Array },
      nbRequest: { type: Number },
      score: { type: Number }
    },
    imageDownloadedNotDisplayed: {
      imgAnalysed: { type: Array },
      imageDownloadedNotDisplayedNumber: { type: Number },
      score: { type: Number }
    },
    jsValidate: {
      contents: { type: Array },
      errors: { type: Number },
      score: { type: Number }
    },
    maxCookiesLength: {
      domains: { type: Array },
      maxCookiesLength: { type: Number },
      score: { type: Number }
    },
    minifiedCss: {
      totalCssSize: { type: Number },
      minifiedCssSize: { type: Number },
      percentMinifiedCss: { type: Number },
      contents: { type: Array },
      score: { type: Number }

    },
    minifiedJs: {
      totalJsSize: { type: Number },
      minifiedJsSize: { type: Number },
      percentMinifiedJs: { type: Number },
      contents: { type: Array },
      score: { type: Number }
    },
    noCookieForStaticRessources: {
      cookies: { type: Array },
      nbRessourcesStaticWithCookie: { type: Number },
      totalCookiesSize: { type: Number },
      score: { type: Number }
    },
    noRedirect: {
      redirections: { type: Array },
      redirectNumber: { type: Number },
      score: { type: Number }
    },
    optimizeBitmapImages: {
      img: { type: Array },
      nbImagesToOptimize: { type: Number },
      totalMinGains: { type: Number },
      score: { type: Number }
    },
    optimizeSvg: {
      img: { type: Array },
      totalSizeToOptimize: { type: Number },
      totalResourcesToOptimize: { type: Number },
      score: { type: Number }
    },
    plugins: {
      pluginsNumber: { type: Number },
      score: { type: Number }
    },
    printStyleSheet: {
      printStyleSheetsNumber: { type: Number },
      score: { type: Number }
    },
    socialNetworkButton: {
      socialNetworks: { type: Array },
      nbSocialNetworkButton: { type: Number },
      score: { type: Number }
    },
    styleSheets: {
      styleSheets: { type: Array },
      styleSheetsNumber: { type: Number },
      score: { type: Number }
    },
    useETags: {
      staticResourcesSize: { type: Number },
      staticResourcesWithETagsSize: { type: Number },
      eTags: { type: Array },
      eTagsRatio: { type: Number },
      score: { type: Number }
    },
    useStandardTypefaces: {
      fonts: { type: Array },
      totalFontsSize: { type: Number },
      score: { type: Number }
    }

  },

  lighthousePerformanceBestPractices: {
    viewport: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    serverResponseTime: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    mainthreadWorkBreakdown: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    bootupTime: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesRelPreload: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    fontDisplay: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    networkRtt: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      auditedMetric: { type: Number },
      description: { type: Array }
    },
    networkServerLatency: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    thirdPartySummary: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    thirdPartyFacades: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    lcpLazyLoaded: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    longTasks: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    nonCompositedAnimations: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    preloadLcpImage: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    domSize: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesLongCacheTtl: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesResponsiveImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    offscreenImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    unminifiedCss: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    unminifiedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    unusedCssRules: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    unusedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesOptimizedImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    modernImageFormats: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesTextCompression: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesHttp2: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    efficientAnimatedContent: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    duplicatedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    legacyJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    totalByteWeight: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    noDocumentWrite: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    redirects: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    layoutShiftElements: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    usesPassiveEventListeners: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    }
  },

  lighthouseAccessibilityBestPractices: {
    ariaAllowedAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }

    },
    ariaCommandName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }

    },
    ariaHiddenBody: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }

    },
    ariaHiddenFocus: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaRequiredAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaRoles: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaValidAttrValue: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaValidAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    bypass: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    colorContrast: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    documentTitle: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    duplicateIdActive: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    duplicateIdAria: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    headingOrder: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    htmlHasLang: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    htmlLangValid: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    imageAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    label: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    linkName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    list: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    listItem: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    tabIndex: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    tdHeadersAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    validLang: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaInputFieldName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaMeterName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaProgressbarName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaRequiredChildren: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaRequiredParent: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaToggleFieldName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaTooltipName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    ariaTreeitemName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    buttonName: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    definitionList: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    dlItem: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    formFieldMultipleLabels: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    frameTitle: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    inputImageAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    metaRefresh: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    metaViewport: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    objectAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    thHasDataCells: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    videoCaption: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    },
    accessKeys: {
      score: { type: Number },
      scoreDisplayMode: { type: String },
      description: { type: Array },
      auditedMetric: { type: Number }
    }

  }
})

const bestPractices = mongoose.model('bestpractices', bestPracticesSchema)
module.exports = bestPractices
