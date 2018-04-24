import * as React from 'react'
import * as classNames from 'classnames'
import * as io from 'socket.io-client'
import { Link } from 'react-router-dom';

const socket = io.connect('127.0.0.1:3001', () => console.log('Listening on localhost port 3001'))

class Container {
    id: string;
    name: string;
    image: string;
    network: string;
    state: string;
    status: string;
    ipaddress: string;
    ports: object;
}

export class ContainerListItem extends React.Component<Container, {}> {

    constructor() {
        super()
        this.state = { blinker: "" }
    }

    // Helper method for determining whether the container is running or not
    isRunning() {
        return this.props.state === 'running'
    }

    onActionButtonClick() {
        this.setState({blinker: "blinker"})
        const evt = this.isRunning() ? 'container.stop' : 'container.start'
        socket.emit(evt, { id: this.props.id })
    }

    render() {
        const glyphiconState = this.isRunning() ? 'red' : 'green'
        const glyphiconState2 = this.isRunning() ? 'fa-toggle-on' : 'fa-toggle-off'
        const glyphiconTitle = this.isRunning() ? 'Power ON' : 'Power OFF'
        const glyphiconClass = classNames('power-button','fas', `${glyphiconState2}`, 'pull-right', `${glyphiconState}`, this.state.blinker)
        const ports = this.props.ports[0] ? (this.props.ports[0]['IP'] ? this.props.ports[0]['IP'] : "-") +
            ":" + (this.props.ports[0]['PublicPort'] ? this.props.ports[0]['PublicPort'] : "-") +
            " -> " + this.props.ports[0]['PrivatePort'] +
            "/" + this.props.ports[0]['Type']
            : "";

        return (
            <tr>
                <td><Link to={'/container/'+this.props.id}>{ this.props.name }</Link></td>
                <td>{ this.props.status }</td>
                <td>{ this.props.image }</td>
                <td>{ this.props.ipaddress }</td>
                <td>{ ports }</td>

                <td><i style={{fontSize: '22px'}} title={ glyphiconTitle } className={ glyphiconClass } onClick={this.onActionButtonClick.bind(this)}></i></td>
            </tr>
        )
    }
}