import React from 'react'

export default function AccordionDescription (props) {
  const { descriptions } = props

  const [isExtended, setIsExtended] = React.useState(false)

  const shown = descriptions.slice(0, isExtended ? descriptions.length : 5)

  return (
    descriptions.length > 0 &&
    <div
      className={`accordion-descriptions ${descriptions.length > 5 ? 'extend' : ''}`}
      onClick={() => setIsExtended(!isExtended)}
    >
      {shown.map((value, index) => <div key={index}>{ value }</div>)}
      {descriptions.length > 5 && !isExtended &&
        <div
          className='accordion-description-extend'
        >
          ... and {descriptions.length - 5} more
        </div>}
    </div>
  )
}
