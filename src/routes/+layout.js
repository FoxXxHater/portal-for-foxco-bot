import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ data, fetch }) {
	// const url = '/api/users/@me';
	const url = (dev ? PUBLIC_HOST : '') + '/api/users/@me';
	const response = await fetch(url, {
		credentials: 'include',
		mode: 'cors',
	});
	const isJSON = response.headers.get('Content-Type')?.includes('json')
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, '/auth/login');
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			isDark: data.isDark,
			user: body
		};
	}
}