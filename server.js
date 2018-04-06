// const express = require('express')
// const path = require('path')
// const app = express()
// const server = require('http').Server(app)
const io = require('socket.io')()
const Docker = require("dockerode");
// const docker = require('./dockerapi')

// Use the environment port if available, or default to 3000
const port = process.env.PORT || 3001

// Serve static files from /public
// app.use(express.static('public'))

// Create an endpoint which just returns the index.html page
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// Start the server
// server.listen(port, () => console.log(`Server started on port ${port}`))

io.listen(port);
console.log('listening on port ', port);


const isWindows = process.platform === "win32";

var options = {};

if (isWindows) {
    options = {
        host: '127.0.0.1',
        port: 2375
    }
} else {
    options = {
        socketPath: '/var/run/docker.sock'
    }
}

const docker = new Docker(options);

setInterval(refreshContainers, 2000)

function refreshContainers() {
    docker.listContainers({ all: true}, (err, containers) => {
        io.emit('containers.list', containers)
        // console.log(containers)
    })
}

io.on('connection', socket => {

    socket.on('containers.list', () => {
        refreshContainers()
    })

    socket.on('container.start', args => {
        const container = docker.getContainer(args.id)

        if (container) {
            container.start((err, data) => refreshContainers())
        }
    })

    socket.on('container.stop', args => {
        const container = docker.getContainer(args.id)

        if (container) {
            container.stop((err, data) => refreshContainers())
        }
    })

})