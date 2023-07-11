import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { FormEvent, ChangeEvent, useState } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'initial' | 'submitting' | 'success'>(
    'initial'
  );
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setState('submitting');

    try {
      const response = await axios.post(
        'https://eoew0sz5qr4inhx.m.pipedream.net',
        { email }
      );

      if (response.status === 200) {
        setState('success');
      } else {
        setError(true);
        setState('initial');
      }
    } catch (error) {
      setError(true);
      setState('initial');
    }
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 10, md: 10 }}>
          <Heading
            fontWeight={500}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            <Text
              as={'span'}
              color={'gray.400'}
              fontWeight={200}
              fontSize={{ base: '3xl', sm: '5xl', md: '7xl' }}
              lineHeight={'80%'}
              letterSpacing={'widest'}>
              Quartz <br /> <br />
            </Text>
            Spend your crypto with <br />
            <Text as={'span'} color={'green.400'}>
              100% self custody
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize="2xl">
            with the world&apos;s first trust-less crypto debit card
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              as={'form'}
              spacing={'12px'}
              onSubmit={handleSubmit}>
              <FormControl>
                <Input
                  variant={'solid'}
                  borderWidth={1}
                  color={'gray.800'}
                  _placeholder={{
                    color: 'gray.400',
                  }}
                  borderColor={useColorModeValue('gray.300', 'gray.700')}
                  id={'email'}
                  type={'email'}
                  required
                  placeholder={'Your Email'}
                  aria-label={'Your Email'}
                  value={email}
                  disabled={state !== 'initial'}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </FormControl>
              <FormControl w={{ base: '100%', md: '40%' }}>
                <Button
                  colorScheme={state === 'success' ? 'whatsapp' : 'green'}
                  isLoading={state === 'submitting'}
                  w="100%"
                  type={state === 'success' ? 'button' : 'submit'}
                  rounded={'full'}
                  px={50}>
                  {state === 'success' ? <CheckIcon /> : 'Join our waiting list'}
                </Button>
              </FormControl>
            </Stack>
            <Text
              mt={2}
              textAlign={'center'}
              color={error ? 'red.500' : 'gray.500'}>
              {error
                ? 'Oh no an error occurred! 😢 Please try again later.'
                : "You'll get updated when we launch! ✌️"}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
