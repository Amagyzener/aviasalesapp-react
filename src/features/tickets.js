import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { sendRequest } from '../_utils';


export const fetchTickets = createAsyncThunk(
	'fetchTickets',
	async (_, { dispatch, getState, signal }) => {
		dispatch(clear()); // erase existing data
		if (!getState().filters.checkedList.length) return; // return as there are no filtering criteria

		let sId = await sendRequest('https://aviasales-test-api.kata.academy/search', { signal });
		let stop = false;
		while (!stop) {
			if (signal.aborted) throw new Error('Request has been aborted');
			const filters = getState().filters.checkedList;
			let dataPacket = await sendRequest(`https://aviasales-test-api.kata.academy/tickets?searchId=${sId.searchId}`, { signal }, 5);
			if (dataPacket.stop || signal.aborted || !filters.length) stop = true;
			dataPacket.tickets = dataPacket.tickets.filter((ticket) => {
				return ticket.segments.some((segment) => {
					return filters.indexOf(segment.stops.length) != -1;
				})
			});

			if (signal.aborted) throw new Error('Request has been aborted');
			dispatch(providePacket(dataPacket.tickets));
		}
		//console.log(getState().tickets.value);
	}
);

export const ticketsSlice = createSlice({
	name: 'tickets',
	initialState: {
		loading: false,
		error: null,
		value: []
	},
	reducers: {
		/* Redux Toolkit allows us to write “mutating” logic in reducers. It doesn’t actually mutate the state because it uses the Immer library,
			which detects changes to a “draft state” and produces a brand new immutable state based off those changes. */
		providePacket: (state, action) => {
			state.value = state.value.concat(action.payload);
		},
		sort: (state, action) => {
			state.value = state.value.sort((a, b) => {
				let f1 = 0, f2 = 0;
				switch (action.payload) {
					case 'optimal':
						/* falls through */
					case 'cheap':
						f1 = a.price - b.price;
						if (action.payload != 'optimal') break;
						/* falls through */
					case 'fast': {
						for (let i = 0; i < a.segments.length; i++)
							f2 += a.segments[i].duration - b.segments[i].duration;
						break;
					}
					default:
						throw new Error('Invalid sort criterion');
				}
				return f1 + f2;
			});
		},
		clear: (state) => {
			state.value = [];
		}
	},
	extraReducers: /* (builder) => */ {
		/* builder.addCase(fetchTickets.pending, (state) => {
			state.loading = true;
		}), */
		[fetchTickets.pending]: (state) => {
			state.loading = true;
			state.error = null;
			//console.log('Pending...');
		},
		[fetchTickets.fulfilled]: (state) => {
			state.loading = false;
			//console.log('Fulfilled!');
		},
		[fetchTickets.rejected]: (state, action) => {
			/* If the promise failed and was not handled with 'rejectWithValue',
				dispatch the rejected action with a serialized version of the error value as 'action.error'. */
			if (action.error.name != 'AbortError') {
				state.loading = false;
				state.error = action.error.message;
				console.error('Rejected!\n%s: %s', action.error.name, action.error.message);
			}
		}
	}
});

// action creators are generated for each case reducer function
export const { providePacket, sort, clear } = ticketsSlice.actions;
export default ticketsSlice.reducer;