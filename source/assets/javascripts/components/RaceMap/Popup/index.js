import React from 'react'

export default React.createClass({
  render () {
    return (
      <div onClick={ this.props.onClick }>
        HEY
      </div>
    )
  }
})
