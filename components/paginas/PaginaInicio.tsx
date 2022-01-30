import {
	Box,
	Button,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	VStack
} from "@chakra-ui/react";

import {FaGithub} from "react-icons/fa";
import {GiJellyfish} from "react-icons/gi";

import MainContainer from "../customizado/MainContainer";
import LoginContainer from "../customizado/LoginContainer";
import Anchor from "../elementos/Anchor";
import {useRouter} from "next/router";
import {FiGithub, FiLogIn} from "react-icons/fi";
import {useCallback, useState} from "react";
import GithubProfile from "../elementos/GithubProfile";


export default function PaginaInicio() {
	return (
		<MainContainer
			px={2}
			bgImage="url(https://images.pexels.com/photos/2832772/pexels-photo-2832772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)">
			<Login/>
		</MainContainer>
	);
}

function Login() {
	const router = useRouter();
	const [username, setUsername] = useState('alejandrofelipe');

	const handleLogin = useCallback(async (ev) => {
		ev.preventDefault();
		await router.push(`/chat?username=${username}`);
	}, [username]);

	const handleInputChange = (ev) => {
		setUsername(ev.target.value);
	}

	return <LoginContainer>
		<Box flex={1} d="flex" flexDirection="column" alignItems="center"
				 justifyContent="center" gap={8} p={4} textAlign="center">
			<Box>
				<Heading><Icon as={GiJellyfish}/> DeepBlue</Heading>
				<Text>Vem dar um mergulho nesse chat!</Text>
			</Box>
			<VStack as="form" gap={1} alignItems="stretch" w="full" onSubmit={handleLogin}>
				<InputGroup>
					<InputLeftElement pointerEvents="none" children={<Icon as={FiGithub}/>}/>
					<Input variant="filled" name="username" placeholder="Usuario do Github"
								 value={username} onChange={handleInputChange}/>
				</InputGroup>
				<Button type="submit" leftIcon={<Icon as={FiLogIn}/>} w="full">Entrar</Button>
			</VStack>
			<Box>
				<Text fontSize="xs">
					DeepBlue é uma aplicação simples de chat ultilizando <Anchor
					href="https://nextjs.org/">NextJs</Anchor>, <Anchor
					href="https://chakra-ui.com/">ChakraUI</Anchor> e <Anchor href="https://supabase.com/">Supabase</Anchor>.<br/>
					Acesse também o repositório no <Anchor href="https://github.com/alejandrofelipe/aluracord-deepblue">
					<Icon as={FaGithub}/> Github</Anchor>.
				</Text>
			</Box>

		</Box>
		<Box flex={1} d="flex" flexDirection="column" alignItems="center"
				 justifyContent="center" p={4}>
			<GithubProfile username={username}/>
		</Box>
	</LoginContainer>
}
