import * as React from 'react'
import * as classNames from 'classnames'
import * as io from 'socket.io-client'

const socket = io.connect('127.0.0.1:3001', () => console.log('Listening on localhost port 3001'))

interface Container {
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
        const panelClass = this.isRunning() ? 'success' : 'default'
        const classes = classNames('panel', `panel-${panelClass}`)
        const buttonText = this.isRunning() ? 'Stop' : 'Start'
        const buttonType = this.isRunning() ? 'btn-danger' : 'btn-success'
        const glyphiconState = this.isRunning() ? 'red' : 'green'
        const glyphiconClass = classNames('power-button','glyphicon', 'glyphicon-off', 'pull-right', `${glyphiconState}`, this.state.blinker)
        const buttonClass = classNames('btn', `${buttonType}`, this.state.blinker)
        const ports = this.props.ports[0] ? this.props.ports[0]['IP'] +
            ":" + this.props.ports[0]['PublicPort'] +
            " -> " + this.props.ports[0]['PrivatePort'] +
            "/" + this.props.ports[0]['Type']
            : "";

        return (
            <div className="col-md-6">
                <div className={ classes }>
                    <div className="panel-heading">
                        { this.props.name }
                        <span className={ glyphiconClass } onClick={this.onActionButtonClick.bind(this)}></span>
                    </div>
                    <div className="panel-body">
                        <b>ID</b>: {this.props.id}<br/>
                        <b>Status</b>: {this.props.status}<br/>
                        <b>Image</b>: {this.props.image}
                        <hr/>
                        <b>Network</b>: {this.props.network}<br/>
                        <b>IP Address</b>: {this.props.ipaddress}<br/>
                        <b>Ports</b>: { ports}
                    </div>
                    <div className="panel-footer">
                        <button onClick={this.onActionButtonClick.bind(this)} className={ buttonClass }>{buttonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}