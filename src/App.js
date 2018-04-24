import * as React from 'react'
import Header from './Header'
import Footer from './Footer'
import Dashboard from './Dashboard'
import DockerImages from './DockerImages'
import ContainerView from './components/containerView'
import {Router, Route, Switch} from 'react-router-dom'

import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
}

export class AppComponent extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <Router history={history} {...this.props}>
                    <Switch>
                        <Route exact path="/" component={(props) => <Dashboard auth={auth} {...props}/>} />
                        <Route exact path="/images" component={(props) => <DockerImages auth={auth} {...props}/>} />
                        <Route exact path="/container/:id" component={(props) => <ContainerView auth={auth} {...props}/>} />
                        <Route path="/callback" render={(props) => {
                            handleAuthentication(props);
                            return <Callback {...props} />
                        }}/>
                    </Switch>
                </Router>
                <Footer/>
            </div>
        );
    }
}