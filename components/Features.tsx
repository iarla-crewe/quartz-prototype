import {
    Box,
    Container,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { ReactElement } from 'react';
  import {
    FcAbout,
    FcLock,
    FcReadingEbook,
  } from 'react-icons/fc';
  
  interface CardProps {
    heading: string;
    description: string;
    icon: ReactElement;
    href: string;
  }
  
  const Card = ({ heading, description, icon, href }: CardProps) => {
    return (
      <Box
        maxW={{ base: 'full', md: '300px' }}
        w={'full'}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}>
        <Stack align={'start'} spacing={2}>
          <Flex
            w={16}
            h={16}
            align={'center'}
            justify={'center'}
            color={'white'}
            rounded={'full'}
            bg={useColorModeValue('gray.100', 'gray.700')}>
            {icon}
          </Flex>
          <Box mt={2}>
            <Heading size="md">{heading}</Heading>
            <Text mt={1} fontSize={'sm'}>
              {description}
            </Text>
          </Box>
        </Stack>
      </Box>
    );
  };
  
  export default function Features() {
    return (
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={{ base: '1xl', sm: '3xl' }} fontWeight={'bold'}>
            Trust less, Spend more
          </Heading>
        </Stack>
  
        <Container maxW={'5xl'} mt={6} mb={12}>
          <Flex flexWrap="wrap" gridGap={6} justify="center">
            <Card
              heading={'Secure'}
              icon={<Icon as={FcLock} w={10} h={10} />}
              description={
                'Funds stay safe with industry grade cryptography & 2 Factor Authentication.'
              }
              href={'#'}
            />
            <Card
              heading={'Self Custody'}
              icon={<Icon as={FcReadingEbook} w={10} h={10} />}
              description={
                'Your crypto, with your keys. You are always in control of your funds.'
              }
              href={'#'}
            />

            <Card
              heading={'Transparent'}
              icon={<Icon as={FcAbout} w={10} h={10} />}
              description={
                'We always keep our fees easy to understand.'
              }
              href={'#'}
            />
          </Flex>
        </Container>
      </Box>
    );
  }