import classNames from 'classnames'
import React from 'react'

export default function BoxedTabs (props) {
  const { tabs, selected } = props

  return (
    <div className='tab-container' role='tablist'>
      {tabs.map(({ key, label }, i) => (
        <button
          className={classNames('tab', { 'tab-active': selected === key, 'tab-inactive': selected !== key })}
          active={(selected === key).toString()}
          key={i}
          onClick={() => selected !== key && props.onSelect(key)}
          type='button'
          role='tab'
        >
          <div className={classNames({ 'active-border': selected === key })} active={(selected === key).toString()} />
          {label}
        </button>
      ))}
    </div>
  )
}
