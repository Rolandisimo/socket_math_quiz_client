import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
    applyMiddleware,
    combineReducers,
    createStore,
    Store,
} from "redux";
import thunk from "redux-thunk";

import { subscribePlayer, listenGameState, listenQuizStart } from "./api/api";
import { commonReducer } from "./ducks/common";
import { App } from "./App";

const reducers = combineReducers({
    common: commonReducer,
});

const store: Store<any> = createStore(
    reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
        thunk,
    ),
);

subscribePlayer(store.dispatch);
listenGameState(store.dispatch);
listenQuizStart(store.dispatch);

ReactDOM.render(
    (
        <Provider store={store}>
            <App />
        </Provider>
    ),
    document.getElementById("gameRoot"),
);
