const docker = require('./DockerAPI')
const io = require('./server').io
const { CONTAINERS_LIST, IMAGES_LIST, CONTAINER_START, CONTAINER_STOP, DOCKER_RUN, DOCKER_PULL } = require('./src/Events')

function refreshContainers() {
    docker.listContainers({ all: true}, (err, containers) => {
        io.emit(CONTAINERS_LIST, containers)
    })
}

function refreshImages() {
    docker.listImages({ all: true}, (err, availableImages) => {
        io.emit(IMAGES_LIST, availableImages)
    })
}

setInterval(refreshContainers, 2000)
setInterval(refreshImages, 2000)

module.exports = function(socket) {

        socket.on(CONTAINERS_LIST, () => {
            refreshContainers()
        })

        socket.on(IMAGES_LIST, () => {
            refreshImages()
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

        socket.on(DOCKER_RUN, args => {
            docker.run(args.name, [], [process.stdout, process.stderr], {Tty:false}, function (err, data, container) {
                console.log(data);
                console.log(err);
            });
        })

        socket.on(DOCKER_PULL, args => {
            docker.pull(args.name, function(err, stream) {
                docker.modem.followProgress(stream, onFinished, onProgress);

                function onFinished(err, output) {
                    console.log(output)
                }
                function onProgress(event) {
                    console.log(event)
                }
            });
        })

}