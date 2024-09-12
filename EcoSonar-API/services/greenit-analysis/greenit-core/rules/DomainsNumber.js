/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'DomainsNumber',
  domains: '',
  domainsNumber: 0,
  score: 100,

  check: function (measures) {
    const domainsToAdd = []
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        const domain = getDomainFromUrl(entry.request.url)
        if (domainsToAdd.indexOf(domain) === -1) {
          domainsToAdd.push(domain)
          this.domains += domain + '|'
          this.domainsNumber++
        }
      })
    }

    if (this.domainsNumber <= 2) {
      this.score = 100
    } else if (this.domainsNumber <= 3) {
      this.score = 75
    } else if (this.domainsNumber <= 4) {
      this.score = 65
    } else if (this.domainsNumber <= 5.5) {
      this.score = 50
    } else if (this.domainsNumber <= 6) {
      this.score = 35
    } else if (this.domainsNumber <= 7) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'harReceived')
