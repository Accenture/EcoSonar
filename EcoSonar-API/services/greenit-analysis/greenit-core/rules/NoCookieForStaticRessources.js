/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'NoCookieForStaticRessources',
  totalCookiesSize: 0,
  nbRessourcesStaticWithCookie: 0,
  cookies: '',

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry)
        if (isStaticRessource(entry) && (cookiesLength > 0)) {
          this.nbRessourcesStaticWithCookie++
          this.totalCookiesSize += cookiesLength + 7 // 7 is size for the header name "cookie:"
          this.cookies += entry.request.url + '|'
        }
      })
    }
  }
}, 'harReceived')
