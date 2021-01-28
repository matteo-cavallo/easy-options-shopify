import firestore from "../firebase/config.firebase";

async function getProductTemplates(shop, productId) {
  var templates = [];

  await firestore
    .collection("stores")
    .doc(shop)
    .get()
    .then((doc) => {
      let data = doc.data().templates;
      if (data.length == 0) {
        return null;
      }
      data.forEach((template) => {
        templates.push(template);
      });
    })
    .catch((e) => {
      console.log(e);
      return null;
    });

  return templates;
}

export { getProductTemplates };
