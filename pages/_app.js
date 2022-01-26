import appConfig from '../config.json';

function GlobalStyle() {
	return (
		<style global jsx>{`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
				list-style: none;
			}

			body {
				font-family: 'Open Sans', sans-serif;
			}

			/* App fit Height */
			html, body, #__next {
				min-height: 100vh;
				display: flex;
				flex: 1;
			}

			#__next {
				flex: 1;
			}

			#__next > * {
				flex: 1;
			}

			.main-background {
				background-color: ${appConfig.theme.colors.primary[500]};
				background-repeat: no-repeat;
				background-size: cover;
				background-blend-mode: multiply;
			}

			/* ./App fit Height */
		`}</style>
	);
}

export default function App({Component, pageProps}) {
	return (
		<>
			<GlobalStyle/>
			<Component {...pageProps} />
		</>
	);
}
