import React from 'react';

export default class Navigation extends React.Component {

    render() {

        return (<nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">Docker Dashboard</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Dashboard
                                <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/images">Images</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
    }
}