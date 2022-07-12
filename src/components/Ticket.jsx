import React from 'react';
//import PropTypes from 'prop-types';
import { Col, Row } from 'antd';

import 'antd/dist/antd.css';
import css from './Ticket.module.scss';


export default function Ticket({ data }) {
	let timeRaw, dateRaw_start, dateRaw_end, stops;

	timeRaw = data.from.duration / 60;
	const from_duration = `${timeRaw | 0} ч ${timeRaw % 1 * 60 | 0} мин`;
	timeRaw = data.to.duration / 60;
	const to_duration = `${timeRaw | 0} ч ${timeRaw % 1 * 60 | 0} мин`;

	function getMinutes_f(date) {
		const minutes = date.getMinutes();
		return minutes < 10 ? '0' + minutes : minutes;
	}

	dateRaw_start = new Date(data.from.date);
	dateRaw_end = new Date(dateRaw_start.valueOf() + data.from.duration * 100 * 60);
	const from_time = `${dateRaw_start.getHours()}:${getMinutes_f(dateRaw_start)} – ${dateRaw_end.getHours()}:${getMinutes_f(dateRaw_end)}`;
	dateRaw_start = new Date(data.to.date);
	dateRaw_end = new Date(dateRaw_start.valueOf() + data.to.duration * 100 * 60);
	const to_time = `${dateRaw_start.getHours()}:${getMinutes_f(dateRaw_start)} – ${dateRaw_end.getHours()}:${getMinutes_f(dateRaw_end)}`;

	stops = data.from.stops.length;
	const from_stopsLabel = `${stops || 'Без'} ${'пересад' + (['ок', 'ка'][stops] ?? 'ки')}`;
	stops = data.to.stops.length;
	const to_stopsLabel = `${stops || 'Без'} ${'пересад' + (['ок', 'ка'][stops] ?? 'ки')}`;

	return (
		<div className={css.main__ticket}>
			<div className={`${css['main__ticket-cap']} ${css['block-caption']}`}>
				<span>{`${data.price} ₽`}</span>
				<img src={`https://pics.avs.io/99/36/${data.carrier}.png`} alt={data.carrier} height='36'></img>
			</div>
			<Row gutter={[20, 10]}>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>{`${data.from.origin} – ${data.from.destination}`}</span>
						<span>{from_time}</span>
					</div>
				</Col>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>В пути</span>
						<span>{from_duration}</span>
					</div>
				</Col>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>{from_stopsLabel}</span>
						<span>{data.from.stops.join(', ') || '–'}</span>
					</div>
				</Col>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>{`${data.to.origin} – ${data.to.destination}`}</span>
						<span>{to_time}</span>
					</div>
				</Col>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>В пути</span>
						<span>{to_duration}</span>
					</div>
				</Col>
				<Col className='gutter-row' span={8}>
					<div className={css['main__ticket-info']}>
						<span>{to_stopsLabel}</span>
						<span>{data.to.stops.join(', ') || '–'}</span>
					</div>
				</Col>
			</Row>
		</div>
	);
}

Ticket.defaultProps = {
	data: {
		carrier: '',
		price: 0,
		from: {
			date: new Date,
			destination: '?',
			duration: 0,
			origin: '?',
			stops: []
		},
		to: {
			date: new Date,
			destination: '?',
			duration: 0,
			origin: '?',
			stops: []
		}
	}
};

/* Ticket.propTypes = {
	poster_path: PropTypes.string,
	vote_average: PropTypes.number,
	title: PropTypes.string,
	release_date: PropTypes.string,
	genre_ids: PropTypes.array,
	overview: PropTypes.string,
	id: PropTypes.number
}; */