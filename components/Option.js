import { none, useState } from "@hookstate/core";
import {
  Button,
  Card,
  Collapsible,
  DisplayText,
  RadioButton,
  Select,
  Stack,
  Subheading,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { MdExpandLess, MdExpandMore, MdDelete } from "react-icons/md";
import FieldOption from "./FieldOption";

const OptionComponent = ({ optionState }) => {
  const open = useState(false);

  const handleDelete = () => {
    optionState.set(none);
  };

  const handleAddOption = () => {
    optionState.options.merge([
      {
        value: "",
      },
    ]);
  };

  const optionTypes = ["Text", "Select", "Radio", "Checkbox"];
  const typesWithOptions = ["Select", "Radio", "Checkbox"];

  return (
    <Card subdued>
      <Card.Section>
        <Stack>
          <Stack.Item fill>
            <TextField
              prefix="Label"
              helpText="This is the public label"
              value={optionState.get().label}
              onChange={(text) => optionState.label.set(text)}
            />
          </Stack.Item>
          <Stack.Item>
            <Button
              icon={!open.get() ? <MdExpandMore /> : <MdExpandLess />}
              onClick={() => open.set(!open.get())}
            ></Button>
          </Stack.Item>
          <Stack.Item>
            <Button icon={<MdDelete />} onClick={handleDelete} />
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Collapsible open={open.get()}>
        <Card.Section title="Properties">
          <Stack>
            <Stack.Item fill>
              <TextField
                label="Identifier"
                prefix="Unique ID"
                placeholder="option-1"
                helpText="This field should be unique"
                value={optionState.name.get()}
                onChange={(text) => optionState.name.set(text)}
              />
            </Stack.Item>
            <Stack.Item>
              <Select
                label="Input type"
                options={optionTypes}
                onChange={(selected) => optionState.type.set(selected)}
                value={optionState.type.get()}
              />
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <Stack.Item>Required</Stack.Item>
                <Stack.Item>
                  <Stack>
                    <RadioButton
                      label="Yes"
                      checked={optionState.required.get() == true}
                      onChange={(checked) => optionState.required.set(true)}
                    />
                    <RadioButton
                      label="No"
                      checked={optionState.required.get() == false}
                      onChange={(checked) => optionState.required.set(false)}
                    />
                  </Stack>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
        </Card.Section>
        {typesWithOptions.includes(optionState.type.get()) && (
          <Collapsible open={true}>
            <Card.Section
              title="Options"
              actions={[{ content: "Add option", onAction: handleAddOption }]}
            >
              {optionState.options?.map((option, index) => {
                console.log(index);
                return (
                  <FieldOption
                    key={index}
                    option={option}
                    index={index}
                    type={optionState.type.get()}
                  />
                );
              })}
            </Card.Section>
          </Collapsible>
        )}
      </Collapsible>
    </Card>
  );
};

export default OptionComponent;
