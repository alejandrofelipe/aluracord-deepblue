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
	useColorMode, FormControl, FormLabel, Switch, Avatar,
} from "@chakra-ui/react";
import BaseContainer from "../customizado/BaseContainer";
import {FiSend, FiTrash} from "react-icons/fi";
import {Mensagem} from "../../types/chat";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/router";
import {BsFillCaretDownSquareFill} from "react-icons/bs";
import GithubProfile from "../elementos/GithubProfile";
import StickerButton from "../elementos/StickerButton";
import {useClient} from "../../context/SupabaseContext";
import Anchor from "../elementos/Anchor";

export default function PaginaChat() {
	const
		router = useRouter(),
		[listaMensagens, setListMensagens] = useState<Mensagem[]>([]),
		[mensagem, setMensagem] = useState(''),
		[loading, setLoading] = useState(true),
		{colorMode, toggleColorMode} = useColorMode(),
		refInput = useRef<HTMLTextAreaElement>(),
		supaClient = useClient();

	const usuario: string = useMemo(() => {
		if (router.query?.username)
			return router.query.username;
		return '';
	}, [router.query]) as string;

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
			supaSubscribe.unsubscribe();
		}
	}, []);

	const enviarMensagem = useCallback(() => {
		setLoading(true);
		sendMessage(usuario, mensagem)
			.then(() => {
				setMensagem('');
				setLoading(false);
				refInput.current.focus();
			});
	}, [mensagem]);

	const sendMessage = (de: string, texto: string) => {
		return supaClient
			.from('mensagens')
			.insert({de, texto});
	}

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

	const handleStickerSelect = (url: string) => {
		setLoading(true);
		sendMessage(usuario, `:sticker: ${url}`)
			.then(() => {
				setLoading(false);
			})
	}

	const handleSwitchChange = () => {
		toggleColorMode();
	}

	return (
		<MainContainer
			px={2}
			bgImage="url(https://images.pexels.com/photos/1086584/pexels-photo-1086584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)">
			<ChatContainer w="100%" maxW="1080px" height="95vh">
				<HStack gap={2} py={2} justifyContent="space-between" alignItems="center">
					<Anchor href={`https://github.com/${usuario}`} d="flex" alignItems="center" gap={1}>
						<Avatar size="sm" src={`https://github.com/${usuario}.png`}/> {usuario}
					</Anchor>
					<HStack>
						<FormControl display='flex' alignItems='center'>
							<FormLabel htmlFor='dark-mode' mb='0' mx="auto">
								{colorMode === 'dark' ? '🌚' : '🌞'}
							</FormLabel>
							<Switch id='dark-mode' onChange={handleSwitchChange} isChecked={colorMode === 'dark'}/>
						</FormControl>
						<Button variant="ghost" onClick={() => router.push('/')}>Sair</Button>
					</HStack>
				</HStack>
				<MenssagemLista mensagens={listaMensagens} loading={loading} usuarioAtual={usuario}/>
				<HStack as="form" onSubmit={handleSubmit}>
					<Textarea ref={refInput} resize="none" alignItems="stretch" variant="filled" colorScheme="blue" flex={1}
										bg="#00000009" placeholder="Digite sua mensagem" minH="42px" value={mensagem}
										disabled={loading} onChange={handleChange} onKeyPress={handleEnterKeyPress}
										autoFocus={true}/>
					<IconButton colorScheme="blue" aria-label="Enviar" type="submit"
											icon={<Icon as={FiSend}/>} isLoading={loading}/>
					<StickerButton loading={loading} onSelect={handleStickerSelect}/>
				</HStack>
			</ChatContainer>
		</MainContainer>
	);
}

function MenssagemLista(
	{mensagens, loading, usuarioAtual}: {
		mensagens: Mensagem[],
		loading: boolean,
		usuarioAtual: string
	}
) {
	const supaClient = useClient();
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
										disabled={m.id === lastDeleteId} enableOptions={m.de === usuarioAtual}/>
		))}
	</VStack>;
}

function MensagemItem(
	{mensagem, onDelete, disabled = false, enableOptions = true}: {
		mensagem: Mensagem,
		onDelete: (id: number) => void,
		disabled?: boolean,
		enableOptions?: boolean
	}
) {
	return (
		<MensagemContainer as="li" sx={{'&:hover': {opacity: (disabled ? 0.6 : 'initial')}}}>
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
			<VStack flex={1} alignItems="stretch" gap={1}>
				<Stack flexDirection={['column', 'row']} gap={[0, 2]} w="100%" justifyContent="flex-start"
							 alignItems={["flex-start", "flex-end"]}>
					<Text as="strong">{mensagem.de}</Text>
					<Text as="small" fontSize="0.6em" mt="0 !important">{new Date(mensagem.created_at).toLocaleString()}</Text>
				</Stack>
				{
					mensagem.texto.startsWith(':sticker:')
						? <Image w="140px" bg="#00000011" borderRadius={5}
										 src={mensagem.texto.replace(':sticker:', '').trim()}/>
						: <Text mt="0 !important" overflowWrap="anywhere">
							{mensagem.texto}
						</Text>
				}
			</VStack>
			<Stack w="35px">
				{
					enableOptions && <Menu>
						<MenuButton as={IconButton} variant="ghost" aria-label="deletar mensagem" size="sm"
												d="none" marginLeft="auto !important" alignSelf="start"
												icon={<BsFillCaretDownSquareFill/>} disabled={disabled}/>
						<MenuList>
							<MenuItem icon={<FiTrash/>} onClick={() => onDelete(mensagem.id)}>
								Remover</MenuItem>
						</MenuList>
					</Menu>
				}
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
