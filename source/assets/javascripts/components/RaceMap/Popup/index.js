import React from 'react'

export default React.createClass({
  formatDistance (distance) {
    return Math.round(distance / 1000)
  },

  fundraisingToGo (team) {
    return `${ 100 - ((100 / team.fundraising_goal) * team.fundraising_current) }%`
  },

  render () {
    let team = this.props.racer
    return (
      <div
        className="gsc-PopupContent"
        onClick={ this.props.onClick }>

        <header className="gsc-PopupContent__header">
          <div className="gsc-PopupContent__avatar" />
          <div className="gsc-PopupContent__summary">
            <h3 className="gsc-PopupContent__title">{ team.name }</h3>
            <div className="gsc-PopupContent__attribute-list">
              <div className="gsc-PopupContent__attribute">
                <span className="gsc-PopupContent__attribute-name">
                  has rode
                </span>
                <span className="gsc-PopupContent__attribute-value">
                  { this.formatDistance(team.distance_in_meters) }km
                </span>
              </div>

              <div className="gsc-PopupContent__attribute">
                <span className="gsc-PopupContent__attribute-name">
                  for
                </span>
                <span className="gsc-PopupContent__attribute-value">
                  { team.charity_name }
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="gsc-PopupContent__progress">
          <div className="gsc-PopupContent__progress-bar">
            <div className="gsc-PopupContent__progress-meter" style={{
              right: this.fundraisingToGo(team)
            }} />
          </div>
          <div className="gsc-PopupContent__progress-summary">
            ${ team.fundraising_current } raised of ${ team.fundraising_goal }
          </div>
        </div>

        <button className="gsc-PopupContent__call-to-action">
          Give to { team.name }
        </button>
      </div>
    )
  }
})
