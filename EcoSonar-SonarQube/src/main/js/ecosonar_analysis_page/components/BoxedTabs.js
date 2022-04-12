import * as React from 'react'
import classNames from 'classnames'

export default function BoxedTabs (props) {
  const { tabs, selected } = props

  return (
    <div className="tab-container">
      {tabs.map(({ key, label }, i) => (
        <button
          className={classNames('tab', { 'tab-active': selected === key, 'tab-inactive': selected !== key })}
          active={selected === key}
          key={i}
          onClick={() => selected !== key && props.onSelect(key)}
          type="button">
          <div className={classNames({ 'active-border': selected === key })} active={selected === key} />
          {label}
        </button>
      ))}
    </div>
  )
}
