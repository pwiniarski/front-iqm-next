// Load styles
// import './polyfills/polyfills';
import "@babel/polyfill"

import moment from 'moment';
import React from "react";
import anime from 'animejs'

import { isProduction } from "./utils/constants";

// import { Api } from './api/AppApi';
import { SessionStorage } from './stores/SessionStorage';


// STYLES / CSS
import 'react-tippy/dist/tippy.css';

import 'rc-datepicker/lib/style.css';

import 'react-toastify/dist/ReactToastify.css';
import "./css/app.css";
import {AppStateClass} from "./stores/AppState";

import {enableLogging} from 'mobx-logger';




// import createRouter from './router/create-router5';
// const router = createRouter(true);



import { TextStoreClass } from "./stores/TextsStore";
import { uiStore } from './stores/UiStore';
import { Dictionaries } from './stores/Dictionaries';

import Cookies from 'js-cookie';

import { CartStore } from './stores/CartStore';

import { ImagesStoreClass } from './stores/ImagesStore';

window['jQuery'] = window['$'] = $;


//Api.addMiddleware( SessionStorage.validateSession );


// Middleware przy każdym responsie sprawdza jego status. 
// Jeżeli wyrzuci 500 wyświetli się strona server-error
// Api.addMiddleware( function(middleware){
// 	// debugger;
// 	if( middleware.status >= 500 ){

// 		routerStore.navigate('server_error', {});
// 	}
// });


// debugger;


window.Cookies = Cookies; 

moment.locale('pl');
moment.updateLocale('en', null);
window.moment = moment;


window.anime = anime;



if( !isProduction ){

	enableLogging({
		action: true,
		reaction: false,
		transaction: false,
		compute: false
	});

}


// Mobx Dev tools  <DevTools />
// configureDevtool({
// 	// Turn on logging changes button programmatically:
// 	logEnabled: false,
// 	// Turn off displaying components updates button programmatically:
// 	updatesEnabled: false,
// 	// Log only changes of type `reaction`
// 	// (only affects top-level messages in console, not inside groups)
// 	logFilter: change => change.type === 'reaction',
// });

// const browserHistory = createBrowserHistory(browserHistoryConfig);
// const routingStore = new RouterStore();
// const history = syncHistoryWithStore(browserHistory, routingStore);

// window.routingStore = routingStore;
// window._history = history;
window.routerStore = routerStore;


var store = new AppStateClass({
	router:routerStore.router,
	routerStore,
	uiStore,
	Dictionaries,
});
SessionStorage.setStores({Api, store});
SessionStorage.init().then( data => {

	CartStore.init();

});


Dictionaries.setStore(store);


var TextStore = new TextStoreClass({
	appStore: store
});
var ImagesStore = new ImagesStoreClass({
	appStore: store
});


window.store = store;

window.api = Api;
window.TextStore = TextStore;
window.ImagesStore = ImagesStore;




const renderApp = (App, store) => {
	// startRouter(stores);
	// stores.history = history;
	// stores.router = routingStore;

	render(
		<AppContainer>
			
			<Provider store={store} api={Api} routerStore={routerStore} TextStore={TextStore} uiStore={uiStore}>
				
				<App/>
			</Provider>
			
		</AppContainer>,
		document.getElementById("root")
	);
};

// renderApp(App);

// if (module.hot) {
// 	module.hot.accept(() => renderApp(App));
// }



// var store = createStore(initialState,routingStore);

// Initial render 
renderApp(App, store);


// registerServiceWorker();


 
// Connect HMR 
if (module.hot) {
	// module.hot.accept(["./stores/AppState"], () => {
	// 	// Store definition changed, recreate a new one from old state 
	// 	renderApp(App, createStore(getSnapshot(store),routingStore))
	// }) 
 
	// module.hot.accept(["./api/"], () => {
	// 	// Store definition changed, recreate a new one from old state 
	// 	renderApp(App, createStore(getSnapshot(store),routingStore))
	// }) 
 
	module.hot.accept(["./components/App"], () => {
		// Componenent definition changed, re-render app 
		renderApp(App, store) 
	}) 
} 


