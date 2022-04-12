import * as React from 'react'
import AccordionDescription from './AccordionDescription'
import AccordionTitle from './AccordionTitle'

export default function AccordionItem (props) {
  const { practice, staticData, isFolded, setIsFolded } = props

  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    if (isFolded) setIsActive(false)
  }, [isFolded])
  function unFoldAndChangeIsActive () {
    setIsActive(!isActive)
    if (isFolded) setIsFolded(false)
  }

  return (
    <li className='accordion-item'>
     <div className='accordion-toggle' onClick={() => { unFoldAndChangeIsActive() } }>
        <AccordionTitle
          compliance={practice.compliance}
          title={staticData.title}
          staticTitleData={staticData.titleData}
          titleData={practice.title}
          isActive={isActive}
          correction={staticData.correction}
        />
      </div>
      {!isFolded && isActive && (
        <div className='accordion-content'>
          <div className='description'>
            {staticData.description}
          </div>
          {!!practice.description && <AccordionDescription descriptions={practice.description}/>}
        </div>
      )}
    </li>
  )
}
