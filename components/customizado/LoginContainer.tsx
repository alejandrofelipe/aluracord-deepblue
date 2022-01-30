import {chakra} from "@chakra-ui/react";
import BaseContainer from "./BaseContainer";

export default chakra(BaseContainer, {
	baseStyle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: ['column', 'row'], // xs, sm em diante
	}
})
