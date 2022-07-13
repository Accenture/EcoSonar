class MetricsCalculate {}
MetricsCalculate.prototype.averageForPerformanceMetrics = function () {
  return {

    serverResponseTime: 'server-response-time',
    mainthreadWorkBreakdown: 'mainthread-work-breakdown',
    bootupTime: 'bootup-time',
    thirdPartySummary: 'third-party-summary',
    domSize: 'dom-size',
    totalByteWeight: 'total-byte-weight'
  }
}
MetricsCalculate.prototype.sumForPerformanceMetrics = function () {
  return {

    thirdPartyFacades: 'third-party-facades',
    nonCompositedAnimations: 'non-composited-animations',
    usesLongCacheTtl: 'uses-long-cache-ttl',
    layoutShiftElements: 'layout-shift-elements',
    usesResponsiveImages: 'uses-responsive-images',
    offscreenImages: 'offscreen-images',
    unusedCssRules: 'unused-css-rules',
    unusedJavascript: 'unused-javascript',
    usesOptimizedImages: 'uses-optimized-images',
    modernImageFormats: 'modern-image-formats',
    usesTextCompression: 'uses-text-compression',
    usesHttp2: 'uses-http2',
    efficientAnimatedContent: 'efficient-animated-content',
    legacyJavascript: 'legacy-javascript',
    unminifiedJavascript: 'unminified-javascript',
    duplicatedJavascript: 'duplicated-javascript'
  }
}

MetricsCalculate.prototype.isPresentForPerformanceMetrics = function () {
  return {
    fontDisplay: 'font-display',
    lcpLazyLoaded: 'lcp-lazy-loaded',
    noDocumentWrite: 'no-document-write',
    viewport: 'viewport',
    usesPassiveEventListeners: 'uses-passive-event-listeners'
  }
}

MetricsCalculate.prototype.sumForAccessiblityMetrics = function () {
  return {
    accessKeys: 'accesskeys',
    ariaAllowedAttr: 'aria-allowed-attr',
    ariaCommandName: 'aria-command-name',
    ariaHiddenBody: 'aria-hidden-body',
    ariaHiddenFocus: 'aria-hidden-focus',
    ariaInputFieldName: 'aria-input-field-name',
    ariaMeterName: 'aria-meter-name',
    ariaProgressbarName: 'aria-progressbar-name',
    ariaRequiredAttr: 'aria-required-attr',
    ariaRequiredChildren: 'aria-required-children',
    ariaRequiredParent: 'aria-required-parent',
    ariaRoles: 'aria-roles',
    ariaValidAttrValue: 'aria-valid-attr-value',
    ariaValidAttr: 'aria-valid-attr',
    buttonName: 'button-name',
    definitionList: 'definition-list',
    dlitem: 'dlitem',
    documentTitle: 'document-title',
    duplicateIdActive: 'duplicate-id-active',
    duplicateIdAria: 'duplicate-id-aria',
    formFieldMultipleLabels: 'form-field-multiple-labels',
    frameTitle: 'frame-title',
    headingOrder: 'heading-order',
    htmlHasLang: 'html-has-lang',
    htmlLangValid: 'html-lang-valid',
    imageAlt: 'image-alt',
    inputImageAlt: 'input-image-alt',
    label: 'label',
    linkName: 'link-name',
    list: 'list',
    listitem: 'listitem',
    metaViewport: 'meta-viewport',
    objectAlt: 'object-alt',
    tabindex: 'tabindex',
    tdHeadersAttr: 'td-headers-attr',
    thHasDataCells: 'th-has-data-cells',
    validLang: 'valid-lang',
    videoCaption: 'video-caption'
  }
}

MetricsCalculate.prototype.isPresentForAccessibilityMetrics = function () {
  return {
    ariaToggleFieldName: 'aria-toggle-field-name',
    ariaTooltipName: 'aria-tooltip-name',
    ariaTreeitemName: 'aria-treeitem-name',
    bypass: 'bypass',
    colorContrast: 'color-contrast',
    metaRefresh: 'meta-refresh'
  }
}

const metricsCalculate = new MetricsCalculate()
module.exports = metricsCalculate
