console.log("Easy Options is running");

window.addEventListener("load", async (event) => {
  var product = window.easyOptions.product;
  var shop = window.easyOptions.shop;

  let templates = await fetchTemplates(shop, product.id);

  var easyOptionDiv = document.querySelector("#easy-options");

  console.log(templates.templates);

  templates.templates.forEach((template) => {
    template.fields.forEach((field) => {
      // Controllo del tipo di field
      easyOptionDiv.append(textFieldComponent(field));

      // :TODO Select

      //
    });
  });
});

// Rendering del Text
const textFieldComponent = (field) => {
  var div = document.createElement("div");

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  // per far vedere il campo anche nel checkout
  input.setAttribute("name", `properties[${field.name}]`);

  var label = document.createElement("label");
  label.append(field.label);

  div.append(label);
  div.append(input);

  return div;
};

async function fetchTemplates(shop, id) {
  const templates = await fetch(
    `https://4dbbad62a3e7.ngrok.io/api/templates/${shop}/${id}`
  ).then((res) => res.json());
  return templates;
}
