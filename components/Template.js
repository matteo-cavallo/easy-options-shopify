import { none, useState } from "@hookstate/core";
import {
  Button,
  Card,
  Collapsible,
  DisplayText,
  RadioButton,
  Select,
  Stack,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { MdDelete, MdExpandLess, MdExpandMore } from "react-icons/md";
import ConditionComponent from "./Condition";
import OptionComponent from "./Option";

const Template = ({ templateState, saveButtonDisabled }) => {
  const open = useState(false);

  const handleAddOption = () => {
    const id = templateState.options.get().length + 1;
    templateState.options.merge([
      {
        label: `Label ${id}`,
        name: "Name",
        type: "Text",
        required: false,
        options: [
          {
            value: "",
          },
        ],
      },
    ]);
  };

  const handleAddCondition = () => {
    templateState.conditions.merge([
      {
        target: "product-title",
        rule: "equals",
        value: "",
      },
    ]);
  };

  const handleDelete = () => {
    templateState.set(none);
  };

  const handleChange = (name, value) => {
    templateState[name].set(value);
    // Call to update state count
    saveButtonDisabled.set(false);
  };

  return (
    <Card>
      <Card.Section title={templateState.name.get()}>
        <Stack>
          <Stack.Item fill>
            <TextField
              placeholder="Options group name"
              prefix={"Template name:"}
              id="name"
              onChange={(value, name) => templateState.name.set(value)}
              value={templateState.name.get()}
            />
          </Stack.Item>
          <Stack.Item>
            <Button
              onClick={() => open.set(!open.get())}
              icon={!open.get() ? <MdExpandMore /> : <MdExpandLess />}
            ></Button>
          </Stack.Item>
          <Stack.Item>
            <Button icon={<MdDelete />} onClick={handleDelete} />
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Collapsible open={open.get()} id="option-group">
        <Card.Section
          title="Fields"
          actions={[{ content: "Add field", onAction: handleAddOption }]}
        >
          {templateState.options.map((option, index) => (
            <OptionComponent key={index} optionState={option} />
          ))}
        </Card.Section>
        <Card.Section
          title="Conditions"
          actions={[
            { content: "Add conditions", onAction: handleAddCondition },
          ]}
        >
          <Stack vertical>
            <Stack alignment="center">
              <TextStyle>Products must match:</TextStyle>
              <RadioButton
                label="All conditions"
                id="all"
                name="all"
                checked={
                  templateState.conditionsRule.get() == "all" ? true : false
                }
                onChange={() => templateState.conditionsRule.set("all")}
              />
              <RadioButton
                label="Any conditions"
                id="any"
                name="any"
                checked={
                  templateState.conditionsRule.get() == "any" ? true : false
                }
                onChange={() => templateState.conditionsRule.set("any")}
              />
            </Stack>

            <Stack vertical>
              {templateState.conditions.map((condition, index) => {
                return <ConditionComponent key={index} condition={condition} />;
              })}
            </Stack>
          </Stack>
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default Template;
