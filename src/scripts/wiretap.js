import * as d3 from 'd3'

const margin = { top: 20, left: 80, right: 20, bottom: 50 }
const height = 350 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#wiretap')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 350])
  .range([0, width])

const yPositionScale = d3.scaleBand().range([height, 0])

d3.csv(require('../data/wiretaps.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  datapoints = datapoints.sort(function(a, b) {
    return d3.ascending(+a.Orders, +b.Orders)
  })

  yPositionScale.domain(
    datapoints.map(function(d) {
      return d.State
    })
  )

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', function(d) {
      return xPositionScale(d.Orders)
    })
    .attr('height', 20)
    .attr('x', 0)
    .attr('y', d => yPositionScale(d.State))
    .attr('fill', 'lightblue')

  svg
    .selectAll('.temp-text')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'head')
    .attr('y', height + 40)
    .attr('x', width - 150)
    .text('Source : US Courts Website')
    .style('font-size', 10)

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).tickSize(0)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    // .attr('visibility', 'hidden')
    .call(yAxis)
  svg.selectAll('.y-axis path').remove()
}
