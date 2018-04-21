import React from 'react';
import { Container } from './components/containerListItem';
import { ContainerList } from './components/containerList';

import * as _ from 'lodash';
import * as io from 'socket.io-client';

const socket = io.connect('localhost:3001')

class AppState {
    containers: Container[]
    stoppedContainers: Container[]
}

export default class Body extends React.Component<{}, AppState> {

    constructor() {
        super()
        this.state = {
            containers: [],
            stoppedContainers: []
        }

        socket.on('containers.list', (containers: any) => {

            const partitioned = _.partition(containers, (c: any) => c.State === "running")

            this.setState({
                containers: partitioned[0].map(this.mapContainer),
                stoppedContainers: partitioned[1].map(this.mapContainer)
            })
        })
    }

    mapContainer(container:any): Container {
        return {
            id: container.Id,
            name: _.chain(container.Names)
                .map((n: string) => n.substr(1))
                .join(", ")
                .value(),
            network: container.HostConfig['NetworkMode'],
            state: container.State,
            status: `${container.State} (${container.Status})`,
            image: container.Image,
            ipaddress: container.NetworkSettings.Networks.bridge.IPAddress,
            ports: container.Ports
        }
    }

    componentDidMount() {
        socket.emit('containers.list')
    }

    onRunImage(name: String) {
        socket.emit('image.run', { name: name })
    }

    render() {
        return (
            <main className="container" role="main">
                <div className="row">
                    <div className="col-md-12">
                        <h3>Running Containers</h3>
                        <br/>
                        <ContainerList containers={this.state.containers} />
                    </div>
                </div>
                <br/>
                <hr/>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Stopped Containers</h3>
                        <br/>
                        <ContainerList containers={this.state.stoppedContainers} />
                    </div>
                </div>
            </main>
        );
    }
}


