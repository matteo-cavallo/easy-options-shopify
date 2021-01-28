import { none, useState } from "@hookstate/core";
import {
  Button,
  Card,
  Collapsible,
  DisplayText,
  Layout,
  RadioButton,
  Select,
  Stack,
  Subheading,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { MdExpandLess, MdExpandMore, MdDelete } from "react-icons/md";
import RadioOptionComponent from "./radio.component";

const FieldComponent = ({ fieldState }) => {
  const optionTypes = ["Text", "Select", "Radio", "Checkbox"];
  const open = useState(false);

  const handleDelete = () => {
    fieldState.set(none);
  };

  const addOption = () => {
    fieldState.options.merge([
      {
        value: "",
        description: "",
        default: false,
      },
    ]);
  };

  return (
    <Card subdued>
      <Card.Section>
        <Stack>
          <Stack.Item fill>
            <TextField
              prefix="Label"
              helpText="This is the public label"
              value={fieldState.get().label}
              onChange={(text) => fieldState.label.set(text)}
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
                value={fieldState.name.get()}
                onChange={(text) => fieldState.name.set(text)}
              />
            </Stack.Item>
            <Stack.Item>
              <Select
                label="Input type"
                options={optionTypes}
                onChange={(selected) => fieldState.type.set(selected)}
                value={fieldState.type.get()}
              />
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <Stack.Item>Required</Stack.Item>
                <Stack.Item>
                  <Stack>
                    <RadioButton
                      label="Yes"
                      checked={fieldState.required.get() == true}
                      onChange={(checked) => fieldState.required.set(true)}
                    />
                    <RadioButton
                      label="No"
                      checked={fieldState.required.get() == false}
                      onChange={(checked) => fieldState.required.set(false)}
                    />
                  </Stack>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
          <div style={{ height: "1rem" }}></div>
          <Stack>
            <Stack.Item fill>
              <TextField
                label="Description"
                value={fieldState.description.get()}
                onChange={(value) => fieldState.description.set(value)}
              />
            </Stack.Item>
          </Stack>
          {["Radio", "Select", "Checkbox"].includes(fieldState.type.get()) && (
            <div>
              <div style={{ height: "1rem" }}></div>
              <Card.Section
                title="Options"
                actions={[{ content: "Add option", onAction: addOption }]}
              >
                <Stack vertical>
                  {fieldState.options.map((o, index) => {
                    console.log(o.label.get());
                    return (
                      <Stack>
                        <Stack.Item>
                          <TextField
                            prefix={`${index}`}
                            placeholder="Value"
                            value={o.label.get()}
                            onChange={(value) => o.label.set(value)}
                          />
                        </Stack.Item>
                        <Stack.Item fill>
                          <TextField
                            placeholder="Description"
                            value={o.description.get()}
                            onChange={(value) => o.description.set(value)}
                          />
                        </Stack.Item>
                        <Stack.Item>
                          <Button icon={MdDelete} onClick={() => o.set(none)} />
                        </Stack.Item>
                      </Stack>
                    );
                  })}
                </Stack>
              </Card.Section>
            </div>
          )}
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default FieldComponent;
