import * as api from "../lib/api";
import { User, UserContextProps } from "../types/types";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext({});

function UserProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		getMe();
	}, []);

	// Sends a request to the server to fetch the current user
	async function getMe() {
		try {
			setLoading(true);
			const user = await api.getMe();
			if (user) setUser({ ...user });
		} catch (error) {
			console.error("Error", error);
		} finally {
			setLoading(false);
		}
	}

	async function login({ email, password }: { email: string; password: string }) {
		try {
			setLoading(true);
			await api.login({ email, password });
		} catch (error) {
			console.error("Error", error);
		} finally {
			setLoading(false);
		}
	}

	async function logout() {
		try {
			setLoading(true);
			await api.logout();
			setUser(null);
		} catch (error) {
			console.error("Error", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<UserContext.Provider
			value={
				{
					user,
					login,
					logout,
					loading,
				} as UserContextProps
			}
		>
			{children}
		</UserContext.Provider>
	);
}

function useUser(): UserContextProps {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context as UserContextProps;
}

export { UserProvider, useUser };
