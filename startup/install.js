const snippet = `{% if product %}  
<script>
  console.log("Snippet is running");
  window.easyOptions = {
    product: {{product | json }},
    shop: {{shop.permanent_domain | json }}
  }
</script>

<script src="https://4dbbad62a3e7.ngrok.io/easy-option.js" type="text/javascript"/>
{%endif%}`;

const SNIPPET = "pippo.liquid";

async function installSnippet(shop, accessToken, themeId) {
  return new Promise((accept, reject) => {
    fetch(`https://${shop}/admin/api/2021-01/themes/${themeId}/assets.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: `snippets/${SNIPPET}`,
          value: snippet,
        },
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          accept(true);
        }
      })
      .catch((e) => {
        reject("Errore upload snippet");
      });
  });
}

async function getActiveThemeId(shop, accessToken) {
  return new Promise((accept, reject) => {
    fetch(`https://${shop}/admin/api/2021-01/themes.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let main = data.themes.find(({ role }) => role == "main");
        accept(main.id);
      })
      .catch((e) => {
        reject("Errore nel verificare il tema principale");
      });
  });
}

function checkSnippetExists(shop, accessToken, themeId) {
  return new Promise((accept, reject) => {
    fetch(
      `https://${shop}/admin/api/2021-01/themes/${themeId}/assets.json?asset[key]=snippets/${SNIPPET}`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    )
      .then((res) => {
        if (res.status == 200) {
          return accept(true);
        }
        if (res.status == 404) {
          return accept(false);
        }
      })
      .catch((err) => {
        reject("Errore nel verificare l'esistenza dello snippet");
      });
  });
}

export { getActiveThemeId, checkSnippetExists, installSnippet };
