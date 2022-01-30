import {Box, Button, Heading, Icon, Text, useColorMode} from "@chakra-ui/react";

import {FaGithub} from "react-icons/fa";
import {GiJellyfish} from "react-icons/gi";

import MainContainer from "../customizado/MainContainer";
import LoginContainer from "../customizado/LoginContainer";
import Anchor from "../elementos/Anchor";
import {useRouter} from "next/router";


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
	const {colorMode} = useColorMode();

	const handleLogin = async () => {
		await router.push('/chat');
	}

	return <LoginContainer>
		<Box as="form" flex={1} d="flex" flexDirection="column" alignItems="center"
				 justifyContent="center" gap={8} p={4} textAlign="center">
			<Box>
				<Heading><Icon as={GiJellyfish}/> DeepBlue</Heading>
				<Text>Vem dar um mergulho nesse chat! <Anchor>{colorMode}</Anchor></Text>
			</Box>
			<Box>
				<Text fontSize="xs">
					DeepBlue é uma aplicação simples de chat ultilizando <Anchor
					href="https://nextjs.org/">NextJs</Anchor>, <Anchor
					href="https://chakra-ui.com/">ChakraUI</Anchor> e <Anchor href="https://supabase.com/">Supabase</Anchor>.<br/>
					Acesse também o repositório no <Anchor href="https://github.com/alejandrofelipe/aluracord-deepblue"><Icon as={FaGithub}/> Github</Anchor>.
				</Text>
			</Box>

		</Box>
		<Box flex={1} d="flex" flexDirection="column" alignItems="center"
				 justifyContent="center" p={4}>
			<Button leftIcon={<Icon as={FaGithub}/>} size="lg"
							colorScheme={colorMode === 'dark' ? 'gray' : 'blue'} onClick={handleLogin}>
				Entrar com Github
			</Button>
		</Box>
	</LoginContainer>
}
