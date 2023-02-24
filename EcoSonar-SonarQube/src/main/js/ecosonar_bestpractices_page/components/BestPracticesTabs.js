import classNames from 'classnames'
import React from 'react'

export default function BestPracticesTabs (props) {
  const { state, tabs } = props

  return (
    <div className='tab-container' role="tablist">
      {tabs.map(({ key, label }, i) => (
        <button
          key={i}
          className={classNames('tab', {
            'tab-active': state.selectedTab === key,
            'tab-inactive': state.selectedTab !== key
          })}
          onClick={() => state.selectedTab !== key && props.setSelectedTab(key)}
          role='tab'
          aria-selected={state.selectedTab === key}
        >
          {key}
          <div className={classNames({ 'active-border': state.selectedTab === key })} disabled={state.selectedTab !== key} />
        </button>
      ))}
    </div>
  )
}
