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
      requests: { type: Array, default: [] },
      cacheHeaderRatio: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    compressHttp: {
      requests: { type: Array, default: [] },
      compressRatio: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    domainsNumber: {
      domains: { type: Array, default: [] },
      domainsNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    dontResizeImageInBrowser: {
      imgAnalysed: { type: Array, default: [] },
      imagesResizedInBrowserNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
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
      errors: { type: Array, default: [] },
      errorNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    httpRequests: {
      requests: { type: Array, default: [] },
      nbRequest: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    imageDownloadedNotDisplayed: {
      imgAnalysed: { type: Array, default: [] },
      imageDownloadedNotDisplayedNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    jsValidate: {
      contents: { type: Array, default: [] },
      errors: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    maxCookiesLength: {
      domains: { type: Array, default: [] },
      maxCookiesLength: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    minifiedCss: {
      totalCssSize: { type: Number },
      minifiedCssSize: { type: Number },
      percentMinifiedCss: { type: Number },
      contents: { type: Array, default: [] },
      score: { type: Number, default: 0 }

    },
    minifiedJs: {
      totalJsSize: { type: Number },
      minifiedJsSize: { type: Number },
      percentMinifiedJs: { type: Number },
      contents: { type: Array, default: [] },
      score: { type: Number, default: 0 }
    },
    noCookieForStaticRessources: {
      cookies: { type: Array, default: [] },
      nbRessourcesStaticWithCookie: { type: Number, default: 0 },
      totalCookiesSize: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    noRedirect: {
      redirections: { type: Array, default: [] },
      redirectNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    optimizeBitmapImages: {
      img: { type: Array, default: [] },
      nbImagesToOptimize: { type: Number, default: 0 },
      totalMinGains: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    optimizeSvg: {
      img: { type: Array, default: [] },
      totalSizeToOptimize: { type: Number, default: 0 },
      totalResourcesToOptimize: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
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
      socialNetworks: { type: Array, default: [] },
      nbSocialNetworkButton: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    styleSheets: {
      styleSheets: { type: Array, default: [] },
      styleSheetsNumber: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    useETags: {
      staticResourcesSize: { type: Number },
      staticResourcesWithETagsSize: { type: Number },
      eTags: { type: Array, default: [] },
      eTagsRatio: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    useStandardTypefaces: {
      fonts: { type: Array, default: [] },
      totalFontsSize: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    }

  },

  lighthousePerformanceBestPractices: {
    viewport: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    serverResponseTime: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    criticalRequestChains: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    mainthreadWorkBreakdown: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    bootupTime: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesRelPreload: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    fontDisplay: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    networkRtt: {
      score: { type: Number, default: 0 },
      scoreDisplayMode: { type: String, default: '' },
      auditedMetric: { type: Number, default: 0 },
      description: { type: Array, default: [] }
    },
    networkServerLatency: {
      score: { type: Number, default: 0 },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    thirdPartySummary: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    thirdPartyFacades: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    lcpLazyLoaded: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    longTasks: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    nonCompositedAnimations: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    preloadLcpImage: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    domSize: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesLongCacheTtl: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesResponsiveImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    offscreenImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    unminifiedCss: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    unminifiedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    unusedCssRules: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    unusedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesOptimizedImages: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    modernImageFormats: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesTextCompression: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesHttp2: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    efficientAnimatedContent: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    duplicatedJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    legacyJavascript: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    totalByteWeight: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    noDocumentWrite: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    redirects: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    layoutShiftElements: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    usesPassiveEventListeners: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    }
  },

  lighthouseAccessibilityBestPractices: {
    ariaAllowedAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }

    },
    ariaCommandName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }

    },
    ariaHiddenBody: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }

    },
    ariaHiddenFocus: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaRequiredAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaRoles: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaValidAttrValue: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaValidAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    bypass: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    colorContrast: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    documentTitle: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    duplicateIdActive: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    duplicateIdAria: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    headingOrder: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    htmlHasLang: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    htmlLangValid: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    imageAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    label: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    linkName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    list: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    listItem: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    tabIndex: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    tdHeadersAttr: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    validLang: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaInputFieldName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaMeterName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaProgressbarName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaRequiredChildren: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaRequiredParent: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaToggleFieldName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaTooltipName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    ariaTreeitemName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    buttonName: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    definitionList: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    dlItem: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    formFieldMultipleLabels: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    frameTitle: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    inputImageAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    metaRefresh: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    metaViewport: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    objectAlt: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    thHasDataCells: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    videoCaption: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    },
    accessKeys: {
      score: { type: Number },
      scoreDisplayMode: { type: String, default: '' },
      description: { type: Array, default: [] },
      auditedMetric: { type: Number, default: 0 }
    }

  }
})

const bestPractices = mongoose.model('bestpractices', bestPracticesSchema)
module.exports = bestPractices
