import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		console.log("Whoa! A user!");

		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

    console.log({ email, password })

    // Go to the API to create a new user
    // The API should return a Cookie in the http request
    // Forward that cookie to the client
	}
} satisfies Actions;