import React from 'react';
import * as d3 from 'd3';

class Chart extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.updateChart(this.props.scores);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps.scores);
  }

  calculatePercentage(data) {
    return Math.floor((data.correct / data.attempts) * 100);
  }

  updateChart(data) {
    const percentCorrect = this.calculatePercentage(data);
    const percentages = [percentCorrect, 100 - percentCorrect];
    // if no data then remove pie chart
    if (!percentages[0] && !percentages[1]) {
      d3.select('#' + this.props.level + 'chart').select('g').remove();
      return;
    }
    const height = 200;
    const pies = d3.pie()(percentages);
    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(100)
                  .startAngle(d => d.startAngle)
                  .endAngle(d => d.endAngle);

    const svg = d3.select('#' + this.props.level + 'chart')
                  .append('g')
                  .attr('transform', 'translate(100,200)');
    let path = svg.selectAll('path')
                    .data(pies);
    path.exit().remove();

    const enter = path.enter()
                      .append('path')
                      .attr('stroke', '#fff');
    path = enter.merge(path)
                .attr('d', arc)
                .attr('fill', (d, i) => {
                  if (i === 0) {
                    return 'green';
                  } else {
                    return 'red';
                  }
                });
  }

  render() {
    return (
      <div className="column">
        <svg id={this.props.level + "chart"} />
      </div>
    )
  }
}

export default Chart;
