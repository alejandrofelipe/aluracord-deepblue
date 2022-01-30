import MainContainer from "../customizado/MainContainer";
import {
	Box,
	Button,
	chakra,
	HStack,
	Icon,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Stack,
	Text,
	Textarea,
	VStack,
	useColorMode,
} from "@chakra-ui/react";
import BaseContainer from "../customizado/BaseContainer";
import {FiSend, FiSmile, FiTrash} from "react-icons/fi";
import {Mensagem} from "../types/chat";
import {useCallback, useEffect, useMemo, useState} from "react";
import {createClient} from "@supabase/supabase-js";
import {useRouter} from "next/router";
import {BsFillCaretDownSquareFill} from "react-icons/bs";
import GithubProfile from "../elementos/GithubProfile";

const
	SUPBASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ3NTY3MCwiZXhwIjoxOTU5MDUxNjcwfQ.OXQdub5RlaWl97NrxsiVDW0NaOpjgmdhx-pZBB8l6Pc',
	SUPABASE_URL = 'https://annazvdevzijlbtlprsc.supabase.co';

export default function PaginaChat() {
	const
		[listaMensagens, setListMensagens] = useState<Mensagem[]>([]),
		[mensagem, setMensagem] = useState(''),
		[loading, setLoading] = useState(true);

	const supaClient = useMemo(() => createClient(SUPABASE_URL, SUPBASE_ANON_KEY), []);
	const router = useRouter();

	useEffect(() => {
		supaClient
			.from('mensagens')
			.select('*')
			.order('created_at', {ascending: false})
			.then(({data}) => {
				setListMensagens(data);
				setLoading(false);
			});

		const supaSubscribe = supaClient
			.from('mensagens')
			.on('INSERT', ({new: novaMensagem}) => {
				setListMensagens(old => {
					return [novaMensagem, ...old]
				});
			})
			.on('DELETE', ({old: {id}}) => {
				setListMensagens((old) => {
					return old.filter(item => item.id !== id);
				})
			})
			.subscribe();

		return () => {
			supaSubscribe.unsubscribe()
		}
	}, []);

	const enviarMensagem = useCallback(() => {
		setLoading(true);
		supaClient
			.from('mensagens')
			.insert({
				de: 'alejandrofelipe',
				texto: mensagem
			})
			.then(() => {
				setMensagem('');
				setLoading(false);
			});
	}, [mensagem]);

	const handleChange = (ev) => {
		setMensagem(ev.target.value);
	}

	const handleEnterKeyPress = (ev) => {
		if ('keypress' === ev.type && (ev?.keyCode || ev?.which) === 13) {
			ev.preventDefault();
			enviarMensagem();
		}
	};

	const handleSubmit = (ev) => {
		ev.preventDefault();
		enviarMensagem();
	};

	return (
		<MainContainer
			px={2}
			bgImage="url(https://images.pexels.com/photos/1086584/pexels-photo-1086584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)">
			<ChatContainer w="100%" maxW="1080px" height="95vh">
				<HStack gap={2} py={2} justifyContent="space-between" alignItems="center">
					<Text>alejandro</Text>
					<Button variant="link" onClick={() => router.push('/')}>Sair</Button>
				</HStack>
				<MenssagemLista mensagens={listaMensagens} loading={loading}/>
				<HStack as="form" onSubmit={handleSubmit}>
					<Textarea resize="none" alignItems="stretch" variant="filled" colorScheme="blue" flex={1}
										bg="#00000009" placeholder="Digite sua mensagem" minH="42px" value={mensagem}
										disabled={loading} onChange={handleChange} onKeyPress={handleEnterKeyPress}
										autoFocus={true}/>
					<IconButton colorScheme="blue" aria-label="Enviar" type="submit"
											icon={<Icon as={FiSend}/>} isLoading={loading}/>
					<IconButton colorScheme="blue" aria-label="Stickers" type="button"
											icon={<Icon as={FiSmile}/>} disabled={loading}/>
				</HStack>
			</ChatContainer>
		</MainContainer>
	);
}

function MenssagemLista(
	{mensagens, loading}: {
		mensagens: Mensagem[],
		loading: boolean,
	}
) {
	const supaClient = useMemo(() => createClient(SUPABASE_URL, SUPBASE_ANON_KEY), []);
	const {colorMode} = useColorMode();
	const [lastDeleteId, setLastDeleteId] = useState<number>(null);
	const handleDeleteMessage = async (id: number) => {
		setLastDeleteId(lastDeleteId);
		await supaClient
			.from('mensagens')
			.delete()
			.match({id});
	}

	return <VStack as="ul" border="1px solid" alignItems="stretch" justifyContent="end"
								 borderColor={colorMode === 'dark' ? 'blue.800' : 'blue.600'}
								 flexDirection="column-reverse"
								 borderRadius={5} p={2} flex={1} overflowX="hidden" overflowY="auto">
		{
			loading &&
			<HStack as="li" p={1}>
				<SkeletonCircle size="40px" alignSelf="flex-start"/>
				<VStack flex={1} alignItems="stretch">
					<Skeleton height="24px"/>
					<SkeletonText noOfLines={2}/>
				</VStack>
			</HStack>
		}
		{mensagens.map(m => (
			<MensagemItem key={m.id} mensagem={m} onDelete={handleDeleteMessage}
										disabled={m.id === lastDeleteId}/>
		))}
	</VStack>;
}

function MensagemItem(
	{mensagem, onDelete, disabled = false}: {
		mensagem: Mensagem,
		onDelete: (id: number) => void,
		disabled?: boolean
	}
) {
	return (
		<MensagemContainer as="li" sx={{'&:hover': {opacity: disabled ? 0.6 : 'initial'}}}>
			<Popover isLazy={true} placement="right">
				{({isOpen}) => (
					<>
						<PopoverTrigger>
							<Image boxSize="40px" loading="lazy" borderRadius="full" alignSelf="flex-start"
										 src={`https://github.com/${mensagem.de}.png`} sx={{cursor: 'pointer'}}/>
						</PopoverTrigger>
						<PopoverContent maxWidth="250px">
							{isOpen && <GithubProfile username={mensagem.de}/>}
						</PopoverContent>
					</>
				)}
			</Popover>
			<VStack flex={1} alignItems="stretch">
				<HStack w="100%" justifyContent="flex-start" alignItems="flex-end">
					<Text as="strong">{mensagem.de}</Text>
					<Text as="small" fontSize="0.6em">{new Date(mensagem.created_at).toLocaleString()}</Text>
				</HStack>
				<Text mt="0 !important" overflowWrap="anywhere">{mensagem.texto}</Text>
			</VStack>
			<Stack w="35px">
				<Menu>
					<MenuButton as={IconButton} variant="ghost" aria-label="deletar mensagem" size="sm"
											marginLeft="auto !important" alignSelf="start"
											icon={<BsFillCaretDownSquareFill/>} d="none" disabled={disabled}/>
					<MenuList>
						<MenuItem icon={<FiTrash/>} onClick={() => onDelete(mensagem.id)}>
							Remover</MenuItem>
					</MenuList>
				</Menu>
			</Stack>
		</MensagemContainer>
	)
}

const ChatContainer = chakra(BaseContainer, {
	baseStyle: {
		display: 'flex',
		flexDirection: 'column',
		gap: 3
	}
});

const MensagemContainer = chakra(Box, {
	baseStyle({sx}) {
		return {
			p: 1,
			borderRadius: 5,
			display: 'flex',
			flexDirection: 'row',
			gap: 2,
			_hover: {
				bg: '#ffffff11',
				...sx['&:hover'],
				'button': {
					d: 'flex'
				}
			},
			'button': {
				d: 'none'
			}
		}
	}
});
