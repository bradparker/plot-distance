'use strict'

import React from 'react'
import RaceMap from './components/RaceMap'

import route from '../data/route.json'

let riders1 = [
  {
    id: 1,
    distance_in_meters: 4567895
  },
  {
    id: 2,
    distance_in_meters: 2567895
  },
  {
    id: 3,
    distance_in_meters: 1567895
  },
  {
    id: 4,
    distance_in_meters: 4567895
  },
  {
    id: 5,
    distance_in_meters: 4136895
  }
]

let riders2 = [
  {
    id: 6,
    distance_in_meters: 2567895
  },
  {
    id: 7,
    distance_in_meters: 4567895
  },
  {
    id: 8,
    distance_in_meters: 3567895
  },
  {
    id: 9,
    distance_in_meters: 1567895
  },
  {
    id: 10,
    distance_in_meters: 4136895
  }
]

let Example = React.createClass({
  getInitialState () {
    return {}
  },
  render () {
    return (
      <div>
        <RaceMap
          route={ route }
          racers={ this.state.riders || riders1 }
          selectedRacer={ 2 } />
        <div className="leader-list-selector">
          <button onClick={ () => { this.setState({ riders: riders1 }) } }>Riders 1</button>
          <button onClick={ () => { this.setState({ riders: riders2 }) } }>Riders 2</button>
        </div>
      </div>
    )
  }
})

React.render(<Example />, document.getElementById('race-map'))

