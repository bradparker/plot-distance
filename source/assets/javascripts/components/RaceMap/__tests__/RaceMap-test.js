'use strict'

import dom from 'mocha-jsdom'
import { expect } from 'chai'
import React from 'react/addons'
const TestUtils = React.addons.TestUtils

dom()
let L
let RaceMap

describe('RaceMap', () => {
  before(() => {
    L = require('leaflet')
    RaceMap = require('../')
  })
  describe('initialisation', () => {
    it('mounts a leaflet map on it\'s container', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap))
      let subject = element.getDOMNode()._leaflet
      expect(subject).to.be.ok
    })

    it('sets the rendered map to state.map', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap))
      let subject = element.state.map
      expect(subject).to.be.an.instanceof(L.Map)
    })

    it('creates a feature group to house markers and sets it to state.markers', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap))
      let subject = element.state.markers
      expect(subject).to.be.an.instanceof(L.FeatureGroup)
    })
  })

  describe('renderRacers()', () => {
    it('creates a marker for each provided racer', () => {
      let element = TestUtils.renderIntoDocument(React.createElement(RaceMap, {
        racers: [
          {
            id: 1,
            distance_in_meters: 1
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
