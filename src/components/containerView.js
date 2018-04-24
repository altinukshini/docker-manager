import * as React from 'react'
import * as io from "socket.io-client";
import { Redirect } from 'react-router'

const socket = io.connect('127.0.0.1:3001')

export default class ContainerView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            container: null,
            blinker: "",
            redirect: false
        }

        socket.emit('container.get', { id: this.props.match.params.id })

        socket.on('container.get', (container: any) => {
            if (container) {
                this.setState({
                    container: container
                })
            }else {
                this.setState({
                    redirect: true
                })
            }
        })

    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        let element = null;

        if (this.state.redirect) {
            return (
                <Redirect to="/"/>
            )
        }

        if (this.state.container) {

            var portConfig = ""
            for (var prop in this.state.container.NetworkSettings.Ports) {
                if (prop) {
                    portConfig += prop + " -> " +
                        this.state.container.NetworkSettings.Ports[prop][0].HostIp + "/" +
                        this.state.container.NetworkSettings.Ports[prop][0].HostPort;
                }else{
                    portConfig += prop + "<br />";
                }
            }

            element = (
                <main className="container" role="main">
                    {
                        !isAuthenticated() && (
                            <h4>
                                You are not logged in! Please{' '}
                                <a href="#" style={{ cursor: 'pointer' }} onClick={this.login.bind(this)}>Log In</a>
                                {' '}to continue.
                            </h4>
                        )
                    }
                    {
                        isAuthenticated() && (
                            <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button style={{ cursor: 'pointer', float: 'right', marginTop: '-20px', marginBottom: '20px' }} type="button" className="btn btn-link" onClick={this.logout.bind(this)}>Log out</button>
                                    </div>
                                    <div className="col-md-12">
                                        <h1>{this.state.container.Name.substr(1)}</h1>
                                        <br/>
                                        <div className="container">
                                            <dl className="row">
                                                <div className="col-md-12">
                                                    <h5>Container State</h5>
                                                </div>
                                                <dt className="col-md-3">ID</dt>
                                                <dd className="col-md-9">{this.state.container.Id}</dd>

                                                <dt className="col-md-3">Status</dt>
                                                <dd className="col-md-9">{this.state.container.State.Status}</dd>

                                                <dt className="col-md-3">Running</dt>
                                                <dd className="col-md-9">{this.state.container.State.Running ? 'true' : 'false'}</dd>

                                                <dt className="col-md-3">PID</dt>
                                                <dd className="col-md-9">{this.state.container.State.Pid}</dd>

                                                <dt className="col-md-3">Started At</dt>
                                                <dd className="col-md-9">{this.state.container.State.StartedAt}</dd>

                                                <dt className="col-md-3">Created At</dt>
                                                <dd className="col-md-9">{this.state.container.Created}</dd>
                                            </dl>
                                        </div>
                                        <div className="container">
                                            <dl className="row">
                                                <div className="col-md-12">
                                                    <h5>Container details</h5>
                                                </div>
                                                <dt className="col-md-3">Image</dt>
                                                <dd className="col-md-9">{this.state.container.Config.Image}</dd>

                                                <dt className="col-md-3">Image ID</dt>
                                                <dd className="col-md-9">{this.state.container.Image}</dd>

                                                <dt className="col-md-3">Hostname</dt>
                                                <dd className="col-md-9">{this.state.container.Config.Hostname}</dd>

                                                <dt className="col-md-3">CMD</dt>
                                                <dd className="col-md-9">{this.state.container.Config.Cmd}</dd>

                                                <dt className="col-md-3">Env</dt>
                                                <dd className="col-md-9">{this.state.container.Config.Env.toString()}</dd>
                                            </dl>
                                        </div>
                                        <div className="container">
                                            <dl className="row">
                                                <div className="col-md-12">
                                                    <h5>Network</h5>
                                                </div>
                                                <dt className="col-md-3">Bridge</dt>
                                                <dd className="col-md-9">{this.state.container.NetworkSettings.Bridge}</dd>

                                                <dt className="col-md-3">Gateway</dt>
                                                <dd className="col-md-9">{this.state.container.NetworkSettings.Gateway}</dd>

                                                <dt className="col-md-3">IP Address</dt>
                                                <dd className="col-md-9">{this.state.container.NetworkSettings.IPAddress}</dd>

                                                <dt className="col-md-3">Port configuration</dt>
                                                <dd className="col-md-9">{ portConfig }</dd>

                                                <dt className="col-md-3">MacAddress</dt>
                                                <dd className="col-md-9">{this.state.container.NetworkSettings.MacAddress}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </main>
            )
        }

        return element;
    }
}