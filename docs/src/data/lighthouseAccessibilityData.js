const lighthouseAccessibilityData = [
  {
    name: 'ariaAllowedAttr',
    title: '`[aria-*]` attributes match their roles',
    description: 'Lighthouse flags mismatches between ARIA roles and aria-* attributes.',
    correction: "<div class='correction-text'>Each ARIA `role` supports a specific subset of `aria-*` attributes. Mismatching these invalidates the `aria-*` attributes. An ARIA role attribute can be added to an element to instruct assistive technologies to treat the element as something other than its native HTML element type. For example, an <  a  > element with role='button' is to be treated as a button, not a link.<br><br>Some ARIA property and state attributes are allowed only for certain ARIA roles. When an assistive technology encounters a mismatch between an element's role and its state or property attributes, it might ignore attributes or respond in an unexpected way. As a result, people who use assistive technologies might find the element difficult or impossible to use.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-allowed-attr/'>[aria-*] attributes do not match their roles</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-allowed-attr/'>aria-allowed-attr</a><br></div>"
  },
  {
    name: 'ariaCommandName',
    title: '`button`, `link`, and `menuitem` elements have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies.",
    correction: "<div class='correction-text'>When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. ARIA buttons, links, and menuitems are custom controls corresponding respectively to HTML <  button  >, <  a  >, and <  menuitem  > elements. An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When an ARIA button, link, or menuitem doesn't an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br></div>"
  }, {
    name: 'ariaHiddenBody',
    title: '`[aria-hidden="true"]` is not present on the document `<body>`',
    description: "Lighthouse flags pages whose <body> element has an aria-hidden='true' attribute.",
    correction: "<div class='correction-text'>Assistive technologies, like screen readers, work inconsistently when `aria-hidden='true'` is set on the document `<  body  >`. In some browsers, the attribute aria-hidden='true' hides an element and all its children from assistive technologies. Users can still use the keyboard to navigate to any focusable child elements in the <body>, but their content is inaccessible to people who use assistive technologies. For example, screen readers are silent.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-hidden-body/'>[aria-hidden='true'] is present on the document < body ></a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-hidden-body/'>aria-hidden-body</a><br></div>"
  }, {
    name: 'ariaHiddenFocus',
    title: '`[aria-hidden="true"]` elements do not contain focusable descendents',
    description: "Lighthouse flags focusable elements that have parents with the aria-hidden='true' attribute.",
    correction: "<div class='correction-text'>Focusable descendents within an `[aria-hidden='true']` element prevent those interactive elements from being available to users of assistive technologies like screen readers.  In some browsers, the attribute aria-hidden='true' hides an element and all its children from assistive technologies. Users can still use the keyboard to navigate to any focusable child elements, but their content is inaccessible to people who use assistive technologies. For example, screen readers are silent. (An element is focusable if it can receive input focus via scripting, mouse interaction, or keyboard tabbing.)<br><br> See :<br><a target='_blank' href='https://web.dev/aria-hidden-focus/'>[aria-hidden='true'] elements contain focusable descendants</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-hidden-focus/'>aria-hidden-focus</a><br></div>"
  }, {
    name: 'ariaRequiredAttr',
    title: '`[role]`s have all required `[aria-*]` attributes',
    description: "Lighthouse flags ARIA roles that don't have the required states and properties.",
    correction: "<div class='correction-text'> Some ARIA roles have required attributes that describe the state of the element to screen readers. <br><br> See :<br><a target='_blank' href='https://web.dev/aria-required-attr/'>[role]s do not have all required [aria-*] attributes</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-required-attr/'>aria-required-attr</a><br></div>"
  }, {
    name: 'ariaRoles',
    title: '`[role]` values are valid',
    description: 'Lighthouse flags ARIA roles with invalid values.',
    correction: "<div class='correction-text'>An ARIA role attribute can be added to an element to instruct assistive technologies to treat the element as something other than its native HTML element type. For example, an <  a  > element with role='button' will be treated as a button, not as a link.<br><br>When an assistive technology encounters an element whose role attribute has an invalid value, it might ignore the element or respond to it in an unexpected way. As a result, people who use assistive technologies might find the element difficult or impossible to detect or use.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-roles/'>[role] values are not valid</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-roles/'>aria-roles</a><br></div>"
  }, {
    name: 'ariaValidAttrValue',
    title: '`[aria-*]` attributes have valid values',
    description: 'Lighthouse flags ARIA attributes with invalid values.',
    correction: "<div class='correction-text'>When an assistive technology encounters an element with an invalid ARIA attribute value, it might ignore the attribute or respond to it in an unexpected way.<br><br>As a result, people who use assistive technologies might find the element difficult or impossible to use.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-valid-attr-value/'>[aria-*] attributes do not have valid values</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-valid-attr-value/'>aria-valid-attr-value</a><br></div>"
  }, {
    name: 'ariaValidAttr',
    title: '`[aria-*]` attributes are valid and not misspelled',
    description: 'Lighthouse flags invalid ARIA attributes.',
    correction: "<div class='correction-text'>When an assistive technology encounters an element with an invalid ARIA attribute name, it might ignore the attribute or respond to it in an unexpected way. As a result, people who use assistive technologies might find the element difficult or impossible to use.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-valid-attr/'>[aria-*] attributes are not valid or misspelled</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-valid-attr/'>aria-valid-attr</a><br></div>"
  }, {
    name: 'bypass',
    title: 'The page contains a heading, skip link, or landmark region',
    description: "Lighthouse flags pages that don't provide a way to skip repetitive content.",
    correction: "<div class='correction-text'>Web pages typically begin with blocks of content that repeat across multiple pages, such as banners and site navigation menus. A person who uses a mouse can visually skim past that repeated content and access a link or other control within the primary content with a single click.<br><br>Similarly, a bypass mechanism allows keyboard users to navigate directly to the page’s main content. Otherwise, reaching the primary content could require dozens of keystrokes. People with limited mobility could find this task difficult or painful, and people who use screen readers could find it tedious to listen as each repeated element is announced.<br><br>See :<br><a target='_blank' href='https://web.dev/bypass/'>The page does not contain a heading, skip link, or landmark region</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/bypass/'>bypass</a><br></div>"
  }, {
    name: 'colorContrast',
    title: "Background and foreground colors don't have a sufficient contrast ratio.",
    description: "Lighthouse flags text whose background and foreground colors don't have a sufficiently high contrast ratio.",
    correction: "<div class='correction-text'>Most people find it easier to read text when it has a sufficiently high contrast against its background. People with visual disabilities, low vision, limited color perception, or presbyopia are likely to find text unreadable when contrast is too low.<br><br>See :<br><a target='_blank' href='https://web.dev/color-contrast/'>Background and foreground colors do not have a sufficient contrast ratio</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/color-contrast/'>color-contrast</a><br></div>"
  }, {
    name: 'documentTitle',
    title: 'Document has a `<title>` element',
    description: "Lighthouse flags pages without a <title> element in the page's <head>.",
    correction: "<div class='correction-text'>Typically, the first thing a user learns about a web page is its title. The title is displayed in the browser tab and in search engine results, and it’s announced by assistive technologies as soon as a user navigates to a page. A descriptive page title helps everyone, especially users of assistive technologies, determine whether a page contains information relevant to their current needs.<br><br>See :<br><a target='_blank' href='https://web.dev/document-title/'>Document doesn't have a title element</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/document-title/'>document-title</a><br></div>"
  }, {
    name: 'duplicateIdActive',
    title: '`[id]` attributes on active, focusable elements are unique',
    description: 'Lighthouse flags focusable elements that have duplicate ids.',
    correction: "<div class='correction-text'>When multiple active, focusable elements share the same id attribute, both scripting (such as JavaScript) and assistive technologies are likely to act only on the first and ignore the others. As a consequence, both functionality and accessibility can be degraded. (An element is focusable if it can receive input focus via scripting, mouse interaction, or keyboard tabbing. It’s active if it is not marked as disabled.)<br><br>See :<br><a target='_blank' href='https://web.dev/duplicate-id-active/'>[id] attributes on active, focusable elements are not unique</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/duplicate-id-active/'>duplicate-id-active</a><br></div>"
  }, {
    name: 'duplicateIdAria',
    title: 'ARIA IDs are unique',
    description: "Lighthouse flags elements that share an ID referred to by another element's aria-labelledby attribute.",
    correction: "<div class='correction-text'>Labels and ARIA relationship attributes (such as aria-controls, aria-labelledby, and aria-owns) depend on unique id values to identify specific UI components. When multiple elements in a web page share the same id value, assistive technologies are likely to recognize only the first, and ignore others.<br><br>See :<br><a target='_blank' href='https://web.dev/duplicate-id-aria'>ARIA IDs are not unique</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/duplicate-id-aria/'>duplicate-id-aria</a><br></div>"
  }, {
    name: 'headingOrder',
    title: 'Heading elements appear in a sequentially-descending order',
    description: 'Lighthouse flags pages whose headings skip one or more levels.',
    correction: "<div class='correction-text'>Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. <br><br>See :<br><a target='_blank' href='https://web.dev/heading-order/'>Heading elements are not in a sequentially-descending order</a><br></div>"
  }, {
    name: 'htmlHasLang',
    title: '`<html>` element has a `[lang]` attribute',
    description: "Lighthouse flags pages whose <html> element doesn't have a lang attribute.",
    correction: "<div class='correction-text'>When a web page’s primary language is programmatically identified, browsers and assistive technologies can render the text more accurately; screen readers can use the correct pronunciation; visual browsers can display the correct characters; media players can show captions correctly; and automated translation is enabled.<br><br>All users find it easier to understand the page’s content.<br><br>See :<br><a target='_blank' href='https://web.dev/html-has-lang/'><html> element does not have a [lang] attribute</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/html-has-lang/'>html-has-lang</a><br></div>"
  }, {
    name: 'htmlLangValid',
    title: '`<html>` element has a valid value for its `[lang]` attribute',
    description: "Lighthouse flags pages whose <html> element doesn't have a valid value for its lang attribute.",
    correction: "<div class='correction-text'>When a web page’s primary language is programmatically identified, browsers and assistive technologies can render the text more accurately; screen readers can use the correct pronunciation; visual browsers can display the correct characters; media players can show captions correctly; and automated translation is enabled.<br><br>All users find it easier to understand the page’s content.<br><br>See :<br><a target='_blank' href='https://web.dev/html-lang-valid/'><html> element does not have a valid value for its [lang] attribute</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/html-lang-valid/'>html-lang-valid</a><br></div>"
  }, {
    name: 'imageAlt',
    title: 'Image elements have `[alt]` attributes',
    description: "Lighthouse flags <img> elements that don't have alt attributes.",
    correction: "<div class='correction-text'>Because assistive technologies can’t interpret an image directly, they rely on alternative text to communicate the image's meaning to users. If an image has (non-empty) alternative text, the image is identified as meaningful, and its alternative text is presented to the user. If an image has an empty alt attribute, the image is identified as decorative and ignored. If an image has no alternative text at all, the image is presumed to be meaningful, and its filename is likely to be presented to the user.<br><br>See :<br><a target='_blank' href='https://web.dev/image-alt/'>Image elements do not have [alt] attributes</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/image-alt/'>image-alt</a><br></div>"
  }, {
    name: 'label',
    title: 'Form elements have associated labels',
    description: "Lighthouse flags form elements that don't have associated labels.",
    correction: "<div class='correction-text'>A form control is an interactive HTML element used for user input. Form controls include buttons, checkboxes, text fields, color pickers, and more.<br><br>An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by its name, not just by type (role).<br><br>When a form control doesn't have an accessible name, people who use assistive technologies have no way of knowing its specific purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/label/'>Form elements do not have associated labels</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/label/'>label</a><br></div>"
  }, {
    name: 'linkName',
    title: 'Links have a discernible name',
    description: "Lighthouse flags links that don't have discernible names.",
    correction: "<div class='correction-text'>An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When a link doesn’t have an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/link-name/'>Links do not have a discernible name </a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/link-name/'>link-name</a><br></div>"
  }, {
    name: 'list',
    title: 'Lists contain only `<li>` elements and script supporting elements',
    description: "Lighthouse flags lists that contain content elements that shouldn't be in a list.",
    correction: "<div class='correction-text'>In a properly structured list, all content is contained within list items. Content includes text and other HTML elements. Certain non-content elements are also allowed.<br><br>When an assistive technology encounters a list that’s poorly structured or contains disallowed elements, it might respond in an unexpected way. As a result, people who use assistive technologies might find it difficult to interpret the list.<br><br>See :<br><a target='_blank' href='https://web.dev/list/'>Lists do not contain only <  li  > elements and script supporting elements (<  script  > and <  template  >)</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/list/'>list</a><br></div>"
  }, {
    name: 'listItem',
    title: 'List items (`<li>`) are contained within `<ul>` or `<ol>` parent elements',
    description: "Lighthouse flags list items (<li>) that aren't contained in <ul> or <ol> parent elements.",
    correction: "<div class='correction-text'>In a properly structured list, all list items (<  li  > elements) are contained by a <  ul  >, <  ol  >, or <  menu  > parent element.<br><br>When an assistive technology encounters a list that’s poorly structured, it might respond in an unexpected way. As a result, people who use assistive technologies might find it difficult to interpret the list.<br><br> See :<br><a target='_blank' href='https://web.dev/listitem/'>List items (<  li  >) are not contained within <  ul  > or <  ol  > parent elements</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/listitem/'>listitem</a><br></div>"
  }, {
    name: 'tabIndex',
    title: 'No element has a `[tabindex]` value greater than 0',
    description: 'Lighthouse flags elements that have a tabindex value greater than 0.',
    correction: "<div class='correction-text'>A value greater than 0 implies an explicit navigation ordering. Although technically valid, this often creates frustrating experiences for users who rely on assistive technologies. <br><br>See :<br><a target='_blank' href='https://web.dev/tabindex/'>Some elements have a [tabindex] value greater than 0</a><br></div>"
  }, {
    name: 'tdHeadersAttr',
    title: 'Td Headers Attributes',
    description: 'Lighthouse flags tables that have more than one table header per column.',
    correction: "<div class='correction-text'>In a table, a header cell and a data cell are programmatically related if they are coded in a way that assistive technologies can accurately determine their relationship. When a data cell has a headers attribute that points to a cell in a different table, the programmatic relationship isn’t defined in a way that assistive technologies can recognize. As a result, assistive technology users can’t tell which header cell goes with a given data cell.<br><br>See :<br><a target='_blank' href='https://web.dev/td-headers-attr/'>Cells in a <  table  > element that use the [headers] attribute refer to an element ID not found within the same table</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/td-headers-attr/'>td-headers-attr</a><br></div>"
  }, {
    name: 'validLang',
    title: '[lang] attributes have a valid value',
    description: 'Lighthouse flags elements that have a lang attribute with an invalid value.',
    correction: "<div class='correction-text'>Sometimes a web page written in one language has a passage in a different language. When the language of such a passage is correctly identified (by a lang attribute on the containing element), browsers and assistive technologies can render the text more accurately; screen readers can use the correct pronunciation; visual browsers can display the correct characters; and media players can show captions correctly. All users find it easier to understand the content.<br><br>See :<br><a target='_blank' href='https://web.dev/valid-lang/'>[lang] attributes do not have a valid value</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/valid-lang/'>valid-lang</a><br></div>"
  }, {
    name: 'ariaInputFieldName',
    title: 'ARIA input fields have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies.",
    correction: "<div class='correction-text'>When an input field doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-input-field-name/'>aria-input-field-name</a><br></div>"
  }, {
    name: 'ariaMeterName',
    title: 'ARIA `meter` elements have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies",
    correction: "<div class='correction-text'>When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. An ARIA meter is a custom control corresponding to the HTML <  meter  > element. A meter represents either a scalar value within a known range, or a fractional value. For example, a meter might represent the unused portion of total storage capacity. An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When an ARIA meter doesn't an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-meter-name/'>aria-meter-name</a><br></div>"
  }, {
    name: 'ariaProgressbarName',
    title: 'ARIA `progressbar` elements have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies",
    correction: "<div class='correction-text'>When a `progressbar` element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. An ARIA progressbar is a custom control corresponding to the HTML <  progress  > element. A progressbar represents progress on a task that takes a long time to complete. An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When an ARIA progressbar doesn't an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-progressbar-name/'>aria-progress-bar-name</a><br></div>"
  }, {
    name: 'ariaRequiredChildren',
    title: 'ARIA Required children',
    description: "Lighthouse flags ARIA roles that don't have the required child roles.",
    correction: "<div class='correction-text'>An ARIA role attribute can be added to an element to instruct assistive technologies to treat the element as something other than its native HTML element type. For example, a <  ul  > element with role='listbox' is to be treated as a listbox control, not as a static list.<br><br>Some ARIA 'parent' roles identify composite controls that always include managed controls, identified by 'child' roles. For example, role='listbox' identifies a composite control that manages a set of managed controls identified by role='option'. People who use assistive technologies might find it difficult or impossible to use a composite control if its managed controls lack the required child role.<br><br> See :<br><a target='_blank' href='https://web.dev/aria-required-children/'>Elements with an ARIA [role] that require children to contain a specific [role] are missing some or all of those required children</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-required-children/'>aria-required-children</a><br></div>"
  }, {
    name: 'ariaRequiredParent',
    title: '`[role]`s are contained by their required parent element',
    description: "Lighthouse flags ARIA child roles that aren't contained by the required parent",
    correction: "<div class='correction-text'>An ARIA role attribute can be added to an element to instruct assistive technologies to treat the element as something other than its native HTML element type. For example, an <  li  > element with role='option' is to be treated as a selectable option in a listbox control, not as a static list item.<br><br>Some ARIA 'child' roles identify managed controls that are always part of a larger composite control, identified by a 'parent' role. For example, role='option' identifies a child control that is managed by a parent control identified by role='listbox'. People who use assistive technologies might find it difficult or impossible to use a child control if its managing control lacks the required parent role.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-required-parent/'>[role]s are not contained by their required parent element</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-required-parent/'>aria-required-parent</a><br></div>"
  }, {
    name: 'ariaToggleFieldName',
    title: 'ARIA toggle fields have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies.",
    correction: "<div class='correction-text'>When a toggle field doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. <br><br>See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-toggle-field-name/'>aria-toggle-field-name</a><br></div>"
  }, {
    name: 'ariaTooltipName',
    title: 'ARIA `tooltip` elements have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies.",
    correction: "<div class='correction-text'>An ARIA tooltip is a contextual popup with text describing an interface element. The tooltip typically becomes visible when the mouse hovers over, or focus is received by, the owning element. An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When an ARIA tooltip doesn't an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/aria-tooltip-name/'>aria-tooltip-name</a><br></div>"
  }, {
    name: 'ariaTreeitemName',
    title: 'ARIA `treeitem` elements have accessible names',
    description: "Lighthouse flags custom ARIA items whose names aren't accessible to assistive technologies.",
    correction: "<div class='correction-text'>When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers.<br><br>See :<br><a target='_blank' href='https://web.dev/aria-name/'>ARIA items do not have accessible names</a><br></div>"
  }, {
    name: 'buttonName',
    title: 'Buttons have an accessible name',
    description: "Lighthouse flags buttons that don't have text content or an aria-label property.",
    correction: "<div class='correction-text'>An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type. When a button doesn’t have an accessible name, people who use assistive technologies have no way of knowing its purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/button-name/'>Buttons do not have an accessible name</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/button-name/'>button-name</a><br></div>"
  }, {
    name: 'definitionList',
    title: 'Definition List',
    description: "Lighthouse flags <dl> elements that don't contain properly ordered <dt> and <dd> groups, <script>, or <template> elements.",
    correction: "<div class='correction-text'>A definition list is a list of terms (words or phrases), and their definitions. A definition list can contain only certain element types, and it requires a specific structure.<br><br>When an assistive technology encounters a definition list that’s poorly structured or contains invalid elements, it might respond in an unexpected way. As a result, people who use assistive technologies might find it difficult to interpret the list.<br><br>See :<br><a target='_blank' href='https://web.dev/definition-list/'>< dl > do not contain only properly ordered <  dt  > and <  dd  > groups, <  script  >, or <  template  > elements</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/definition-list/'>definition-list</a><br></div>"
  }, {
    name: 'dlItem',
    title: 'Definition list items are wrapped in `<dl>` elements',
    description: 'Lighthouse reports when definition list items are not wrapped in <dl> elements.',
    correction: "<div class='correction-text'>A definition list is a list of terms (words or phrases), and their definitions. The <  dt  > and <  dd  > elements must be contained by a <  dl  > element.<br><br>When an assistive technology encounters a definition list that’s poorly structured, it might respond in an unexpected way. As a result, people who use assistive technologies might find it difficult to interpret the list.<br><br>See :<br><a target='_blank' href='https://web.dev/dlitem/'>Definition list items are not wrapped in <  dl  > elements</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/dlitem/'>dlitem</a><br></div>"
  }, {
    name: 'formFieldMultipleLabels',
    title: 'No form fields have multiple labels',
    description: 'Lighthouse flags form elements that have more than one label.',
    correction: "<div class='correction-text'>Form fields with multiple labels can be confusingly announced by assistive technologies like screen readers which use either the first, the last, or all of the labels. <br><br>See :<br><a target='_blank' href='https://web.dev/form-field-multiple-labels'>Form fields have multiple labels</a><br></div>"
  }, {
    name: 'frameTitle',
    title: '`<frame>` or `<iframe>` elements have a title',
    description: "Lighthouse flags <frame> and <iframe> elements that don't have titles.",
    correction: "<div class='correction-text'>A <  frame  > or <  iframe  > is used to embed one HTML document within another. An accessible name is a word or phrase coded in a way that assistive technologies can associate it with a specific user interface object. Assistive technologies can then refer to the object by name, not just by type.<br><br>People with good vision can glance at a <  frame  > or <  iframe  > element to get a good idea of its content. People who use assistive technologies rely on the frame’s accessible name to determine whether it contains information relevant to their current needs.<br><br>See :<br><a target='_blank' href='https://web.dev/frame-title/'><  frame  > or <  iframe  > elements do not have a title</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/frame-title/'>frame-title</a><br></div>"
  }, {
    name: 'inputImageAlt',
    title: '`<input type="image">` elements have `[alt]` text',
    description: "Lighthouse flags < input type='image' > elements that don't have alt text",
    correction: "<div class='correction-text'>An image button is an <  input  > element with type='image'. Alternative text is a word or phrase that (1) is coded in a way that assistive technologies can associate it with a specific non-text object, and (2) conveys the same information as the non-text object.<br><br>Because assistive technologies can’t interpret an image directly, they rely on alternative text to communicate the image button’s purpose. When an image button doesn’t have alternative text, people who use assistive technologies have no way of knowing its purpose.<br><br>See :<br><a target='_blank' href='https://web.dev/input-image-alt/'><  input type='image'  > elements do not have [alt] text</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/input-image-alt/'>input-image-alt</a><br></div>"
  }, {
    name: 'metaRefresh',
    title: 'The document does not use `<meta http-equiv="refresh">`',
    description: "Lighthouse flags pages that contain a <meta> tag with the http-equiv='refresh' attribute.",
    correction: "<div class='correction-text'>Using http-equiv='refresh' in a <  meta  > element causes a web page to refresh automatically at a specified time interval.<br><br>An automatic page refresh can be disorienting. If a refresh causes input focus to move unexpectedly back to its original state, it can be especially frustrating for people who use screen readers and other keyboard users.<br><br>See :<br><a target='_blank' href='https://web.dev/meta-refresh/'>The document uses <  meta http-equiv='refresh'  ></a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/meta-refresh/'>meta-refresh</a><br></div>"
  }, {
    name: 'metaViewport',
    title: 'Meta Viewport',
    description: 'Lighthouse flags pages that disable browser zooming.',
    correction: "<div class='correction-text'>Using content='user-scalable=no' in a <  meta name='viewport'  > element disables zooming in some browsers. Users are forced to view the text at the specified size.<br><br>Most people find it easier to read text when it is sufficiently large. People with visual disabilities, low vision, or limited color perception are likely to find text unreadable when it’s too small.<br><br>See :<br><a target='_blank' href='https://web.dev/meta-viewport/'>[user-scalable='no'] is used in the <  meta name='viewport'  > element or the [maximum-scale] attribute is less than 5</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/meta-viewport/'>meta-viewport</a><br></div>"
  }, {
    name: 'objectAlt',
    title: '`<object>` elements have `[alt]` text',
    description: "Lighthouse flags <object> elements that don't have alternative text.",
    correction: "<div class='correction-text'>An <  object  > element is used to embed multimedia content in a web page. It can also be used to embed one web page inside another.<br><br>Alternative text is a word or phrase that (1) is coded in a way that assistive technologies can associate it with a specific non-text object, and (2) conveys the same information as the non-text object.<br><br>Because assistive technologies can’t interpret objects directly, they rely on alternative text to communicate the meaning of non-text content to users.<br><br>See :<br><a target='_blank' href='https://web.dev/object-alt/'><  object  > elements do not have alt text</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/object-alt/'>object-alt</a><br></div>"
  }, {
    name: 'thHasDataCells',
    title: '<th> elements have data cells they describe.',
    description: "Lighthouse flags <th> elements and elements with [role='columnheader'/'rowheader'] that don't have the data cells they describe.",
    correction: "<div class='correction-text'>When people with good vision see a table with a row or column header that has no associated data cells, they can tell at a glance that the data is missing. People who use assistive technologies must explore a table deliberately to discover its contents; they are likely to have difficulty interpreting a table with missing data cells.<br><br>See :<br><a target='_blank' href='https://web.dev/th-has-data-cells/'><  th  > elements and elements with [role='columnheader'/'rowheader'] do not have data cells they describe</a><br><a target='_blank' href='https://accessibilityinsights.io/info-examples/web/th-has-data-cells/'>th-has-data-cells</a><br></div>"
  }, {
    name: 'videoCaption',
    title: 'Video Caption',
    description: "Lighthouse flags <video> elements that are missing a <track> element with the attribute kind='captions'.",
    correction: "<div class='correction-text'>When a video provides a caption it is easier for deaf and hearing impaired users to access its information. <br><br>See :<br><a target='_blank' href='https://web.dev/video-caption/'><   video   > elements do not contain a <   track   > element with [kind=\"captions\"]</a><br></div>"
  }, {
    name: 'accessKeys',
    title: '`[accesskey]` values are unique',
    description: 'Lighthouse flags pages with duplicate access keys.',
    correction: "<div class='correction-text'>Access keys let users quickly focus a part of the page. For proper navigation, each access key must be unique. <br><br> See :<br><a target='_blank' href='https://web.dev/accesskeys/'>[accesskey] values are not unique</a></div>"
  }
]
export default lighthouseAccessibilityData
