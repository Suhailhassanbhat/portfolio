import * as d3 from 'd3'

const margin = { top: 20, left: 20, right: 20, bottom: 20 }
const height = 450 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

// const pie = d3.pie().value(1 / 12)

const radius = 200

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

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(pie(datapoints))

  const temps = datapoints.map(function(d) {
    return +d.high_temp
  })

  // const months = datapoints.map(function(d) {
  //   return d.month_name
  // })

  colorScale.domain(d3.extent(temps))
  radiusScale.domain(d3.extent(temps))
  // angleScale.domain(d3.extent(months))

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.high_temp))

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  svg
    .append('text')
    .text('NYC high temperatures, by month')
    .style('font-weight', 'bold')
    .style('font-size', 20)
    .attr('x', 0)
    .attr('text-anchor', 'middle')
    .attr('y', -height / 2 + 40)
}
