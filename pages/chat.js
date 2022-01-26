import React, {useCallback, useState} from 'react';
import {Box, Text, TextField, Image, Button, Icon} from '@skynexui/components';
import appConfig from "../config.json";

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

export default function ChatPage() {
	const [mensagem, setMensagem] = useState(''),
		[listaMensagens, setListMensagens] = useState([]);

	const handleChange = (ev) => {
		setMensagem(ev.target.value);
	}

	const sendMessage = useCallback(() => {
		if (mensagem.length < 1) return;
		setListMensagens((old) => {
			return [...old, {
				id: uuidv4(),
				de: 'Cthulhu',
				criado: new Date().toLocaleString(),
				texto: mensagem
			}]
		})
		setMensagem('');
	}, [mensagem]);

	const handleEnterKeyPress = (ev) => {
		if ('keypress' === ev.type && (ev?.keyCode || ev?.which) === 13) {
			ev.preventDefault();
			sendMessage();
		}
	};

	const handleSubmit = (ev) => {
		ev.preventDefault();
		sendMessage();
	};

	const handleDeleteMessage = (id) => {
		setListMensagens((old) => {
			return old.filter(item => item.id !== id);
		})
	}

	return (
		<Box
			styleSheet={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				paddingLeft: '0.3rem', paddingRight: '0.3rem',
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
					gap: '0.7rem',
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700],
					height: '100%',
					width: '95%',
					maxWidth: '1080px',
					maxHeight: '95vh',
					padding: '1.5rem',
				}}
			>
				<Header/>

				<Box
					styleSheet={{
						display: 'flex',
						flex: 1,
						gap: '0.7rem',
						backgroundColor: appConfig.theme.colors.neutrals[600],
						flexDirection: 'column',
						borderRadius: '5px',
						padding: '16px',
						minHeight: '0',
					}}
				> {/*https://stackoverflow.com/questions/36230944/prevent-flex-items-from-overflowing-a-container*/}
					<Box
						styleSheet={{
							display: 'flex',
							flexDirection: 'column-reverse',
							flex: 1,
							overflowY: 'auto',
							overflowX: 'hidden',
						}}
					>
						<MessageList mensagens={listaMensagens} onDelete={handleDeleteMessage}/>
					</Box>
					<Box as="form"
							 styleSheet={{
								 display: 'flex',
								 alignItems: 'stretch'
							 }}
							 onSubmit={handleSubmit}
					>
						<TextField
							name="msg"
							placeholder="Insira sua mensagem aqui..."
							type="textarea"
							hasLabel={false}
							value={mensagem}
							onChange={handleChange}
							onKeyPress={handleEnterKeyPress}
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '12px',
								color: appConfig.theme.colors.neutrals[200],
								marginBottom: '-10px' //fix: div vazia do componente após o input tem uma margem
							}}
						/>
						<Button label="OK"
										type="submit"
										buttonColors={{
											mainColor: appConfig.theme.colors.primary["500"],
											mainColorLight: appConfig.theme.colors.primary["050"],
											mainColorStrong: appConfig.theme.colors.primary["600"],
											contrastColor: appConfig.theme.colors.neutrals["000"]
										}}/>
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

function MessageList({mensagens, onDelete = () => null}) {
	return (
		<Box
			as="ul"
			styleSheet={{
				overflow: 'none',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'end',
				flex: 1,
				color: appConfig.theme.colors.neutrals["000"],
				marginBottom: '16px',
			}}
		>
			{mensagens.map((mensagem) => (
				<Text
					as="li"
					className="messagem"
					key={mensagem.id}
					styleSheet={{
						borderRadius: '5px',
						padding: '6px',
						borderLeft: `3px solid ${appConfig.theme.colors.primary["200"]}`,
						marginBottom: '12px',
						hover: {
							backgroundColor: appConfig.theme.colors.neutrals[700]
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
							src={`https://avatars.dicebear.com/api/pixel-art-neutral/${mensagem.de}.svg`}
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
							{mensagem.criado}
						</Text>
						<Icon name="FaTrash"
									className="delete-button"
									onClick={() => onDelete(mensagem.id)}
									styleSheet={{
										fontSize: '1.2rem',
										alignSelf: 'center',
										marginLeft: 'auto',
										cursor: 'pointer',
										display: 'none'
									}}/>
					</Box>
					<Box as="p"
							 styleSheet={{
								 overflowWrap: 'break-word',
								 textIndent: '1rem',
								 paddingLeft: '0.7rem',
							 }}
					>
						{mensagem.texto}
					</Box>
					<style>{`
						.messagem:hover > div .delete-button {
							display: block;
						}
					`}</style>
				</Text>
			))}
		</Box>
	)
}
