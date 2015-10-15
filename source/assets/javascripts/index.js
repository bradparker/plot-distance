'use strict'

import L from 'leaflet'
import routeData from '../data/route.json'

const routePoints = routeData.map(routeDatum => routeDatum.point)

const earthsRadiusInMeters = 6371000
const toRad = (value) => value * Math.PI / 180
const toDeg = (value) => value / Math.PI * 180

const map = L.map('map')

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map)

const findDistanceRouteDatum = (distance) => {
  return routeData.find((datum, index) => {
    let next = routeData[index + 1]
    return (distance > datum.totalDistance) &&
      (distance < (next && next.totalDistance))
  }) || routeData[routeData.length - 1]
}

const calcRiderPosition = (totalDistance) => {
  let startDatum             = findDistanceRouteDatum(totalDistance)
  let currentBearingDistance = totalDistance - startDatum.totalDistance
  let point                  = startDatum.point
  let lat                    = toRad(point[0])
  let lon                    = toRad(point[1])
  let bearing                = toRad(startDatum.bearing)
  let angularDistance        = currentBearingDistance / earthsRadiusInMeters

  let riderLat = Math.asin(
    Math.sin(lat) * Math.cos(angularDistance) +
    Math.cos(lat) * Math.sin(angularDistance) *
    Math.cos(bearing)
  )
  let riderLon = Math.atan2(
    Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat),
    Math.cos(angularDistance) - Math.sin(lat) * Math.sin(riderLat)
  ) + lon

  return [toDeg(riderLat), toDeg(riderLon)]
}

L.polyline(routePoints, {
  color: 'red',
  weight: 3
}).addTo(map)

var riderPositions = [
  calcRiderPosition(2200000),
  calcRiderPosition(1200000),
  calcRiderPosition(1400000),
  calcRiderPosition(2100000),
  calcRiderPosition(5100000)
]

var riderIcon = L.divIcon({
  iconSize: new L.Point(16, 16),
  html: '<div class="gsc-MapMarker" />'
})

riderPositions.forEach((position) => {
  L.marker(position, { icon: riderIcon }).addTo(map)
})

map.fitBounds(riderPositions, {
  padding: [50, 50]
})
