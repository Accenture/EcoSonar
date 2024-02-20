class EnumAudits {}
EnumAudits.prototype.lighthouseMetrics = function () {
  return {
    performance: 'performance',
    accessibility: 'accessibility',
    firstContentfulPaint: 'first-contentful-paint',
    largestContentfulPaint: 'largest-contentful-paint',
    speedIndex: 'speed-index',
    totalBlockingTime: 'total-blocking-time',
    interactive: 'interactive',
    cumulativeLayoutShift: 'cumulative-layout-shift'
  }
}

EnumAudits.prototype.procedures = function () {
  return {
    scoreImpact: 'scoreImpact',
    quickWins: 'quickWins',
    highestImpact: 'highestImpact'
  }
}

EnumAudits.prototype.performanceNamesToSave = function () {
  return {

    viewport: 'viewport',
    serverResponseTime: 'server-response-time',
    mainthreadWorkBreakdown: 'mainthread-work-breakdown',
    bootupTime: 'bootup-time',
    usesRelPreload: 'uses-rel-preload',
    fontDisplay: 'font-display',
    networkRtt: 'network-rtt',
    networkServerLatency: 'network-server-latency',
    thirdPartySummary: 'third-party-summary',
    thirdPartyFacades: 'third-party-facades',
    lcpLazyLoaded: 'lcp-lazy-loaded',
    longTasks: 'long-tasks',
    nonCompositedAnimations: 'non-composited-animations',
    preloadLcpImage: 'preload-lcp-image',
    domSize: 'dom-size',
    usesLongCacheTtl: 'uses-long-cache-ttl',
    usesResponsiveImages: 'uses-responsive-images',
    offscreenImages: 'offscreen-images',
    unminifiedCss: 'unminified-css',
    unminifiedJavascript: 'unminified-javascript',
    unusedCssRules: 'unused-css-rules',
    unusedJavascript: 'unused-javascript',
    usesOptimizedImages: 'uses-optimized-images',
    modernImageFormats: 'modern-image-formats',
    usesTextCompression: 'uses-text-compression',
    usesHttp2: 'uses-http2',
    efficientAnimatedContent: 'efficient-animated-content',
    duplicatedJavascript: 'duplicated-javascript',
    legacyJavascript: 'legacy-javascript',
    totalByteWeight: 'total-byte-weight',
    noDocumentWrite: 'no-document-write',
    redirects: 'redirects',
    layoutShiftElements: 'layout-shift-elements',
    usesPassiveEventListeners: 'uses-passive-event-listeners'
  }
}

EnumAudits.prototype.performanceNamesToReturn = function () {
  return {

    viewport: 'viewport',
    serverResponseTime: 'server-response-time',
    mainthreadWorkBreakdown: 'mainthread-work-breakdown',
    bootupTime: 'bootup-time',
    fontDisplay: 'font-display',
    thirdPartySummary: 'third-party-summary',
    thirdPartyFacades: 'third-party-facades',
    lcpLazyLoaded: 'lcp-lazy-loaded',
    nonCompositedAnimations: 'non-composited-animations',
    domSize: 'dom-size',
    usesLongCacheTtl: 'uses-long-cache-ttl',
    usesResponsiveImages: 'uses-responsive-images',
    offscreenImages: 'offscreen-images',
    unminifiedJavascript: 'unminified-javascript',
    unusedCssRules: 'unused-css-rules',
    unusedJavascript: 'unused-javascript',
    usesOptimizedImages: 'uses-optimized-images',
    modernImageFormats: 'modern-image-formats',
    usesTextCompression: 'uses-text-compression',
    usesHttp2: 'uses-http2',
    efficientAnimatedContent: 'efficient-animated-content',
    duplicatedJavascript: 'duplicated-javascript',
    legacyJavascript: 'legacy-javascript',
    totalByteWeight: 'total-byte-weight',
    noDocumentWrite: 'no-document-write',
    layoutShiftElements: 'layout-shift-elements',
    usesPassiveEventListeners: 'uses-passive-event-listeners'
  }
}

EnumAudits.prototype.accessibilityNames = function () {
  return {
    ariaAllowedAttr: 'aria-allowed-attr',
    ariaCommandName: 'aria-command-name',
    ariaHiddenBody: 'aria-hidden-body',
    ariaHiddenFocus: 'aria-hidden-focus',
    ariaRequiredAttr: 'aria-required-attr',
    ariaRoles: 'aria-roles',
    ariaValidAttrValue: 'aria-valid-attr-value',
    ariaValidAttr: 'aria-valid-attr',
    bypass: 'bypass',
    colorContrast: 'color-contrast',
    documentTitle: 'document-title',
    duplicateIdActive: 'duplicate-id-active',
    duplicateIdAria: 'duplicate-id-aria',
    headingOrder: 'heading-order',
    htmlHasLang: 'html-has-lang',
    htmlLangValid: 'html-lang-valid',
    imageAlt: 'image-alt',
    label: 'label',
    linkName: 'link-name',
    list: 'list',
    listItem: 'listitem',
    tabIndex: 'tabindex',
    tdHeadersAttr: 'td-headers-attr',
    validLang: 'valid-lang',
    ariaInputFieldName: 'aria-input-field-name',
    ariaMeterName: 'aria-meter-name',
    ariaProgressbarName: 'aria-progressbar-name',
    ariaRequiredChildren: 'aria-required-children',
    ariaRequiredParent: 'aria-required-parent',
    ariaToggleFieldName: 'aria-toggle-field-name',
    ariaTooltipName: 'aria-tooltip-name',
    ariaTreeitemName: 'aria-treeitem-name',
    buttonName: 'button-name',
    definitionList: 'definition-list',
    dlItem: 'dlitem',
    formFieldMultipleLabels: 'form-field-multiple-labels',
    frameTitle: 'frame-title',
    inputImageAlt: 'input-image-alt',
    metaRefresh: 'meta-refresh',
    metaViewport: 'meta-viewport',
    objectAlt: 'object-alt',
    thHasDataCells: 'th-has-data-cells',
    videoCaption: 'video-caption',
    accessKeys: 'accesskeys'
  }
}

const enumAudits = new EnumAudits()
module.exports = enumAudits
