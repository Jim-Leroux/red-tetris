import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import WebSocketProvider from './context/WebSocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>

		<BrowserRouter>
			<WebSocketProvider>
				<Provider store={store}>
					<App />
				</Provider>
			</WebSocketProvider>
		</BrowserRouter>

	// </React.StrictMode>
);

