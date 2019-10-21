import * as d3 from 'd3'

const margin = { top: 30, left: 10, right: 10, bottom: 30 }

const height = 350 - margin.top - margin.bottom

const width = 1100 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
  'Dec',
  'Jan'
]
const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 80

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([22, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))

const xPositionScale = d3.scalePoint().range([radius, width - radius])

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  // const maxTemp = datapoints.map(function(d) {
  //   return +d.high_temp
  // })

  // radiusScale.domain([0, maxTemp])

  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('.radial-area')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values
      const city = d.key
      datapoints.push(datapoints[0])

      console.log(datapoints)
      container
        .append('path')
        .datum(datapoints)
        .attr('d', d => line(d))
        .attr('fill', 'pink')
        .attr('stroke', 'none')
        .attr('transform', function(d) {
          const xPosition = xPositionScale(city)
          return `translate(${xPosition}, ${height / 2})`
        })

      const bands = [20, 40, 60, 80, 100]

      container
        .selectAll('.band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('r', function(d) {
          return radiusScale(d)
        })
        .attr('transform', function(d) {
          const xPosition = xPositionScale(city)
          return `translate(${xPosition}, ${height / 2})`
        })
      container
        .append('text')
        .text(city)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('font-size', 12)
        .attr('transform', function(d) {
          const xPosition = xPositionScale(city)
          return `translate(${xPosition}, ${height / 2})`
        })
      const labels = [20, 60, 100]

      container
        .selectAll('.label')
        .data(labels)
        .enter()
        .append('text')
        .text(d => `${d}°`)
        .attr('y', d => -radiusScale(d) - 2)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', 7)
        .attr('transform', function(d) {
          const xPosition = xPositionScale(city)
          return `translate(${xPosition}, ${height / 2})`
        })
    })
  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .style('font-weight', 'bold')
    .style('font-size', 20)
    .attr('x', width / 2)
    .attr('text-anchor', 'middle')
    .attr('y', margin.top / 2)

  svg
    .append('text')
    .text('in cities around the world')
    // .style('font-weight', 'bold')
    .style('font-size', 12)
    .attr('x', width / 2)
    .attr('text-anchor', 'middle')
    .attr('y', margin.top / 2 + 15)
}
