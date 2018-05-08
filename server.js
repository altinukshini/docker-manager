let express = require('express')
let path = require('path')
let app = express()
let server = require('http').Server(app)
let io = module.exports.io = require('socket.io')(server)

let port = process.env.PORT || 3001

app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

// Start the server
server.listen(port, () => console.log(`Node server started on port ${port}`))
