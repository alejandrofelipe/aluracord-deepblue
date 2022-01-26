import React, {useCallback, useState} from 'react';
import {Box, Text, TextField, Image, Button} from '@skynexui/components';
import appConfig from "../config.json";

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

export default function ChatPage() {
	console.log('render', 'ChatPage')
	/*
	// Sua lógica vai aqui
	// - Usuario digita no campo
	// - aperta enter pra envia
	// - tem que adicionar texto na mensagem
	// ./Sua lógica vai aqui
	*/
	const [mensagem, setMensagem] = useState(''),
		[listaMensagens, setListMensagens] = useState([]);

	const handleChange = (ev) => {
		setMensagem(ev.target.value);
	}

	const handleSendMessage = useCallback((ev) => {
		if (
			('keypress' === ev.type && (ev?.keyCode || ev?.which) === 13)
			|| ('submit' === ev.type)
		) {
			ev.preventDefault();
			setListMensagens((old) => {
				return [...old, {
					id: uuidv4(),
					de: 'alguem',
					texto: mensagem
				}]
			})
			setMensagem('');
			console.log('send');
		}
	}, [mensagem]);

	return (
		<Box
			styleSheet={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				backgroundColor: appConfig.theme.colors.primary[500],
				backgroundImage: 'url(https://images.pexels.com/photos/1086584/pexels-photo-1086584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
				backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
				color: appConfig.theme.colors.neutrals['000']
			}}
		>
			<Box
				styleSheet={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700],
					height: '100%',
					maxWidth: '95%',
					maxHeight: '95vh',
					padding: '32px',
				}}
			>
				<Header/>
				<Box
					styleSheet={{
						position: 'relative',
						display: 'flex',
						flex: 1,
						height: '80%',
						backgroundColor: appConfig.theme.colors.neutrals[600],
						flexDirection: 'column',
						borderRadius: '5px',
						padding: '16px',
					}}
				>
					<MessageList mensagens={listaMensagens}/>

					<Box as="form"
							 styleSheet={{display: 'flex', alignItems: 'center'}}
							 onSubmit={handleSendMessage}
					>
						<TextField
							name="msg"
							placeholder="Insira sua mensagem aqui..."
							type="textarea"
							value={mensagem}
							onChange={handleChange}
							onKeyPress={handleSendMessage}
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '12px',
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header() {
	return (
		<>
			<Box styleSheet={{
				width: '100%',
				marginBottom: '16px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between'
			}}>
				<Text variant='heading5'>
					Chat
				</Text>
				<Button
					variant='tertiary'
					colorVariant='neutral'
					label='Logout'
					href="/"
				/>
			</Box>
		</>
	)
}

function MessageList(props) {
	return (
		<Box
			as="ul"
			styleSheet={{
				overflowX: 'hidden',
				overflowY: 'scroll',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'end',
				flex: 1,
				color: appConfig.theme.colors.neutrals["000"],
				marginBottom: '16px',
			}}
		>
			{props.mensagens.map((mensagem) => (
				<Text
					key={mensagem.id}
					as="li"
					styleSheet={{
						borderRadius: '5px',
						padding: '6px',
						marginBottom: '12px',
						hover: {
							backgroundColor: appConfig.theme.colors.neutrals[700],
						}
					}}
				>
					<Box
						styleSheet={{
							display: 'flex',
							alignItems: 'baseline',
							marginBottom: '8px',
						}}
					>
						<Image
							styleSheet={{
								width: '20px',
								height: '20px',
								borderRadius: '50%',
								display: 'inline-block',
								marginRight: '8px',
							}}
							src={`https://github.com/vanessametonini.png`}
						/>
						<Text tag="strong">
							{mensagem.de}
						</Text>
						<Text
							styleSheet={{
								fontSize: '10px',
								marginLeft: '8px',
								color: appConfig.theme.colors.neutrals[300],
							}}
							tag="span"
						>
							{(new Date().toLocaleDateString())}
						</Text>
					</Box>
					<Box as="p">
						{mensagem.texto}
					</Box>
				</Text>
			))}

		</Box>
	)
}
