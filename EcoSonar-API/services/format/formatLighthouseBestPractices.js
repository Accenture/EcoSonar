class FormatLighthouseBestPractices {}

FormatLighthouseBestPractices.prototype.formatAccess = function (reports) {
  return {
    accesskeys: { score: reports.audits.accesskeys.score },
    ariaAllowedAttr: { score: reports.audits['aria-allowed-attr'].score },
    ariaCommandName: { score: reports.audits['aria-command-name'].score },
    ariaHiddenBody: { score: reports.audits['aria-hidden-body'].score },
    ariaHiddenFocus: { score: reports.audits['aria-hidden-focus'].score },
    ariaRequiredAttr: { score: reports.audits['aria-required-attr'].score },
    ariaRoles: { score: reports.audits['aria-roles'].score },
    ariaValidAttrValue: { score: reports.audits['aria-valid-attr-value'].score },
    ariaValidAttr: { score: reports.audits['aria-valid-attr'].score },
    bypass: { score: reports.audits.bypass.score },
    colorContrast: { score: reports.audits['color-contrast'].score },
    documentTitle: { score: reports.audits['document-title'].score },
    duplicateIdActive: { score: reports.audits['duplicate-id-active'].score },
    duplicateIdAria: { score: reports.audits['duplicate-id-aria'].score },
    headingOrder: { score: reports.audits['heading-order'].score },
    htmlHasLang: { score: reports.audits['html-has-lang'].score },
    htmlLangValid: { score: reports.audits['html-lang-valid'].score },
    imageAlt: { score: reports.audits['image-alt'].score },
    label: { score: reports.audits.label.score },
    linkName: { score: reports.audits['link-name'].score },
    list: { score: reports.audits.list.score },
    listitem: { score: reports.audits.listitem.score },
    tabindex: { score: reports.audits.tabindex.score },
    tdHeadersAttr: { score: reports.audits['td-headers-attr'].score },
    validLang: { score: reports.audits['valid-lang'].score },
    ariaInputFieldName: { score: reports.audits['aria-input-field-name'].score },
    ariaMeterName: { score: reports.audits['aria-meter-name'].score },
    ariaProgressbarName: { score: reports.audits['aria-progressbar-name'].score },
    ariaRequiredChildren: { score: reports.audits['aria-required-children'].score },
    ariaRequiredParent: { score: reports.audits['aria-required-parent'].score },
    ariaToggleFieldName: { score: reports.audits['aria-toggle-field-name'].score },
    ariaTooltipName: { score: reports.audits['aria-tooltip-name'].score },
    ariaTreeitemName: { score: reports.audits['aria-treeitem-name'].score },
    buttonName: { score: reports.audits['button-name'].score },
    definitionList: { score: reports.audits['definition-list'].score },
    dlitem: { score: reports.audits.dlitem.score },
    formFieldMultipleLabels: { score: reports.audits['form-field-multiple-labels'].score },
    frameTitle: { score: reports.audits['frame-title'].score },
    inputImageAlt: { score: reports.audits['input-image-alt'].score },
    metaRefresh: { score: reports.audits['meta-refresh'].score },
    metaViewport: { score: reports.audits['meta-viewport'].score },
    objectAlt: { score: reports.audits['object-alt'].score },
    thHasDataCells: { score: reports.audits['th-has-data-cells'].score },
    videoCaption: {
      score: reports.audits['video-caption'].score
    }
  }
}

FormatLighthouseBestPractices.prototype.formatPerf = function (reports) {
  return {
    networkRtt: { score: reports.audits['network-rtt'].score },
    bootupTime: {
      score: reports.audits['bootup-time'].score,
      displayValue: reports.audits['bootup-time'].displayValue
    },
    domSize: {
      score: reports.audits['dom-size'].score,
      displayValue: reports.audits['dom-size'].displayValue
    },
    usesLongCacheTtl: {
      score: reports.audits['uses-long-cache-ttl'].score,
      displayValue: reports.audits['uses-long-cache-ttl'].displayValue
    },
    unminifiedCss: {
      score: reports.audits['unminified-css'].score,
      displayValue: reports.audits['unminified-css'].displayValue
    },
    unminifiedJavascript: {
      score: reports.audits['unminified-javascript'].score,
      displayValue: reports.audits['unminified-javascript'].displayValue
    },
    unusedCssRules: {
      score: reports.audits['unused-css-rules'].score,
      displayValue: reports.audits['unused-css-rules'].displayValue
    },
    unusedJavascript: {
      score: reports.audits['unused-javascript'].score,
      displayValue: reports.audits['unused-javascript'].displayValue
    },
    usesOptimizedImages: {
      score: reports.audits['uses-optimized-images'].score,
      displayValue: reports.audits['uses-optimized-images'].displayValue
    },
    modernImageFormats: {
      score: reports.audits['modern-image-formats'].score,
      displayValue: reports.audits['modern-image-formats'].displayValue
    },
    usesTextCompression: {
      score: reports.audits['uses-text-compression'].score,
      displayValue: reports.audits['uses-text-compression'].displayValue
    },
    efficientAnimatedContent: {
      score: reports.audits['efficient-animated-content'].score,
      displayValue: reports.audits['efficient-animated-content'].displayValue
    },
    duplicatedJavascript: {
      score: reports.audits['duplicated-javascript'].score,
      displayValue: reports.audits['duplicated-javascript'].displayValue
    },
    totalByteWeight: {
      score: reports.audits['total-byte-weight'].score,
      displayValue: reports.audits['total-byte-weight'].displayValue
    },
    serverResponseTime: {
      score: reports.audits['server-response-time'].score,
      displayValue: reports.audits['server-response-time'].displayValue
    },
    userTimings: {
      score: reports.audits['user-timings'].score,
      displayValue: reports.audits['user-timings'].displayValue
    },
    criticalRequestChains: {
      score: reports.audits['critical-request-chains'].score,
      displayValue: reports.audits['critical-request-chains'].displayValue
    },
    mainthreadWorkBreakdown: {
      score: reports.audits['mainthread-work-breakdown'].score,
      displayValue: reports.audits['mainthread-work-breakdown'].displayValue
    },
    usesRelPreload: {
      score: reports.audits['uses-rel-preload'].score,
      displayValue: reports.audits['uses-rel-preload'].displayValue
    },
    fontDisplay: {
      score: reports.audits['font-display'].score,
      displayValue: reports.audits['font-display'].displayValue
    },
    viewport: {
      score: reports.audits.viewport.score,
      displayValue: reports.audits.viewport.displayValue
    },
    thirdPartySummary: {
      score: reports.audits['third-party-summary'].score,
      displayValue: reports.audits['third-party-summary'].displayValue
    },
    thirdPartyFacades: {
      score: reports.audits['third-party-facades'].score,
      displayValue: reports.audits['third-party-facades'].displayValue
    },
    lcpLazyLoaded: {
      score: reports.audits['lcp-lazy-loaded'].score,
      displayValue: reports.audits['lcp-lazy-loaded'].displayValue
    },
    longTasks: {
      score: reports.audits['long-tasks'].score,
      displayValue: reports.audits['long-tasks'].displayValue
    },
    nonCompositedAnimations: {
      score: reports.audits['non-composited-animations'].score,
      displayValue: reports.audits['non-composited-animations'].displayValue
    },
    preloadLcpImage: {
      score: reports.audits['preload-lcp-image'].score,
      displayValue: reports.audits['preload-lcp-image'].displayValue
    },
    usesResponsiveImages: {
      score: reports.audits['uses-responsive-images'].score,
      displayValue: reports.audits['uses-responsive-images'].displayValue
    },
    offscreenImages: {
      score: reports.audits['offscreen-images'].score,
      displayValue: reports.audits['offscreen-images'].displayValue
    },
    usesHttp2: {
      score: reports.audits['uses-http2'].score,
      displayValue: reports.audits['uses-http2'].displayValue
    },
    legacyJavascript: {
      score: reports.audits['legacy-javascript'].score,
      displayValue: reports.audits['legacy-javascript'].displayValue
    },
    metrics: {
      score: reports.audits.metrics.score,
      displayValue: reports.audits.metrics.displayValue
    },
    maxPotentialFid: {
      score: reports.audits['max-potential-fid'].score,
      displayValue: reports.audits['max-potential-fid'].displayValue
    },
    networkServerLatency: {
      score: reports.audits['network-server-latency'].score,
      displayValue: reports.audits['network-server-latency'].displayValue
    },
    noDocumentWrite: {
      score: reports.audits['no-document-write'].score,
      displayValue: reports.audits['no-document-write'].displayValue
    }
  }
}

const formatLighthouseBestPractices = new FormatLighthouseBestPractices()
module.exports = formatLighthouseBestPractices
