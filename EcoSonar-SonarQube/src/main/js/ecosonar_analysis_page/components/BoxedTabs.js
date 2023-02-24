import classNames from 'classnames'
import React from 'react'

export default function BoxedTabs (props) {
  const { tabs, selected } = props

  return (
    <div className="tab-container" role='tablist' aria-label='List of tabs for analysis' aria-orientation='horizontal'>
      {tabs.map(({ key, label, panelName }, i) => (
        <button
          className={classNames('tab', { 'tab-active': selected === key, 'tab-inactive': selected !== key })}
          key={i}
          onClick={() => selected !== key && props.onSelect(key)}
          type="button"
          role='tab'
          tabIndex={-i}
          aria-controls={panelName}
          aria-selected={(selected === key).toString()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (props.onSelect) props.onSelect(i)
            }

            if (e.key === 'ArrowRight') {
              e.currentTarget.nextSibling && e.currentTarget.nextSibling.focus()
            }
            if (e.key === 'ArrowLeft') {
              e.currentTarget.previousSibling && e.currentTarget.previousSibling.focus()
            }
          }}
          >
          <div className={classNames({ 'active-border': selected === key })} />
          {label}
        </button>
      ))}
    </div>
  )
}
