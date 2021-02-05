console.log("Easy Options is running");

window.addEventListener("load", async (event) => {
  var product = window.easyOptions.product;
  var shop = window.easyOptions.shop;

  let templates = await fetchTemplates(shop, product.id);

  var easyOptionDiv = document.querySelector("#easy-options");

  console.log(templates.templates);

  // Dichiarazione dello stile CSS custom

  let css = `

  #easy-options {
    margin-bottom: 16px;
  }
#easy-options label {
  font-weight: bold;
}

#easy-options div{
  margin:8px 0px;
}

.eo_text input{
  width: 100%;
}

.eo_description {
  margin-bottom: 8px
}
.eo_radio li{
  display: flex;
  align-items: center;
  height: 40px;
}
.eo_radio input{
  margin-left: 8px;
  margin-right: 8px;
}

.eo_select select {
  width: 100%;
}

  `;

  // Stile HEAD
  let head = document.querySelector("head");
  let style = document.createElement("style");
  style.append(css);
  head.append(style);

  templates.templates.forEach((template) => {
    template.fields.forEach((field) => {
      // Controllo del tipo di field
      //      easyOptionDiv.append(textFieldComponent(field));

      // Text field
      if (field.type == "Text") {
        easyOptionDiv.append(textFieldComponent(field));
      }

      // Select field
      if (field.type == "Select") {
        easyOptionDiv.append(selectFieldComponent(field));
      }

      // Radio button
      if (field.type == "Radio") {
        easyOptionDiv.append(radioFieldComponent(field));
      }
      // Checkbox

      // Button

      // Only text
    });
  });
});

// Rendering del Radio
const radioFieldComponent = (field) => {
  var div = document.createElement("div");
  div.setAttribute("class", "eo_radio");

  // Label
  var label = document.createElement("label");
  label.append(field.label);

  // Description
  var description = document.createElement("p");
  description.append(field.description);
  description.setAttribute("class", "eo_description");

  // Radio
  var ul = document.createElement("ul");
  ul.setAttribute("class", "eo_radio_list");

  field.options.forEach((o) => {
    let li = document.createElement("li");
    let option = document.createElement("input");
    option.setAttribute("type", "radio");
    option.setAttribute("value", o.label);
    option.setAttribute("name", `properties[${field.name}]`);

    let span = document.createElement("span");
    span.append(o.label);

    li.append(option, span);

    ul.append(li);
  });

  div.append(label);
  if (field.description != "") {
    div.append(description);
  }
  div.append(ul);

  return div;
};

// Rendering del Select
const selectFieldComponent = (field) => {
  var div = document.createElement("div");
  div.setAttribute("class", "eo_select");

  // Label
  var label = document.createElement("label");
  label.append(field.label);

  // Description
  var description = document.createElement("p");
  description.append(field.description);
  description.setAttribute("class", "eo_description");

  // Select input
  var select = document.createElement("select");
  select.setAttribute("name", `properties[${field.name}]`);
  field.options.forEach((o) => {
    let option = document.createElement("option");
    option.setAttribute("value", o.label);
    option.append(o.label);

    select.append(option);
  });

  // Composizione
  div.append(label);
  if (field.description != "") {
    div.append(description);
  }
  div.append(select);

  return div;
};

// Rendering del Text
const textFieldComponent = (field) => {
  var div = document.createElement("div");
  div.setAttribute("class", "eo_text");

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  // per far vedere il campo anche nel checkout
  input.setAttribute("name", `properties[${field.name}]`);

  // Check requires field
  if (field.required == true) {
    input.required = true;
  }

  var label = document.createElement("label");
  label.append(field.label);

  let description = document.createElement("p");
  description.append(field.description);
  description.setAttribute("class", "eo_description");
  div.append(label);
  if (field.description != "") {
    div.append(description);
  }
  div.append(input);

  return div;
};

async function fetchTemplates(shop, id) {
  const templates = await fetch(
    `https://c1c8cfb717ea.ngrok.io/api/templates/${shop}/${id}`
  ).then((res) => res.json());
  return templates;
}
