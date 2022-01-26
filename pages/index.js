import {Box, Button, Text, TextField, Image, Icon} from '@skynexui/components';
import appConfig from '../config.json';
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";


function Titulo({children, as: Component = 'h1'}) {
	return (
		<>
			<Component>{children}</Component>
			<style jsx>
				{`
					${Component} {
						color: ${appConfig.theme.colors.neutrals['000']};
						font-size: 24px;
						font-weight: 600;
					}
				`}
			</style>
		</>
	);
}

export default function PaginaInicial() {
	const [username, setUsername] = useState('alejandrofelipe');
	const [githubData, setGithubData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();

	const getUserInfo = (username) => {
		fetch(`https://api.github.com/users/${username}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else throw new Error('Usuario não encontrado.');
			})
			.then(data => {
				setGithubData(data);
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
		setError(null);
		setLoading(true);
		const timeoutId = setTimeout(() => {
			getUserInfo(username);
		}, 1000);
		return () => clearTimeout(timeoutId);
	}, [username]);

	const handleInputChange = (event) => {
		setUsername(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		router.push(`/chat`);
	};

	return (
		<Box
			className="main-background"
			styleSheet={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				backgroundImage: 'url(https://images.pexels.com/photos/2832772/pexels-photo-2832772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
			}}
		>
			<Box
				styleSheet={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					flexDirection: {
						xs: 'column',
						sm: 'row',
					},
					width: '100%', maxWidth: '700px',
					borderRadius: '5px', padding: '32px', margin: '16px',
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					backgroundColor: appConfig.theme.colors.neutrals[700],
				}}
			>
				{/* Formulário */}
				<Box
					as="form"
					onSubmit={handleSubmit}
					styleSheet={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						alignSelf: 'center',
						width: {xs: '100%', sm: '50%'},
						textAlign: 'center'
					}}
				>
					<Titulo tag="h2">Boas vindas de volta!</Titulo>
					<Text variant="body3"
								styleSheet={{marginBottom: '32px', color: appConfig.theme.colors.neutrals[300]}}>
						{appConfig.name}
					</Text>

					<TextField
						name="usuario"
						fullWidth
						value={username}
						onChange={handleInputChange}
						textFieldColors={{
							neutral: {
								textColor: appConfig.theme.colors.neutrals[200],
								mainColor: appConfig.theme.colors.neutrals[900],
								mainColorHighlight: appConfig.theme.colors.primary[500],
								backgroundColor: appConfig.theme.colors.neutrals[800],
							},
						}}
					/>
					<Button
						type='submit'
						label='Entrar'
						disabled={loading || (error !== null)}
						fullWidth
						buttonColors={{
							contrastColor: appConfig.theme.colors.neutrals["000"],
							mainColor: appConfig.theme.colors.primary[500],
							mainColorLight: appConfig.theme.colors.primary[400],
							mainColorStrong: appConfig.theme.colors.primary[600],
						}}
					/>
				</Box>
				{/* Formulário */}


				{/* Photo Area */}
				<Box
					styleSheet={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						maxWidth: '215px',
						padding: '16px',
						backgroundColor: appConfig.theme.colors.neutrals[800],
						border: '1px solid',
						borderColor: appConfig.theme.colors.neutrals[999],
						borderRadius: '10px',
						flex: 1,
					}}
				>
					{
						loading
							? <Box
								styleSheet={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: '150px',
									height: '150px',
									borderRadius: '50%',
									backgroundColor: appConfig.theme.colors.neutrals["300"],
									marginBottom: '16px',
								}}
							>
								<span>Aguarde ...</span>
							</Box>
							: <Image
								width="150"
								height="150"
								styleSheet={{
									borderRadius: '50%',
									marginBottom: '16px',
								}}
								src={
									error
										? `https://avatars.dicebear.com/api/pixel-art-neutral/aaaaaa.svg`
										: `https://github.com/${username}.png`
								}
							/>
					}
					<Text
						as="a"
						target="_blank"
						href={
							(loading || error)
								? '#' : githubData.html_url
						}
						variant="body3"
						styleSheet={{
							color: appConfig.theme.colors.neutrals[200],
							backgroundColor: appConfig.theme.colors.neutrals[900],
							padding: '3px 10px',
							borderRadius: '1000px',
							display: 'flex',
							gap: '5px',
							alignItems: 'center'
						}}
					>
						{
							(loading || error)
								? '' : <Icon name="FaGithub"/>
						}
						{
							loading
								? '...'
								: (error ? error : githubData.login)
						}
					</Text>
				</Box>
				{/* Photo Area */}
			</Box>
		</Box>
	);
}
