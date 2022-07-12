import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Radio, Spin, Empty, Result } from 'antd';

import { fetchTickets, sort } from './features/tickets';
import * as filters_actions from './features/filters';
import { defaultSelected } from './features/filters';
import * as sorting_actions from './features/sorting';
import NetworkDetector from './hoc/NetworkDetector';
import Ticket from './components/Ticket';
import 'antd/dist/antd.css';
import css from './App.module.scss';


// (global) a Promise object created on 'fetchTickets()' dispatch (it is needed to interrupt ongoing requests)
let promise; // Promise { <pending|fulfilled|rejected>: {…}, arg, requestId, abort(), unwrap() }

function App() {
	const filters_render = [
		{ label: 'Без пересадок', value: 0 },
		{ label: '1 пересадка', value: 1 },
		{ label: '2 пересадки', value: 2 },
		{ label: '3 пересадки', value: 3 },
	];
	const filters_all = Array.from(filters_render, (x) => x.value);
	//const defaultSelected = ['wo', 'w1', 'w2', 'w3'];

	const dispatch = useDispatch();
	const filters_checked = useSelector((state) => state.filters.checkedList);
	const filters_indeterminate = useSelector((state) => state.filters.indeterminate);
	const filters_checkAll = useSelector((state) => state.filters.checkAll);
	/* const [checkedList, setCheckedList] = useState(defaultSelected);
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(true); */
	const sorting_criterion = useSelector((state) => state.sorting.criterion);
	const tickets = useSelector((state) => state.tickets.value);
	const tickets_loading = useSelector((state) => state.tickets.loading);
	const tickets_error = useSelector((state) => state.tickets.error);

	/* UI init */
	const tickets_render = tickets.slice(0, 10).map((ticket, index) => {
		const { carrier, price } = ticket;
		const [from, to] = [ticket.segments[0], ticket.segments[1]];

		return <Ticket key={`t${index + 1}`} data={{ carrier, price, from, to }} />;
	});

	const msg_empty = (
		<Empty
			image={Empty.PRESENTED_IMAGE_DEFAULT}
			imageStyle={{ height: 100 }}
			description={<span>Рейсов, подходящих под заданные фильтры, не найдено.</span>}
		/>
	);

	const msg_error = (
		<Result
			status='error'
			title='Ошибка операции'
			subTitle='Проверьте интернет-соединение и попробуйте снова.'
			extra={tickets_error}
		/>
	);

	const spinner = (
		<div className='centering-container' style={{ marginBottom: '15px' }}>
			<Spin size='large' />
		</div>
	);

	/* Handlers */
	const filtersOnCheck = (list) => {
		dispatch(filters_actions.setCheckedList(list));
		dispatch(filters_actions.setIndeterminate(list.length && list.length < filters_all.length));
		dispatch(filters_actions.setCheckAll(list.length === filters_all.length));
		/* setCheckedList(list);
		setIndeterminate(list.length && list.length < defaultSelected.length);
		setCheckAll(list.length === defaultSelected.length); */
	};

	const filtersOnCheckAll = (e) => {
		dispatch(filters_actions.setCheckedList(e.target.checked ? filters_all : []));
		dispatch(filters_actions.setIndeterminate(false));
		dispatch(filters_actions.setCheckAll(e.target.checked));
		/* setCheckedList(e.target.checked ? defaultSelected : []);
		setIndeterminate(false);
		setCheckAll(e.target.checked); */
	};

	const sortingOnChange = (e) => {
		dispatch(sorting_actions.setCriterion(e.target.value));
	};

	// fetch on start-up (didMount)
	useEffect(() => {
		filtersOnCheck(defaultSelected);
	}, []);

	// fetch on update #1 (didUpdate)
	useEffect(() => {
		if (promise) promise.abort('Filters change'); // abort the current fetching loop
		promise = dispatch(fetchTickets()); // store a Promise object to be able to interrupt requests
	}, [filters_checked]);

	// fetch on update #2 (didUpdate)
	useEffect(() => {
		dispatch(sort(sorting_criterion));
	}, [sorting_criterion]);

	return (
		<>
			<div className={css.logo}>
				<img src='/logo.png' />
			</div>
			<section className={css.main}>
				<aside className={css.main__filters}>
					<div className={css['block-caption']}>Количество пересадок</div>
					<Checkbox indeterminate={filters_indeterminate} onChange={filtersOnCheckAll} checked={filters_checkAll}>
						Все
					</Checkbox>
					<Checkbox.Group options={filters_render} value={filters_checked} onChange={filtersOnCheck} />
				</aside>
				<div className={css.main__body}>
					<Radio.Group value={sorting_criterion} buttonStyle='solid' style={{ marginBottom: 20, width: '100%' }} onChange={sortingOnChange}>
						<Radio.Button value='cheap'>Самый дешёвый</Radio.Button>
						<Radio.Button value='fast'>Самый быстрый</Radio.Button>
						{/* <Radio.Button value='optimal'>Оптимальный</Radio.Button> */}
					</Radio.Group>
					{tickets_loading && spinner || null}
					{!tickets_loading && tickets_error && msg_error || null}
					{tickets_render.length && tickets_render || !tickets_loading && !tickets_error && msg_empty}
				</div>
			</section>
		</>
	);
}

export default NetworkDetector(App);
