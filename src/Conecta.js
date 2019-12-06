import axios from 'axios'

const Conecta = axios.create({baseURL: 'http://streamerspel.000webhostapp.com/'})

export default Conecta