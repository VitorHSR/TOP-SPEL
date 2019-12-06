import React, { Component } from 'react'
import Conecta from './Conecta'

export default class Registro extends Component {
  state = {
    nome: '',
    link: '',
    foto: '',
    reg: '',
    aviso: ''
  }

  componentDidMount() {
    this.initialState = this.state
  }

  limpar = () => {
    this.setState(this.initialState)
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  habilitarCamera = async () => {
    // Obtém acesso à câmera...
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

      await navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (mediaStream) {
          var video = document.getElementById('video')
          video.style.visibility = "visible"
          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch(function (err) { console.log(err.name + ": " + err.message); });
    }
  }

  capturarFoto = () => {
    var canvas = document.getElementById('canvas')
    var video = document.getElementById('video')

    var context = canvas.getContext('2d')

    context.drawImage(video, 0, 0, 320, 240)

    video.pause()
    video.style.visibility = "hidden"

    this.setState({ foto: canvas.toDataURL("image/png") })
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.state.nome === '' || this.state.link === '' || this.state.foto === '') {
      this.setState({ aviso: 'Por favor, preencha nome, link da plataforma de stream e foto' })
      this.tempoAviso()
      return
    }

    const formData = new FormData()
    formData.append('nome',this.state.nome)
    formData.append('link',this.state.link)
    formData.append('foto',this.state.foto)

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    try {
      const reg = await Conecta.post('inc_streamer.php', formData, config)
      this.limpar()
      this.setState({reg});
      this.setState({ aviso: `Ok! Streamer cadastrado com sucesso` })
    } catch (erro) {
      this.setState({ aviso: `Erro... Streamer não cadastrado: ${erro}` })
    }

    this.tempoAviso()
  }

  tempoAviso = (tempo = 3000) => {
    setTimeout(() => {
      this.setState({ aviso: '' })
    }, tempo)
  }

  render() {
    return (
      <form className="mx-4 mt-3" onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="nome">Nome do Stramer:</label>
              <input type="text" className="form-control" autoFocus
                name="nome" id="nome"
                onChange={this.handleChange}
                value={this.state.nome} />
            </div>
            <div className="form-group">
              <label htmlFor="link">Link da plataforma de stream:</label>
              <input type="text" className="form-control"
                name="link" id="link"
                onChange={this.handleChange}
                value={this.state.link} />
            </div>
            <div className="row">
              <div className="col-sm-4">
                <input type="reset" className="btn btn-success btn-block mt-1"
                  onClick={this.habilitarCamera} value="Habilitar Câmera" />
              </div>
              <div className="col-sm-4">
                <input type="reset" className="btn btn-danger btn-block mt-1"
                  onClick={this.limpar} value="Limpar" />
              </div>
              <div className="col-sm-4">
                <input type="submit" className="btn btn-primary btn-block mt-1"
                  value="Gravar" />
              </div>
            </div>
            {this.state.aviso !== '' ?
            <div className='alert alert-info mt-4'>
              {this.state.aviso}
            </div>
            : ''
          }
          </div>
          <div className="col-sm-6">
            <video id="video" width="320" height="240"></video>
            <canvas id="canvas" width="320" height="240"></canvas>

            <input type="button" className="btn btn-danger float-right mt-3 px-5"
              onClick={this.capturarFoto} value="Capturar Foto" />
          </div>
        </div>
      </form >
    )
  }
}
