import React from 'react'

export default function AccordionDescription (props) {
  const { descriptions } = props

  const [isExtended, setIsExtended] = React.useState(false)

  return (
    !!descriptions.length && (
      <div className={`accordion-descriptions ${descriptions.length > 5 ? 'extend' : ''}`} onClick={() => setIsExtended(!isExtended)}>
        {!isExtended &&
        <pre className='lighthouse-descriptions'>{JSON.stringify(descriptions, null, 2)}
         </pre>
       }
        {isExtended && <pre className='lighthouse-descriptions-extend'>{JSON.stringify(descriptions, null, 2)}</pre>}

      </div>
    )
  )
}
