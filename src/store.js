import { configureStore } from '@reduxjs/toolkit';

import sortingReducer from './features/sorting';
import filtersReducer from './features/filters';
import ticketsReducer from './features/tickets';
import ticketsMiddleware from './middleware/ticketsMiddleware';


export default configureStore({
	reducer: {
		sorting: sortingReducer,
		filters: filtersReducer,
		tickets: ticketsReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(ticketsMiddleware.middleware)
});