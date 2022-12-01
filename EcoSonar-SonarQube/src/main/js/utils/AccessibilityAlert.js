import React from 'react'

/**
 * This component create an alert for screen readers when the context is updated (e.g : user change the value of a dropdown )
 * @returns an alert
 */
function AccessibilityAlert () {
  return (
      <div>

          <span className='sr-only' hidden={true} role='alert'>
            Context has been updated
          </span>

      </div>
  )
}

export default AccessibilityAlert
