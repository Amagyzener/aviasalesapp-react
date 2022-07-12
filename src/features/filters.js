import { createSlice } from '@reduxjs/toolkit';


export const defaultSelected = [];
export const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		checkedList: defaultSelected,
		indeterminate: false,
		checkAll: true
	},
	reducers: {
		/* Redux Toolkit allows us to write “mutating” logic in reducers. It doesn’t actually mutate the state because it uses the Immer library,
			which detects changes to a “draft state” and produces a brand new immutable state based off those changes */
		setCheckedList: (state, action) => { // action.payload: string[]
			state.checkedList = action.payload;
		},
		setIndeterminate: (state, action) => { // action.payload: boolean
			state.indeterminate = action.payload;
		},
		setCheckAll: (state, action) => { // action.payload: boolean
			state.checkAll = action.payload;
		}
	}
});

// action creators are generated for each case reducer function
export const { setCheckedList, setIndeterminate, setCheckAll } = filtersSlice.actions;
export default filtersSlice.reducer;