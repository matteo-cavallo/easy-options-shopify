import { Button, Card, Layout, Page, Stack, TextStyle } from "@shopify/polaris";

export default function Settings({ shop }) {
  return (
    <Page title="Settings">
      <Layout>
        <Layout.AnnotatedSection
          title="App status"
          description="Here you can check if the app is installed correctly and manually re-install the app."
        >
          <Card sectioned>
            <Stack alignment="center">
              <Stack.Item fill>
                <TextStyle>Refresh the installation of the snippet</TextStyle>
              </Stack.Item>
              <Button destructive>Refresh</Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { shop } = context.query;

  console.log("Settings - Shop request: ", shop);
  return {
    props: {
      shop: shop,
    },
  };
}
