import ReactMarkdown from 'react-markdown'
import { useColorModeValue } from '@chakra-ui/react'
import Card from '@/components/chatbot/card/Card'

export default function MessageBox(props: { output: string }) {
  const { output } = props
  const textColor = useColorModeValue('navy.700', 'white')
  return (
    <Card
    backgroundColor="transparent"
    overflow="auto"
      display={output ? 'flex' : 'none'}
      px={{base:"0px",md:"16px !important"}}
      py={{base:"0px !important"}}
      pt={{md:"8px !important"}}
      // pl="22px !important"
      color="white"
      // minH="450px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
      height="fit-content"
    >
      <ReactMarkdown className="font-medium">
        {output ? output : ''}
      </ReactMarkdown>
    </Card>
  )
}
