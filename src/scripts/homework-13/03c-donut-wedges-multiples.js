import * as d3 from 'd3'

const margin = { top: 10, left: 10, right: 10, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 1000 - margin.left - margin.right

const svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// .append('g')
// .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 85

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]
const angleScale = d3
  // .scalePoint()
  // .padding(0.5)
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radiusScale = d3.scaleLinear().range([radius / 2, radius])
const xPositionScale = d3.scalePoint().range([radius, width - radius])
// .padding(0)

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const temps = datapoints.map(function(d) {
    return +d.high_temp
  })
  colorScale.domain(d3.extent(temps))
  radiusScale.domain(d3.extent(temps))

  const cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('.wedge')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values
      container
        .selectAll('.polar-bar')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.high_temp))
        .attr('transform', function(d) {
          const xPosition = xPositionScale(d.city)
          return `translate(${xPosition}, ${height / 2})`
        })
      container
        .selectAll('.circle')
        .data(datapoints)
        .enter()
        .append('circle')
        .attr('r', 2)
        .attr('fill', 'grey')
        .attr('transform', function(d) {
          const xPosition = xPositionScale(d.city)
          return `translate(${xPosition}, ${height / 2})`
        })

      container
        .selectAll('.outside-label')
        .data(datapoints)
        .enter()
        .append('text')
        .text(d => d.city)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('transform', function(d) {
          const xPosition = xPositionScale(d.city)
          return `translate(${xPosition}, ${height - 20})`
        })
    })
}
