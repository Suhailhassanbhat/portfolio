import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 20, left: 50, right: 20, bottom: 50 }
const height = 350 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#wiretap-cost')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2008, 2018])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([35000, 80000])
  .range([height, 0])

const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.year)
  })
  .y(d => {
    return yPositionScale(d.cost)
  })
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ` In ${d.year}, cost of wiretapping was <span style='color:blue'>$${d.cost} thousand</span>`
  })
svg.call(tip)

d3.csv(require('../data/wiretap_cost.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .append('path')
    .datum(datapoints)
    .attr('class', 'path')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#9e4b6c')
    .attr('stroke-width', 2)
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', '#9e4b6c')
    .attr('cx', d => xPositionScale(d.year))
    .attr('cy', d => yPositionScale(d.cost))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg
    .selectAll('.temp-text')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'head')
    .attr('y', height + 50)
    .attr('x', width - 150)
    .text('Source : US Courts Website')
    .style('font-size', 10)

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickFormat(d3.format('$,d'))
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
