/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'DomainsNumber',
  domains: '',
  domainsNumber: 0,

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
  }
}, 'harReceived')
