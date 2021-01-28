import { none } from "@hookstate/core";
import {
  Button,
  Card,
  DisplayText,
  Stack,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { MdDelete } from "react-icons/md";

export default function RadioOptionComponent({ option, index, value }) {
  console.log(option);
  return (
    <Stack>
      <Stack.Item>
        <TextField
          prefix={`${index}`}
          placeholder="Value"
          value={value}
          onChange={(value) => option.value.set(value)}
        />
      </Stack.Item>
    </Stack>
  );
}
