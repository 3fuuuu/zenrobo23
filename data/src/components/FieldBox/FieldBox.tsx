import { Box } from "@chakra-ui/react";

type Props = {
  width: number;
  height: number;
  type: string;
};

function FieldBox({ width, height, type }: Props) {
  return (
    <>
      <Box h={height} w={width}>
        {type}
      </Box>
    </>
  );
}

export default FieldBox;
