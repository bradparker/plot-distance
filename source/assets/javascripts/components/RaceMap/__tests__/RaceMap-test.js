'use strict'

import dom from 'mocha-jsdom'
import { expect } from 'chai'
import React from 'react/addons'
import route from '../../../../data/route.json'
const TestUtils = React.addons.TestUtils

dom()
let RaceMap

describe('RaceMap', () => {
  before(() => {
    // I know this looks crazy, but we need to stub the hell outta this thing for jsdom
    global.L = require('leaflet')
    global.L.Map.prototype.getSize = function () {
      if (!this._size || this._sizeChanged) {
        this._size = new L.Point(1000, 800)
        this._sizeChanged = false;
      }
      return this._size.clone()
    }
    global.L.Map.prototype.getPixelOrigin = function () {
      return new L.Point(0, 0)
    }
    RaceMap = require('../')
  })
  describe('initialisation', () => {
    it('mounts a leaflet map on it\'s container', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
        route: route
      }))
      let subject = element.getDOMNode()._leaflet
      expect(subject).to.be.ok
    })

    it('sets the rendered map to state.map', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
        route: route
      }))
      let subject = element.state.map
      expect(subject).to.be.an.instanceof(L.Map)
    })

    it('creates a feature group to house markers and sets it to state.markers', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
        route: route
      }))
      let subject = element.state.markers
      expect(subject).to.be.an.instanceof(L.FeatureGroup)
    })
  })

  describe('renderRacers()', () => {
    it('creates a marker for each provided racer', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
        route: route,
        racers: [
          {
            id: 1,
            distance_in_meters: 0
          },
          {
            id: 2,
            distance_in_meters: 2
          }
        ]
      }))

      let subject = element.state.markers.getLayers().length
      expect(subject).to.eq(2)
    })

    describe('each marker', () => {
      it('is an instance of Leaflet Marker', () => {
        let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
          route: route,
          racers: [
            {
              id: 1,
              distance_in_meters: 1
            }
          ]
        }))

        let subject = element.state.markers.getLayers()[0]
        expect(subject).to.be.an.instanceof(L.Marker)
      })
    })
  })
})
