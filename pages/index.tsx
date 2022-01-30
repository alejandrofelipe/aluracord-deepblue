import {Box, Button, Text, TextField, Image, Icon} from '@skynexui/components';

import appConfig from '../config.json';
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {ChakraProvider} from "@chakra-ui/react";
import PaginaInicio from "../components/paginas/PaginaInicio";
import theme from "../components/theme";

/* Route / */
export default function Index() {
	return <PaginaInicio/>;
}
