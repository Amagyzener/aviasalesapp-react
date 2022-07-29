import { createListenerMiddleware } from '@reduxjs/toolkit';

import { providePacket, sort } from '../features/tickets';

// Create the middleware instance and methods
const ticketsMiddleware = createListenerMiddleware();

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
ticketsMiddleware.startListening({
	// когда происходит действие 'providePacket', следом за ним запускается сортировка дополненных данных
	actionCreator: providePacket,
	effect: async (action, listenerApi) => {
		listenerApi.dispatch(sort(listenerApi.getState().sorting.criterion));
	},
});

/* listenerMiddleware.startListening({
	matcher: isAnyOf(todoAdded, todoToggled),
	effect: async () => {}
}); */

export default ticketsMiddleware;
