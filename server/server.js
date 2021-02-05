import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import firestore from "../firebase/config.firebase";
import { doc } from "prettier";
import Cors from "@koa/cors";
import { getProductTemplates } from "../controller/templates";
import { template } from "@babel/core";
import {
  checkSnippetExists,
  getActiveThemeId,
  installSnippet,
  addSnippetInsideTheme,
  snippetExists,
} from "../startup/install";
import { rgbString } from "@shopify/polaris";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const cors = Cors({
  origin: "*",
  allowMethods: ["GET"],
});

const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(cors);
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken } = ctx.state.shopify;

        console.log(ctx.state.shopify);

        // Se lo store non è registrato aggiungere lo shop in firebase
        const ref = firestore.collection("stores").doc(shop);
        ref.get().then((doc) => {
          if (!doc.exists) {
            console.log("DA CREARE");
            ref
              .set({
                // Setting up iniziale del documento di firebase
                templates: [],
              })
              .then(() => {
                console.log("Documento creato");
              });
          } else {
            console.log("Benvenuto ", shop);
          }
        });

        // Controllo file di installazione
        const id = await getActiveThemeId(shop, accessToken);
        await checkSnippetExists(shop, accessToken, id)
          .then((res) => {
            if (res) {
              // Lo snippet è installato correttamente
              console.log("Snippet Installato correttamente");
            } else {
              // Lo snippet non è installato pertanto va installato
              console.log("Snippet non installato");
              // Caricamento dello snippet su Shopify
              installSnippet(shop, accessToken, id).then((res) => {
                console.log("Snippet caricato con successo");
              });
            }
          })
          .catch((err) => console.log(err));

        // Controllo dello snippet nel file theme.id
        const theme = await snippetExists(shop, accessToken, id);

        if (theme !== true) {
          console.log("provo ad installare lo snippet in theme.liquid");
          addSnippetInsideTheme(shop, accessToken, id, theme)
            .then((res) => {})
            .catch((err) => console.log(err));
        } else {
          console.log("Lo snippet è già inserito in theme.liquid");
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("/api/templates/:shop/:productId", async (ctx) => {
    const { shop, productId } = ctx.params;

    let templates = await getProductTemplates(shop, productId);

    if (!templates) {
      ctx.response.status = 204;
    } else {
      ctx.response.status = 200;
      ctx.response.body = {
        shop: shop,
        produtctId: productId,
        templates: templates,
      };
    }
  });

  router.get("/api/refreshSnippet", verifyRequest(), async (ctx) => {
    const { shop, accessToken } = ctx.session;

    // Controllo file di installazione
    const id = await getActiveThemeId(shop, accessToken);
    await checkSnippetExists(shop, accessToken, id)
      .then((res) => {
        // Caricamento dello snippet su Shopify
        installSnippet(shop, accessToken, id).then((res) => {
          console.log("Snippet caricato con successo");
        });
      })
      .catch((err) => console.log(err));

    // Controllo dello snippet nel file theme.id
    const theme = await snippetExists(shop, accessToken, id);

    if (theme !== true) {
      console.log("provo ad installare lo snippet in theme.liquid");
      addSnippetInsideTheme(shop, accessToken, id, theme)
        .then((res) => {
          console.log("Satus:", res.status, "Body: ", res.body);
        })
        .catch((err) => console.log(err));
    } else {
      console.log("Lo snippet è già inserito in theme.liquid");
    }
  });
  router.get("(.*)", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
