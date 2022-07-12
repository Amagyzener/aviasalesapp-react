import { createSlice } from '@reduxjs/toolkit';


export const sortingSlice = createSlice({
	name: 'sorting',
	initialState: {
		criterion: 'cheap' // 'cheap' | 'fast'
	},
	reducers: {
		/* Redux Toolkit allows us to write “mutating” logic in reducers. It doesn’t actually mutate the state because it uses the Immer library,
			which detects changes to a “draft state” and produces a brand new immutable state based off those changes */
		setCriterion: (state, action) => { // action.payload: string
			state.criterion = action.payload;
		}
	}
});

// action creators are generated for each case reducer function
export const { setCriterion } = sortingSlice.actions;
export default sortingSlice.reducer;