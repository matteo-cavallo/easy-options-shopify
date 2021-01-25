import { none } from "@hookstate/core";
import { Button, Stack, TextField } from "@shopify/polaris";
import { MdDelete } from "react-icons/md";

export default function FieldOption({ option, index, type }) {
  const handleDelete = () => {
    option.set(none);
  };

  if (type == "Select") {
    return (
      <Stack alignment="trailing">
        <Stack.Item fill>
          <TextField
            label="Option value"
            prefix={`${index + 1}`}
            value={option.value}
          />
        </Stack.Item>
        <Stack.Item>
          <Button icon={MdDelete} onClick={() => handleDelete()} />
        </Stack.Item>
      </Stack>
    );
  }

  if (type == "Radio") {
    // TODO
    return "TODO";
  }

  if (type == "Checkbox") {
    //Todo
    return "TODO;";
  }
}
