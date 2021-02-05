const snippet = `{% if product %}  
<script>
  console.log("Snippet is running");
  window.easyOptions = {
    product: {{product | json }},
    shop: {{shop.permanent_domain | json }}
  }
</script>

<script src="${process.env.HOST}/easy-option.js" type="text/javascript"/>
{%endif%}`;

const SNIPPET = "easy-options.liquid";

async function snippetExists(shop, token, themeId) {
  return new Promise((accept, reject) => {
    fetch(
      `https://${shop}/admin/api/2021-01/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
        },
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        let file = data.asset.value;

        if (file.includes("{% render 'easy-options' %}")) {
          // Include già la chiamata allo snippet
          accept(true);
        } else {
          // Non include la chiamata allo snippet
          // Quindi va aggiunto

          // Si aggiunge alla fine del file lo snippet
          let arr = file.split("{{ content_for_header }}");

          let str =
            arr[0] +
            " {{ content_for_header }} " +
            " {% render 'easy-options' %} " +
            arr[1];

          console.log(str);
          //file = file.concat("{% render 'easy-options' %}");
          accept(str);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function addSnippetInsideTheme(shop, token, themeId, file) {
  return new Promise((accept, reject) => {
    fetch(`https://${shop}/admin/api/2021-01/themes/${themeId}/assets.json`, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "layout/theme.liquid",
          value: file,
        },
      }),
    })
      .then((res) => {
        //console.log(res);
        console.log("Aggiunto");
        accept("Snippet caricato con successo in theme.liquid");
      })
      .catch((e) => {
        console.log("Non aggiunto", e);
        reject("Errore upload snippet nel file theme.liquid", e);
      });
  });
}

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

export {
  getActiveThemeId,
  checkSnippetExists,
  installSnippet,
  snippetExists,
  addSnippetInsideTheme,
};
