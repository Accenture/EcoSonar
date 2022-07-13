/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MaxCookiesLength',
  maxCookiesLength: 0,
  domains: '',
  score: 100,

  check: function (measures) {
    const domainsToCheck = new Map()
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry)
        if (cookiesLength !== 0) {
          const domain = getDomainFromUrl(entry.request.url)
          if (domainsToCheck.has(domain)) {
            if (domainsToCheck.get(domain) < cookiesLength) domainsToCheck.set(domain, cookiesLength)
          } else domainsToCheck.set(domain, cookiesLength)
          if (cookiesLength > this.maxCookiesLength) this.maxCookiesLength = cookiesLength
        }
      })
    }

    domainsToCheck.forEach((value, key) => {
      this.domains += value + ' ' + key + '|'
    })

    if (this.maxCookiesLength <= 13) {
      this.score = 100
    } else if (this.maxCookiesLength <= 56) {
      this.score = 75
    } else if (this.maxCookiesLength <= 82.50) {
      this.score = 65
    } else if (this.maxCookiesLength <= 150) {
      this.score = 50
    } else if (this.maxCookiesLength <= 366.50) {
      this.score = 35
    } else if (this.maxCookiesLength <= 800) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'harReceived')
