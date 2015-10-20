'use strict'

import React from 'react'
import GSCLeaderMap from './components/GSCLeaderMap'
import teamResults from '../data/teams.json'

let Example = React.createClass({
  getInitialState () {
    return {
      selectedTeam: ''
    }
  },

  handleTeamSelection (id) {
    this.setState({
      selectedTeam: id
    })
  },

  handleChange (e) {
    this.handleTeamSelection(e.target.value)
  },

  render () {
    return (
      <div>
        <GSCLeaderMap
          onTeamSelection={ this.handleTeamSelection }
          selectedTeam={ this.state.selectedTeam } />

        <div className="leader-list-selector">
          <select
            onChange={ this.handleChange }
            value={ this.state.selectedTeam }>
            { teamResults.results.map((result) => {
                return (
                  <option value={ result.team.id }>
                    { result.team.name }
                  </option>
                )
              }) }
          </select>
        </div>
      </div>
    )
  }
})

React.render(<Example />, document.getElementById('race-map'))

