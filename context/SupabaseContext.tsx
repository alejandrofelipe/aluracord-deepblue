import {createContext, useContext, useMemo} from "react";
import {createClient, SupabaseClient} from "@supabase/supabase-js";

const SupabaseContext = createContext({client: null});

export function SupabaseProvider({children}: { children: JSX.Element }) {
	const supabaseClient: SupabaseClient = useMemo(
		() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPBASE_ANON_KEY),
		[process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPBASE_ANON_KEY]
	);

	return (
		<SupabaseContext.Provider value={{client: supabaseClient}}>
			{children}
		</SupabaseContext.Provider>
	);
}

export function useClient(): SupabaseClient {
	const supabase = useContext(SupabaseContext);
	return supabase.client;
}
