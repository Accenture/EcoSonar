function youlazyLoad (el) {
  const iframeWrapper = el.querySelector('.iframe-wrapper')
  const videoId = el.getAttribute('data-id')
  const videoWidth = el.getAttribute('data-w')
  const videoHeight = el.getAttribute('data-h')
  let iframeWrapperWidth = iframeWrapper.offsetWidth
  const iframeWrapperMaxHeight = parseFloat(iframeWrapper.style.maxHeight)
  if (!isNaN(iframeWrapperMaxHeight)) {
    // si le conteneur de l'iframe a un max-height, la hauteur de l'iframe doit être limitée
    let iframeWrapperHeight = (iframeWrapperWidth * videoHeight) / videoWidth
    if (iframeWrapperHeight > iframeWrapperMaxHeight) {
      iframeWrapperHeight = iframeWrapperMaxHeight
      iframeWrapperWidth = (iframeWrapperHeight * videoWidth) / videoHeight
      el.style.width = iframeWrapperWidth + 'px'
    }
  }
  // technique du padding-bottom en % pour que la ratio de la vidéo soit respecté quelle que soit la largeur du conteneur ; voir https://stackoverflow.com/questions/35814653/automatic-height-when-embedding-a-youtube-video
  const paddingBottom = (100 * videoHeight) / videoWidth
  iframeWrapper.style.paddingBottom = paddingBottom + '%'
  // format de la miniature le plus approprié (inutile de charger une image très large sur un petit écran
  let format = 'default'
  if (iframeWrapperWidth > 640) {
    format = 'hqdefault'
  } else if (iframeWrapperWidth > 480) {
    format = 'mqdefault'
  } else if (iframeWrapperWidth > 320) {
    format = 'hqdefault'
  } else if (iframeWrapperWidth > 120) {
    format = 'sddefault'
  } else if (iframeWrapperWidth === 0) {
    format = 'maxresdefault'
  }
  // création de l'iframe et ajout dans le conteneur
  // crédits : https://css-tricks.com/lazy-load-embedded-youtube-videos/
  const iframe = document.createElement('iframe')
  const attrs = {
    width: '100%',
    height: '100%',
    src: '//www.youtube.com/embed/' + videoId,
    srcdoc:
              '<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}svg{position:absolute;top:50%;left:50%;margin-top:-30px;margin-left:-30px;}span:hover path:first-child{fill:#Ff0000cc}</style><a href=//www.youtube.com/embed/' +
              videoId +
              '?autoplay=1><img src=https://img.youtube.com/vi/' +
              videoId +
              '/' +
              format +
              '.jpg alt=' +
              el.getAttribute('data-title') +
              "'><span><svg xmlns='http://www.w3.org/2000/svg' width=60 height=60 viewBox='0 -64 511 511'><path d='m256 384c-64-0-128-4-191-12-28-4-51-26-55-54-13-84-13-169 0-252 4-28 27-51 55-54 127-15 255-15 382 0 28 4 51 26 55 54 13 84 13 169 0 252-4 28-27 51-55 54-63 8-127 12-191 12zm0 0' fill='#000000cc'/><path d='M192 301V83.523l174.19 109zm0 0' fill='#fff'/></svg></span></a>",
    frameborder: '0',
    allow:
              'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    allowfullscreen: '1',
    title: el.getAttribute('data-title')
  }
  for (const attr in attrs) {
    iframe.setAttribute(attr, attrs[attr])
  }
  iframeWrapper.appendChild(iframe)
  el.classList.add('loaded')
}

export default function youlazyInit () {
  let observer
  if ('IntersectionObserver' in window) {
    /* pour le Lazy loading */
    observer = new IntersectionObserver(function (entries, watcher) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const a = entry.target
          youlazyLoad(a)
          watcher.unobserve(entry.target)
        }
      })
    })
  }
  // initialise chaque lien ayant la classe youlazy
  document.querySelectorAll('.youlazy:not(.init)').forEach(function (el) {
    // récupère le code Youtube de la vidéo
    el.setAttribute('data-id', el.getAttribute('href').match(/=(.*)/)[1])
    // et son titre
    el.setAttribute('data-title', el.textContent)
    // supprime le contenu du lien
    el.innerHTML = ''
    // crée le conteneur de l'iframe qui sera lazy-loadé
    const iframeWrapper = document.createElement('div')
    iframeWrapper.classList.add('iframe-wrapper')
    el.appendChild(iframeWrapper)
    el.classList.add('init')
    if ('IntersectionObserver' in window) {
      observer.observe(el)
    } else {
      // fallback pour IE8 ; la miniature est chargée tout de suite
      youlazyLoad(el)
    }
  })
}
