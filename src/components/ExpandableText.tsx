import { Button, Text, Box } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';

interface Props {
  children: string;
}

function ExpandableText({ children }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState('auto');
  const contentRef = useRef<HTMLDivElement>(null);
  const limit = 300;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : '100px');
    }
  }, [expanded, children]);

  if (!children) return null;

  if (children.length <= limit) return <Text>{children}</Text>;

  const summary = expanded ? children : children.substring(0, limit) + '...';

  return (
    <Box>
      <Box
        ref={contentRef}
        style={{
          transition: 'height 0.3s ease-in-out',
          height: height,
          overflow: 'hidden',
        }}>
        <Text>{summary}</Text>
      </Box>
      <Button
        size="xs"
        marginTop={2}
        fontWeight="bold"
        colorScheme="yellow"
        onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Показать меньше' : 'Показать больше'}
      </Button>
    </Box>
  );
}

export default ExpandableText;
