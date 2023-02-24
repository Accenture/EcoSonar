function formatW3cBestPractices (props) {
  const w3cBestPractices = props
  const formattedW3cBestPractices = {}

  for (const bestPractice of Object.entries(w3cBestPractices)) {
    formattedW3cBestPractices[bestPractice[0]] = {
      title: bestPractice[0],
      description: bestPractice[0],
      correction: '<div class=\'correction-text\'>' + replaceTextByLink(bestPractice[0]) + `<br><br><ul><li><a target="_blank" href="https://validator.w3.org/"> Learn more about W3C Validator</a></li><li><a target="_blank" href="https://google.com/search?q=${bestPractice[0]}">Search for this issue on the web</a></li></ul></div>`,
      titleData: ''
    }
  }

  return formattedW3cBestPractices
}

function replaceTextByLink (practiceDescription) {
  if (practiceDescription.includes('<!DOCTYPE')) {
    practiceDescription = practiceDescription.replace('<!DOCTYPE', '&lt;!DOCTYPE')
  }
  if (practiceDescription.includes('html')) {
    practiceDescription = practiceDescription.replace('<html>', '&lt;!html')
  }
  if (practiceDescription.includes('“&amp;”')) {
    practiceDescription = practiceDescription.replace('&amp;', '"&am&#112;;')
  }
  if (practiceDescription.includes('Deprecated Media Features')) {
    practiceDescription = practiceDescription.replace('Deprecated Media Features section in the current Media Queries specification.', "<a target='_blank' href='https://drafts.csswg.org/mediaqueries/#mf-deprecated'>Deprecated Media Features section in the current Media Queries specification.</a>")
  }
  if (practiceDescription.includes('interacts badly with unquoted attribute values') && practiceDescription.includes('Trailing slash on void elements has no effect')) {
    practiceDescription = practiceDescription.replace('interacts badly with unquoted attribute values', "<a target='_blank' href='https://github.com/validator/validator/wiki/Markup-%C2%BB-Void-elements#trailing-slashes-directly-preceded-by-unquoted-attribute-values'>interacts badly with unquoted attribute values</a>")
    practiceDescription = practiceDescription.replace('Trailing slash on void elements has no effect', "<a target='_blank' href='https://github.com/validator/validator/wiki/Markup-%C2%BB-Void-elements#trailing-slashes-in-void-element-start-tags-do-not-mark-the-start-tags-as-self-closing'>Trailing slash on void elements has no effect</a>")
  }
  if (practiceDescription.includes('Use CSS instead')) {
    practiceDescription = practiceDescription.replace('Use CSS instead', "<a target='_blank' href='https://wiki.whatwg.org/wiki/Presentational_elements_and_attributes'>Use CSS instead</a>")
  }
  if (practiceDescription.includes('Attribute soft not allowed on element br at this point')) {
    practiceDescription = practiceDescription.replace('Attribute soft not allowed on element br at this point', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/#the-br-element'>Attribute soft not allowed on element br at this point</a>")
  }
  if (practiceDescription.includes('guidance on providing text alternatives for images')) {
    practiceDescription = practiceDescription.replace('guidance on providing text alternatives for images', "<a target='_blank' href='https://www.w3.org/WAI/tutorials/images/'>guidance on providing text alternatives for images</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “style”')) {
    practiceDescription = practiceDescription.replace('style', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/semantics.html#the-style-element'>style</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “div”')) {
    practiceDescription = practiceDescription.replace('div', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element'>div</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “body”')) {
    practiceDescription = practiceDescription.replace('body', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/sections.html#the-body-element'>body</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “span”')) {
    practiceDescription = practiceDescription.replace('span', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element'>span</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “link”')) {
    practiceDescription = practiceDescription.replace('link', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/semantics.html#the-link-element'>link</a>")
  }
  if (practiceDescription.toLowerCase().includes('element “b”')) {
    practiceDescription = practiceDescription.replace('element “b”', "<a target='_blank' href='https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-b-element'>element “b”</a>")
  }
  if (practiceDescription.includes('h1') || practiceDescription.includes('h2') || practiceDescription.includes('h3') || practiceDescription.includes('h4') || practiceDescription.includes('h5') || practiceDescription.includes('h6')) {
    const r = /\d+/
    const hTagPlusDigit = 'h' + practiceDescription.match(r)[0]
    practiceDescription = practiceDescription.replace(`${hTagPlusDigit}`, `<a target='_blank' href='https://html.spec.whatwg.org/multipage/sections.html#the-h1%2C-h2%2C-h3%2C-h4%2C-h5%2C-and-h6-elements'>${hTagPlusDigit}</a>`)
  }

  return practiceDescription
}

export default formatW3cBestPractices
