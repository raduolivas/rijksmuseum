import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import   Events  from './pages/Events';
export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={ Events } />
            </Switch>
        </BrowserRouter>
    )
}
