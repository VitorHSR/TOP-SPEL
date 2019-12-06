import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 bg-primary text-white py-2">
            <img src="images.jpg" alt="Streamer" width="300" className="float-left mx-1" />
            <h1>Streamers Pelotas</h1>
            <h4>Registro de Streamers</h4>
          </div>
        </div>
      </div>
    )
  }
}
