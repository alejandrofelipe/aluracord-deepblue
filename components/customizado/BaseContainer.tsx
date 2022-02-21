import {Box, ChakraProps, useColorModeValue} from "@chakra-ui/react";

export default function BaseContainer(props: ChakraProps & {children?: React.ReactNode}) {
	const bgColor = useColorModeValue('blue.50', 'blue.900')
	return <Box bg={bgColor} p={2} borderRadius="md" {...props}/>
}
