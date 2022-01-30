import {
	Box,
	chakra,
	Icon,
	Image,
	Skeleton,
	SkeletonCircle,
	Text,
	VStack
} from "@chakra-ui/react";
import {FaGithub} from "react-icons/fa";
import {useEffect, useState} from "react";
import {GithubUser} from "../../types/github";
import Anchor from "./Anchor";

export default function GithubProfile({username}: { username: string }) {
	const
		[loading, setLoading] = useState(true),
		[error, setError] = useState(null),
		[githubUser, setGithubUser] = useState<GithubUser>(null);

	const getGithubInfo = (username: string) => {
		fetch(`https://api.github.com/users/${username}`)
			.then(response => {
				if (response.ok) {
					return response.json() as Promise<GithubUser>;
				} else throw new Error('Usuario não encontrado.');
			})
			.then(data => {
				setGithubUser(data);
			})
			.catch(error => {
				setError(error?.message || error);
				console.log(error?.message || error);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	useEffect(() => {
		setLoading(true);
		setError(null);
		const timeoutId = setTimeout(() => {
			getGithubInfo(username);
		}, 800);

		return () => {
			clearTimeout(timeoutId);
		}
	}, [username]);

	if (error)
		return <GithubProfileContainer>
			<Image boxSize="150px" borderRadius="full" shadow="sm" mx="auto"
						 fallbackSrc="https://via.placeholder.com/150"
						 src="https://avatars.dicebear.com/api/pixel-art-neutral/aaaaaa.svg"/>
			<Box p={1}>
				<Text color="tomato">Usuário não encontrado</Text>
			</Box>
		</GithubProfileContainer>;

	if (loading)
		return <GithubProfileContainer>
			<SkeletonCircle size="150px" mx="auto"/>
			<VStack p={1} gap={0.5}>
				<Skeleton height="15px" width="150px" mx="auto"/>
				<Skeleton height="15px" width="130px" mx="auto"/>
			</VStack>
		</GithubProfileContainer>;

	return <GithubProfileContainer as="a" href={`https://github.com/${username}`} textAlign="center">
		<Image boxSize="150px" borderRadius="full" shadow="sm" mx="auto" border="1px solid gray"
					 fallbackSrc="https://avatars.dicebear.com/api/pixel-art-neutral/aaaaaa.svg"
					 src={
						 error
							 ? 'https://avatars.dicebear.com/api/pixel-art-neutral/aaaaaa.svg'
							 : githubUser.avatar_url
					 }/>
		<Box p={1}>
			<Text>{githubUser.name}</Text>
			<Anchor href={githubUser.html_url}><Icon as={FaGithub}/> {githubUser.login}</Anchor>
		</Box>
	</GithubProfileContainer>
}

const GithubProfileContainer = chakra(Box, {
	baseStyle: {
		p: 2,
		border: '1px solid white',
		borderRadius: 5,
		overflow: 'hidden'
	}
})
