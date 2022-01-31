import {extendTheme} from "@chakra-ui/react";

export default extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false,
	},
	styles: {
		global: {
			'body': {
				margin: 0,
				padding: 0,
				fontFamily: '"Open Sans", sans-serif',
				minHeight: '100vh',
			},
			'#__next': {
				height: '100vh',
				display: 'flex',
				'&, & > *': {
					flex: 1
				}
			}
		}
	},
	components: {
		Text: {
			baseStyle(props) {
				return {
					color: props.colorMode === "dark"
						? "white" : "blue.900"
				}
			}
		},
		Heading: {
			baseStyle: {
				baseStyle(props) {
					return {
						color: props.colorMode === "dark"
							? "white" : "blue.900"
					}
				}
			}
		}
	}
});
