import { none } from "@hookstate/core";
import { Button, Select, Stack, TextField } from "@shopify/polaris";
import { MdDelete } from "react-icons/md";

const ConditionComponent = ({ condition, template }) => {
  /*
     CONDITIONS
  */

  const conditionsOptions = [
    { label: "Product title", value: "product-title" },
    { label: "Product category", value: "product-category" },
  ];
  const rulesOptions = [
    { label: "is equal to", value: "equals" },
    { label: "contains", value: "contains" },
  ];

  const handleDeleteCondition = () => {
    condition.set(none);
  };

  return (
    <Stack distribution="fill">
      <Select
        labelInline
        label="When"
        options={conditionsOptions}
        value={
          conditionsOptions.find((c) => c.value == condition.target.get()).value
        }
        onChange={(value) => condition.target.set(value)}
      />
      <Select
        options={rulesOptions}
        value={rulesOptions.find((r) => r.value == condition.rule.get()).value}
        onChange={(value) => condition.rule.set(value)}
      />
      <TextField
        value={condition.text.get()}
        onChange={(value) => condition.text.set(value)}
      />
      <Button icon={<MdDelete onClick={handleDeleteCondition} />} />
    </Stack>
  );
};

export default ConditionComponent;
