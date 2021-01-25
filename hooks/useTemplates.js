import { useState } from "@hookstate/core";
import { useEffect } from "react";
import firestore from "../firebase/config.firebase";

export default function useTemplates(shop) {
  // Templates default state
  const templates = useState([]);
  const firstTemplates = useState("");
  let first = true;
  const edits = useState(false);

  function saveTemplatesOnFirestore() {
    const data = JSON.parse(JSON.stringify(templates.get()));

    firestore
      .collection("stores")
      .doc(shop)
      .update({
        templates: data,
      })
      .then(() => {
        console.log("Saved");
        edits.set(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Firebase listener for shop's templates
  useEffect(() => {
    const unsub = firestore
      .collection("stores")
      .doc(shop)
      .onSnapshot((querySnapshot) => {
        let templatesData = [];
        querySnapshot.data().templates.forEach((doc) => {
          templatesData.push(doc);
        });
        templates.set(templatesData);

        if (first) {
          first = false;
          firstTemplates.set(JSON.stringify(templatesData));
        }
      });

    // Unsubscribe from listener
    return () => unsub();
  }, [shop]);

  useEffect(() => {
    // Compare old and new templates state to check if there are modifications
    if (JSON.stringify(templates.get()) != firstTemplates.get()) {
      // There are edits in templates
      edits.set(true);
    } else {
      // There aren't
      edits.set(false);
    }
  }, [JSON.stringify(templates.get())]);

  return { templates, firstTemplates, edits, saveTemplatesOnFirestore };
}
