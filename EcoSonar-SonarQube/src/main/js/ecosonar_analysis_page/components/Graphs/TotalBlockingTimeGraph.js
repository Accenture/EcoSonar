import React from 'react'
import Charts from 'react-apexcharts'

export default class TotalBlockingTimeGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: {
        chart: {
          id: 'TotalBlockingTime-graph'
        },
        title: {
          text: 'Total Blocking Time Score',
          align: 'left'
        },
        height: 350,
        xaxis: {
          type: 'datetime',
          min: new Date(2021, 8, 30, 15, 5),
          tickAmount: 6
        }
      },
      series: [
        {
          name: 'Total Blocking Time Score',
          data: props.totalBlockingTimeAnalysis
        }
      ]
    }
  }

  render () {
    return (
      <div className="mixed-chart">
        <Charts
          options={this.state.options}
          series={this.state.series}
          type="line"
          width="600"
        />
      </div>
    )
  }
}
