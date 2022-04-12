/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MaxCookiesLength',
  maxCookiesLength: 0,
  domains: '',

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
  }
}, 'harReceived')
