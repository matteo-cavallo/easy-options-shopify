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
        const { shop } = ctx.state.shopify;

        console.log(ctx.state.shopify);

        const ref = firestore.collection("stores").doc(shop);
        ref.get().then((doc) => {
          if (!doc.exists) {
            console.log("DA CREARE");
            ref
              .set({
                templates: [],
              })
              .then(() => {
                console.log("Documento creato");
              });
          } else {
            console.log("Benvenuto ", shop);
          }
        });

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
  router.get("(.*)", verifyRequest(), async (ctx) => {
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
