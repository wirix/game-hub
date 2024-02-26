import { Box, Heading, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <NavBar />
      <Box p={10}>
        <Heading>Oops...</Heading>
        <Text>
          {isRouteErrorResponse(error)
            ? "Pages does not exist"
            : "Unexpected Error"}
        </Text>
      </Box>
    </>
  );
}

export default ErrorPage;
