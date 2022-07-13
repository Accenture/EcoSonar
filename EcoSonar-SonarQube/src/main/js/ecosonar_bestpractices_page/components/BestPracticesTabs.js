import React from 'react'
import classNames from 'classnames'

export default function BestPracticesTabs (props) {
  const { state, tabs } = props

  return (
    <div className='tab-container'>
      {tabs.map(({ key, label }, i) => (
        <button
          key={i}
          className={classNames('tab', {
            'tab-active': state.selectedTab === key,
            'tab-inactive': state.selectedTab !== key
          })}
          onClick={() => state.selectedTab !== key && props.setSelectedTab(key)}
        >
          {key}
          <div className={classNames({ 'active-border': state.selectedTab === key })} active={state.selectedTab === key} />
        </button>
      ))}
    </div>
  )
}
