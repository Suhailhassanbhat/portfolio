import * as d3 from 'd3'

const margin = { top: 20, left: 100, right: 20, bottom: 10 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#courtbars1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 35])
  .range([0, width])

const yPositionScale = d3.scaleBand().range([height, 0])

d3.csv(require('../data/courts.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)
  datapoints = datapoints.sort(function(a, b) {
    return d3.ascending(a.Judges_on_Appeals, b.Judges_on_Appeals)
  })

  yPositionScale.domain(
    datapoints.map(function(d) {
      return d.president
    })
  )

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', function(d) {
      return xPositionScale(d.Judges_on_Appeals)
    })
    .attr('height', 30)
    .attr('x', 0)
    .attr('y', d => yPositionScale(d.president))
    .attr('fill', function(d) {
      if (d.president === 'Donald Trump') {
        return 'lightpink'
      } else {
        return 'lightblue'
      }
    })
  // .on('mouseover', function(d) {
  //   if (d.president === 'George W. Bush2') {
  //     return d3
  //       .select('#text')
  //       .text(
  //         'George W Bush appointed the least number of judges on district courts since 1989 during his second term.'
  //       )
  //   }
  //   if (d.president === 'Donald Trump') {
  //     return d3
  //       .select('#text')
  //       .text(
  //         'If Trumps fills up all vacancies, he will put more judges on courts than Obama'
  //       )
  //   }
  //   if (
  //     d.president === 'William J. Clinton' ||
  //     d.president === 'William J. Clinton2'
  //   ) {
  //     return d3
  //       .select('#text')
  //       .text(
  //         'Clinton put 327 judges on distict courts in his two terms, most by any president in recent history'
  //       )
  //   }
  //   if (d.president === 'Barack Obama' || d.president === 'Barack Obama2') {
  //     return d3
  //       .select('#text')
  //       .text(
  //         'Barack Obama put 271 judges on distict courts in his two terms'
  //       )
  //   }
  // })
  // .on('mouseout', function(d) {
  //   d3.select('#text').text('')
  // })

  svg
    .selectAll('text')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('y', function(d) {
      return yPositionScale(d.president) + 20
    })
    .attr('x', function(d) {
      return xPositionScale(d.Judges_on_Appeals) + 5
    })
    .text(function(d) {
      return d.Judges_on_Appeals
    })
    .style('font-size', 12)
    .style('font-weight', 'bold')

  svg
    .selectAll('.temp-text')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'head')
    .attr('y', height - margin.bottom / 2)
    .attr('x', width - 220)
    .text('Source : US Courts Website')
    .style('font-size', 10)

  const yAxis = d3.axisLeft(yPositionScale).tickSize(0)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    // .attr('visibility', 'hidden')
    .call(yAxis)
  svg.selectAll('.y-axis path').remove()

  //   const xAxis = d3.axisBottom(xPositionScale)
  //   svg
  //     .append('g')
  //     .attr('class', 'axis x-axis')
  //     .attr('transform', 'translate(0,' + height + ')')
  //     .call(xAxis)
}
