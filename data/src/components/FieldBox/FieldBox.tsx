import { Box } from "@chakra-ui/react";

type Props = {
  width: number;
  height: number;
};

function FieldBox({ width, height }: Props) {
  return (
    <>
      <Box h={height} w={width}></Box>
    </>
  );
}

export default FieldBox;
