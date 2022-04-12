/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'SocialNetworkButton',
  nbSocialNetworkButton: 0,
  socialNetworks: '',

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
  }
}, 'harReceived')
