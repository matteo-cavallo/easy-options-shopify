import {
  Banner,
  Button,
  Card,
  Collapsible,
  Heading,
  Layout,
  Page,
  PageActions,
  Stack,
  TextField,
} from "@shopify/polaris";
import { useEffect } from "react";
import { MdExpandLess, MdExpandMore, MdDelete } from "react-icons/md";
import Template from "../components/Template";
import { useState } from "@hookstate/core";
import useTemplates from "../hooks/useTemplates";

const Index = ({ shop }) => {
  const { templates, edits, saveTemplatesOnFirestore } = useTemplates(shop);

  const handleAddTemplate = () => {
    templates.merge([
      {
        name: "New template",
        conditionsRule: "any",
        fields: [
          {
            label: "New Field",
            name: "field-id",
            description: "",
            type: "Text",
            required: false,
            options: [],
            properties: {
              defaultValue: "",
              placeholder: "",
            },
          },
        ],
        conditions: [
          {
            target: "product-category",
            rule: "equals",
            text: "",
          },
        ],
      },
    ]);
  };

  return (
    <Page
      title="Templates"
      primaryAction={{
        content: "Add template",
        onAction: handleAddTemplate,
      }}
    >
      <Layout>
        <Layout.Section>
          <Banner status="info">
            <p>Hello {shop}</p>
            <p>Create a new option to get started, or edit one selecting it.</p>
          </Banner>
        </Layout.Section>
        {templates && (
          <Layout.Section>
            {templates.map((template, index) => (
              <Template key={index} templateState={template} />
            ))}
          </Layout.Section>
        )}
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save",
          disabled: !edits.get(),
          onAction: () => saveTemplatesOnFirestore(),
        }}
      />
    </Page>
  );
};

export default Index;

export async function getServerSideProps(context) {
  const shop = context.query.shop;
  console.log("Shop request: ", shop);
  return {
    props: {
      shop: shop,
    },
  };
}
