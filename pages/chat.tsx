import PaginaChat from "../components/paginas/PaginaChat";
import {SupabaseProvider} from "../context/SupabaseContext";

export default function chat() {
	return <SupabaseProvider>
		<PaginaChat/>
	</SupabaseProvider>;
}
