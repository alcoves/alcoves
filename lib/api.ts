import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_ENDPOINT;

// import { User } from "../types/types";

// Sets all axios requests to send credentials with requests.
// axios.defaults.withCredentials = true;

// export async function login({ email, password }: { email: string; password: string }) {
// 	const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
// 		email,
// 		password,
// 	});
// 	return response.data;
// }

// export async function logout() {
// 	const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`);
// 	return response.data;
// }

// export async function getMe(): Promise<User | undefined> {
// 	try {
// 		const response = await axios(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`);
// 		return response.data;
// 	} catch (error) {
// 		console.error("Tried to fetch the user but failed, they are probably not logged in");
// 		return undefined;
// 	}
// }

// Above is old, remove

// export async function listInvites() {
// 	const response = await axios.get(`${api}/invites`);
// 	return response.data;
// }

// export async function listUsers() {
// 	const response = await axios.get(`${api}/users`);
// 	return response.data;
// }

// export async function patchUser({ userId, data }: { userId: string; data: any }) {
// 	const response = await axios.patch(`${api}/users/${userId}`, data);
// 	return response.data;
// }

// export async function removeUser({ userId }: { userId: string }) {
// 	const response = await axios.delete(`${api}/users/${userId}`);
// 	return response.data;
// }

export async function getAssets({ path }: { path: string }) {
	const url = path ? `${api}/assets?subpath=${path}` : `${api}/assets`;
	const response = await axios.get(url);
	return response.data;
}
