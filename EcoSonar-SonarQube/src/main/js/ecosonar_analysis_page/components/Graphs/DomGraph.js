import React from 'react'
import Charts from 'react-apexcharts'

export default class DomGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: {
        chart: {
          id: 'dom-graph'
        },
        title: {
          text: 'Size of the Dom',
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
          name: 'domSize',
          data: props.domAnalysis
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
