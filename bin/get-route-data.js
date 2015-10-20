'use strict'

const fs = require('fs')
const http = require('http')
const polyline = require('polyline')
const earthsRadiusInMeters = 6371000

function toRad (value) {
  return value * Math.PI / 180
}

function toDeg (value) {
  return value / Math.PI * 180
}

function calcBearing (pointA, pointB) {
  if (!(pointA && pointB)) { return 0 }

  let latA = toRad(pointA[0])
  let lonA = toRad(pointA[1])
  let latB = toRad(pointB[0])
  let lonB = toRad(pointB[1])
  let deltaLon = lonB - lonA
  let x = Math.cos(latB) * Math.sin(deltaLon)
  let y = Math.cos(latA) * Math.sin(latB) -
          Math.sin(latA) * Math.cos(latB) *
          Math.cos(deltaLon)

  return (toDeg(Math.atan2(x, y)) + 360) % 360
}

function calcDistance (pointA, pointB) {
  if (!(pointA && pointB)) { return 0 }

  let latA = toRad(pointA[0])
  let lonA = toRad(pointA[1])
  let latB = toRad(pointB[0])
  let lonB = toRad(pointB[1])
  let deltaLon = lonB - lonA

  return Math.acos(
    Math.sin(latA) * Math.sin(latB) +
    Math.cos(latA) * Math.cos(latB) *
    Math.cos(deltaLon)
  ) * earthsRadiusInMeters
}

function transformPoint (point, index, points, totalDistance) {
  if (!point) return {}

  let current  = point
  let next     = points[index + 1]
  let previous = points[index - 1]

  let distance = calcDistance(previous, current)
  let bearing  = calcBearing(current, next)

  return {
    point: current,
    distance: distance,
    bearing: bearing
  }
}

function pointsToDecimal (point) {
  return [point[0] / 10, point[1] / 10]
}

function processResult (result) {
  var totalDistance = 0

  return polyline.decode(result.route_geometry)
    .map(pointsToDecimal)
    .map(function (point, index, points) {
      let transformed = transformPoint(point, index, points)
      totalDistance += transformed.distance
      transformed.totalDistance = totalDistance
      return transformed
    })
}

function handleResponse (response) {
  var result = ''

  response.on('data', function (chunk) {
    result += chunk
  })

  response.on('end', function () {
    fs.writeFile(
      './source/assets/data/route.json',
      JSON.stringify(processResult(JSON.parse(result))),
      function (err) {
        if (err) { throw new Error(err) }

        process.exit(0)
      }
    )
  })
}

let options = {
  host: 'api-osrm-routed-production.tilestream.net',
  path: (`/viaroute?z=12
    &loc=-31.9522,115.8589
    &loc=-34.9290,138.6010
    &loc=-37.8136,144.9631
    &loc=-33.8650,151.2094
    &loc=-27.4667,153.0333`).replace(/\n|\s/g, '')
}

http.request(options, handleResponse).end()
