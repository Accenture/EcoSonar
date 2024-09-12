/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'SocialNetworkButton',
  nbSocialNetworkButton: 0,
  socialNetworks: '',
  score: 100,

  check: function (measures) {
    const socialNetworksToAdd = []
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        const officalSocialButton = getOfficialSocialButtonFormUrl(entry.request.url)
        if (officalSocialButton.length > 0) {
          if (socialNetworksToAdd.indexOf(officalSocialButton) === -1) {
            socialNetworksToAdd.push(officalSocialButton)
            this.socialNetworks += officalSocialButton + '|'
            this.nbSocialNetworkButton++
          }
        }
      })
    }

    if (this.nbSocialNetworkButton === 0) {
      this.score = 100
    } else if (this.nbSocialNetworkButton <= 1) {
      this.score = 35
    } else if (this.nbSocialNetworkButton <= 2) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'harReceived')
