import React from 'react';
import { NewContainer } from './components/newContainer'
import { ImageList } from './components/imageList'
import * as io from 'socket.io-client';
import { Redirect } from 'react-router';
import {Container} from "./components/containerListItem";

const socket = io.connect('127.0.0.1:3001', () => console.log('Listening on localhost port 3001'))

export default class DockerImage extends React.Component {

    constructor() {
        super()

        this.state = {
            availableImages: [],
            redirectToDashboard: false
        }

        socket.on('images.list', (availableImages: any) => {
            this.setState({
                availableImages: availableImages.map(this.mapImage),
            })
        })
    }

    mapImage(image:any): Container {
        return {
            repository: image.RepoTags,
            id: image.Id,
            created: image.Created,
            size: image.Size
        }
    }

    exists(key:string){
        return this.state.availableImages.some(item => item.repository[0] === key || item.id.includes(key) );
    }

    onRun(name: String, type: String) {
        if (type === 'image'){

            if (this.exists(name)) {
                socket.emit('docker.run', { name: name })
                this.setState({ redirectToDashboard: true })
            } else {
                alert("Image " + name + " does not exist.")
            }

        } else {
            socket.emit('docker.pull', { name: name })
        }
    }

    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;

        if (this.state.redirectToDashboard) {
            return (
                <Redirect to="/"/>
            )
        }
        return (
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
                                <div className="col-md-6">
                                    <h3>Run container from image</h3>
                                    <br/>
                                    <NewContainer id="image" onRun={this.onRun.bind(this)} />
                                </div>
                                <div className="col-md-6">
                                    <h3>Pull new image from dockerhub</h3>
                                    <br/>
                                    <NewContainer id="docker" onRun={this.onRun.bind(this)} />
                                </div>
                            </div>
                            <hr style={{marginBottom: '40px', marginTop:'40px'}}/>
                            <div className="row">
                                <div className="col-md-12">
                                    <h3>Available images in this host</h3>
                                    <br/>
                                    <ImageList images={this.state.availableImages} />
                                </div>
                            </div>
                        </div>
                    )
                }

            </main>
        );
    }
}