import {Text, TextProps, useColorModeValue} from "@chakra-ui/react";
import React, {AnchorHTMLAttributes} from "react";

export default function Anchor(props: TextProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
	const textColor = useColorModeValue('blue.500', 'blue.300');
	return <Text as="a" {...props} color={textColor}/>;
}
