import * as d3 from 'd3'

const margin = { top: 20, left: 20, right: 20, bottom: 20 }
const height = 440 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const task = ['Reading StackOverflow', 'Typing code', 'Rewriting code']

const radius = 135

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const labelArc = d3
  .arc()
  .innerRadius(radius)
  .outerRadius(radius + 20)
//   .startAngle(d => angleScale(d))
//   .endAngle(d => angleScale(d) + angleScale.bandwidth())

const colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])

d3.csv(require('/data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log(pie(datapoints))

  svg
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.minutes))

  svg
    .selectAll('.outside-label')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    // .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
