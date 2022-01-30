import {Box, chakra} from "@chakra-ui/react";

export default chakra(Box, {
	baseStyle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		bg: 'blue.700',
		bgRepeat: 'no-repeat',
		bgSize: 'cover',
		bgPosition: 'center',
		bgBlendMode: 'multiply'
	}
});

