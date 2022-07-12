
class RequestError extends Error {
	constructor(message) {
		super(message);
		this.name = 'RequestError';
	}
}
class AttemptsExceededError extends Error {
	constructor(message) {
		super(message);
		this.name = 'AttemptsExceededError';
	}
}

export async function sendRequest(request, params = {}, attempts = 1) { // : Object<JSON>
	try {
		const response = await fetch(request, params);
		console.warn(
			`Requesting %s\nattempts left: %i | ${response.ok && 'content length: %s bytes' || 'failed'}`,
			request, attempts, response.headers.get('Content-Length') || ''
		);
		if (!response.ok)
			throw new RequestError(`Couldn’t fetch ${response.url} (status ${response.status})`);
		if (attempts == 0)
			throw new AttemptsExceededError('Attempts limit exceeded');
		return await response.json();
	} catch (e) {
		if (e instanceof RequestError)
			return sendRequest(request, params, attempts - 1); // let’s try again
		else
			throw e;
	}
}