import { DisplayText, Stack, TextField, TextStyle } from "@shopify/polaris";

export default function PropertiesComponent({ fieldState }) {
  const type = fieldState.type.get() || "null";

  const renderComponent = () => {
    if (type == "Text") {
      return (
        <div>
          <hr style={{ color: "lightgrey" }}></hr>
          <Stack>
            <Stack.Item fill>
              <TextField
                label="Default"
                value={fieldState.properties.defaultValue.get()}
                onChange={(value) =>
                  fieldState.properties.defaultValue.set(value)
                }
              />
            </Stack.Item>
            <Stack.Item fill>
              <TextField
                label="Placeholder"
                value={fieldState.properties.placeholder.get()}
                onChange={(value) =>
                  fieldState.properties.placeholder.set(value)
                }
              />
            </Stack.Item>
          </Stack>
        </div>
      );
    }
    return null;
  };

  return renderComponent();
}
