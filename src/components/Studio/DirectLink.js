import {
  Button, Input, InputGroup, InputLeftAddon, InputRightAddon, 
} from '@chakra-ui/react';
import Link from 'next/link';

export default function DirectLink({ id }) {
  const shareLink = `https://bken.io/v/${id}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(shareLink);
  }

  return (
    <InputGroup size='sm'>
      <InputLeftAddon>
        Link
      </InputLeftAddon>
      <Input
        isReadOnly={true}
        variant='filled'
        defaultValue={shareLink}
      />
      <InputRightAddon>
        <Button variant='ghost' size='xs' onClick={copyToClipboard}>
          Copy
        </Button>
        <Link passHref href={`/v/${id}`}>
          <Button variant='ghost' size='xs'>
            Open
          </Button>
        </Link>
      </InputRightAddon>
    </InputGroup>
  );
}