import React from 'react'
import L from 'leaflet'
import find from 'lodash/collection/find'
import routeData from '../../../data/route.json'
import Popup from './Popup'

const earthsRadiusInMeters = 6371000
const toRad = (value) => value * Math.PI / 180
const toDeg = (value) => value / Math.PI * 180

let racerIcon = L.divIcon({
  iconSize: new L.Point(16, 16),
  html: '<div class="gsc-Marker" />'
})

const NullRouteDatum = {
  totalDistance: 0,
  bearing: 0,
  point: [0, 0]
}

export default React.createClass({
  propTypes: {
    racers: React.PropTypes.array,
    route: React.PropTypes.array
  },

  getDefaultProps () {
    return {
      racers: [],
      route: []
    }
  },

  componentDidMount () {
    let mapContainer = this.refs.map.getDOMNode()
    let map = L.map(mapContainer)
    let markers = L.featureGroup()
    map.addLayer(markers)
    let popupContainer = document.createElement('div')
    document.body.appendChild(popupContainer)

    this.setState({
      map,
      markers,
      popupContainer
    }, () => {
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
      this.renderRoute()
      this.renderRacers(this.props.racers)
    })
  },

  componentWillReceiveProps (nextProps) {
    this.clearRenderedRacers()
    this.renderRacers(nextProps.racers)
  },

  findRacerRouteStartingDatum (distance) {
    let routeData = this.props.route
    return routeData.find((datum, index) => {
      let next = routeData[index + 1]
      return (distance > datum.totalDistance) &&
        (distance < (next && next.totalDistance))
    }) || routeData[routeData.length - 1] || NullRouteDatum
  },

  calcRacerPosition (totalDistance) {
    let startDatum             = this.findRacerRouteStartingDatum(totalDistance)
    let currentBearingDistance = totalDistance - startDatum.totalDistance
    let point                  = startDatum.point
    let lat                    = toRad(point[0])
    let lon                    = toRad(point[1])
    let bearing                = toRad(startDatum.bearing)
    let angularDistance        = currentBearingDistance / earthsRadiusInMeters

    let racerLat = Math.asin(
      Math.sin(lat) * Math.cos(angularDistance) +
      Math.cos(lat) * Math.sin(angularDistance) *
      Math.cos(bearing)
    )
    let racerLon = Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(racerLat)
    ) + lon

    return [toDeg(racerLat), toDeg(racerLon)]
  },

  selectRacer (id) {
    let racer = find(this.state.racers, racer => racer.id === id)
    this.setState({
      selectedRacer: id
    }, () => {
      this.state.map.setZoom(6)
      this.state.map.panTo(racer.marker.getLatLng())
      racer.marker.openPopup()
    })
  },

  handleMarkerClick (id) {
    this.setState({
      selectedRacer: id
    })
  },

  racersUpdated () {
    let selectedRacer = find(this.props.racers, (racer) => {
      return racer.id === this.props.selectedRacer
    })
    if (selectedRacer) {
      this.selectRacer(selectedRacer.id)
    } else {
      let points = this.state.racers.map((racer) => racer.marker.getLatLng())
      if (points.length) {
        this.state.map.fitBounds(points, {
          padding: [50, 50]
        })
      }
    }
  },

  renderRoute () {
    let routePoints = this.props.route.map((routeDatum) => {
      return routeDatum.point
    })
    L.polyline(routePoints, {
      color: 'red',
      weight: 3
    }).addTo(this.state.map)
  },

  clearRenderedRacers () {
    let popupContainer = this.state.popupContainer
    this.state.markers.clearLayers()
    while (popupContainer.firstChild) {
      popupContainer.removeChild(popupContainer.firstChild);
    }
  },

  renderRacers (racers) {
    this.setState({
      racers: racers.map((racer) => {
        let point = this.calcRacerPosition(racer.distance_in_meters)
        let popup = this.renderPopup(racer).getDOMNode()
        let marker = L.marker(point, { icon: racerIcon })
          .bindPopup(popup)
          .on('click', () => {
            this.handleMarkerClick(racer.id)
          })
        this.state.markers.addLayer(marker)

        return {
          id: racer.id,
          marker
        }
      })
    }, this.racersUpdated)
  },

  renderPopup (racer) {
    let container = document.createElement('div')
    this.state.popupContainer.appendChild(container)
    return React.render(
      <Popup onClick={ this.popupClicked } />,
      container
    )
  },

  render () {
    return <div className="map" ref="map" />
  }
})
