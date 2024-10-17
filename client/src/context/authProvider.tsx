import type { User } from "../types/user";
import { getUser, logoutUser } from "../features/api";
import { createContext, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext<{
	user: User | null;
	isLoading: boolean;
	logout: () => void;
}>({
	user: null,
	isLoading: true,
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = useQueryClient();
	const { mutateAsync } = useMutation({ mutationFn: logoutUser });
	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const logout = useCallback(async () => {
		try {
			console.info("Attempting to log the user out");
			await mutateAsync();
			queryClient.invalidateQueries({ queryKey: ["user"] });

			console.info("Redirecting to the login page...");
			window.location.replace("/auth/login");
		} catch (e) {
			console.error(e);
		}
	}, [mutateAsync, queryClient]);

	const user = data?.payload || null;

	const value = useMemo(
		() => ({
			user,
			isLoading,
			logout,
		}),
		[user, isLoading, logout],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
