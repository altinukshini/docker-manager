import * as React from 'react'
import Header from './Header'
import Footer from './Footer'
import Dashboard from './Dashboard'
import {BrowserRouter, Route, Switch} from 'react-router-dom'



export class AppComponent extends React.Component {

    render() {
        return (
            <div>
                <Header/>

                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={() => <Dashboard/>} />
                    </Switch>
                </BrowserRouter>

                <Footer/>
            </div>
        );
    }
}