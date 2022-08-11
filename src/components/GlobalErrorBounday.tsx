import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Code, Flex,
} from '@chakra-ui/react';
import React, {ErrorInfo, ReactNode} from 'react';
import styles from '../styles/fixes.module.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  stringifiedError?: string;
  errorInfo?: string;
}

export default class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState((prevState) => ({
      errorInfo: errorInfo.componentStack ?? error.message ?? JSON.stringify(error),
      stringifiedError: error.message ?? JSON.stringify(error),
      ...prevState,
    }));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Flex className={styles.safarishit}>
          <Alert
            status="error"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            flex={1}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="xl">
              Completely FUCKED
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb={4}>
              Something went REEEAL wrong, just refresh i guess lol
            </AlertDescription>
            <Code maxWidth="sm" p={1} mb={1} fontSize="small">
              {this.state.stringifiedError}
            </Code>
            <Code maxWidth="sm" p={2} fontSize="xx-small">
              {this.state.errorInfo}
            </Code>
          </Alert>
        </Flex>
      );
    }

    return this.props.children;
  }
}
