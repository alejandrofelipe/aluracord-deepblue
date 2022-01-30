import {Box, Heading, Icon, IconButton, Image, Popover, PopoverContent, PopoverTrigger} from "@chakra-ui/react";
import {FiSmile} from "react-icons/fi";
import appConfig from "../../config.json"
import {useState} from "react";

export default function StickerButton(
	{loading, onSelect}: {
		loading: boolean,
		onSelect: (url: string) => void
	}
) {
	const [isOpen, setIsOpen] = useState(false);

	const handleImageClick = (url) => {
		setIsOpen(false);
		onSelect(url);
	}

	return <>
		<Popover placement="top-start" isOpen={isOpen}>
			<PopoverTrigger>
				<IconButton
					colorScheme="blue" aria-label="Stickers" type="button"
					icon={<Icon as={FiSmile}/>} disabled={loading}
					onClick={() => setIsOpen(old => !old)}/>
			</PopoverTrigger>
			<PopoverContent p={2} onBlur={() => setIsOpen(false)}>
				<Heading size="md" fontWeight="bold">Stickers</Heading>
				<Box d="flex" flexDirection="row" flexWrap="wrap" gap="1" justifyContent="center"
						 overflowY="auto" maxH="330px" w="100%">
					{appConfig.stickers.map((stickerUrl, i) =>
						<Box key={i} w="140px" borderRadius={5} overflow="hidden" _hover={{bg: '#00000011'}}>
							<Image loading="lazy" src={stickerUrl} h="100%" w="140px"
										 onClick={() => handleImageClick(stickerUrl)}/>
						</Box>)}
				</Box>
			</PopoverContent>
		</Popover>
	</>
}
