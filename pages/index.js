import {Box, Button, Text, TextField, Image} from '@skynexui/components';
import appConfig from '../config.json';
import {useState} from "react";
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
	const router = useRouter();

	const handleInputChange = (event) => {
		setUsername(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		router.push(`/chat`);
	};

	return (
		<>
			<Box
				styleSheet={{
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					backgroundColor: appConfig.theme.colors.primary[500],
					backgroundImage: 'url(https://images.pexels.com/photos/2832772/pexels-photo-2832772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
					backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
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
							display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
							width: {xs: '100%', sm: '50%'}, textAlign: 'center'
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
							maxWidth: '200px',
							padding: '16px',
							backgroundColor: appConfig.theme.colors.neutrals[800],
							border: '1px solid',
							borderColor: appConfig.theme.colors.neutrals[999],
							borderRadius: '10px',
							flex: 1,
						}}
					>
						<Image
							width="150"
							height="150"
							styleSheet={{
								borderRadius: '50%',
								marginBottom: '16px',
							}}
							src={`https://github.com/${username}.png`}
						/>
						<Text
							variant="body4"
							styleSheet={{
								color: appConfig.theme.colors.neutrals[200],
								backgroundColor: appConfig.theme.colors.neutrals[900],
								padding: '3px 10px',
								borderRadius: '1000px'
							}}
						>
							{username}
						</Text>
					</Box>
					{/* Photo Area */}
				</Box>
			</Box>
		</>
	);
}
