/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'NoCookieForStaticRessources',
  totalCookiesSize: 0,
  nbRessourcesStaticWithCookie: 0,
  cookies: '',
  score: 100,

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

    if (this.totalCookiesSize <= 512) {
      this.score = 100
    } else if (this.totalCookiesSize <= 1024) {
      this.score = 75
    } else if (this.totalCookiesSize <= 2048) {
      this.score = 50
    } else if (this.totalCookiesSize <= 4096) {
      this.score = 25
    } else {
      this.score = 0
    }
  }
}, 'harReceived')
