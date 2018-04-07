const docker = require('./DockerAPI')
const io = require('./server').io
const { CONTAINERS_LIST, CONTAINER_START, CONTAINER_STOP, IMAGE_RUN, IMAGE_ERROR } = require('./src/Events')

function refreshContainers() {
    docker.listContainers({ all: true}, (err, containers) => {
        io.emit(CONTAINERS_LIST, containers)
    })
}

setInterval(refreshContainers, 2000)

module.exports = function(socket) {

        socket.on(CONTAINERS_LIST, () => {
            refreshContainers()
        })

        socket.on(CONTAINER_START, args => {
            const container = docker.getContainer(args.id)

            if (container) {
                container.start((err, data) => refreshContainers())
                console.log(`Starting container: ${args.id}`)
            }
        })

        socket.on(CONTAINER_STOP, args => {
            const container = docker.getContainer(args.id)

            if (container) {
                container.stop((err, data) => refreshContainers())
                console.log(`Stopping container: ${args.id}`)
            }
        })

        socket.on(IMAGE_RUN, args => {
            docker.createContainer({Image: args.name}, (err, container) => {
                if (!err)
                    container.start((err, data) => {
                        if (err)
                            socket.emit(IMAGE_ERROR, {message: err})
                    })
                else
                    socket.emit(IMAGE_ERROR, {message: err})
            })
        })

}