import {
	Box,
	chakra,
	Icon,
	Image,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Text,
	useColorModeValue
} from "@chakra-ui/react";
import {FaGithub} from "react-icons/fa";
import {useEffect, useState} from "react";
import {GithubUser} from "../types/github";

export default function GithubProfile({username}: { username: string }) {
	const
		[loading, setLoading] = useState(true),
		[error, setError] = useState(null),
		[githubUser, setGithubUser] = useState<GithubUser>(null);

	useEffect(() => {
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
			<SkeletonCircle size="150px"/>
			<Box p={1}>
				<Skeleton height="20px"/>
			</Box>
		</GithubProfileContainer>;

	return <GithubProfileContainer as="a" href={`https://github.com/${username}`} textAlign="center">
		<Image boxSize="150px" borderRadius="full" shadow="sm" mx="auto"
					 fallbackSrc="https://avatars.dicebear.com/api/pixel-art-neutral/aaaaaa.svg"
					 src={githubUser.avatar_url}/>
		<Box p={1}>
			<Text>{githubUser.name}</Text>
			<Text><Icon as={FaGithub}/> {githubUser.login}</Text>
		</Box>
	</GithubProfileContainer>
}

const GithubProfileContainer = chakra(Box, {
	baseStyle: {
		p: 2,
		border: '1px solid white',
		borderRadius: 5,
		overflow: 'hidden',
		bg: 'gray.700'
	}
})
