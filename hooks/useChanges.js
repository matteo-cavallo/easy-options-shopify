import { createContext, useContext, useEffect, useState } from "react";

const ChangesContext = createContext();

export function useChanges() {
  return useContext(ChangesContext);
}

export function ChangesProvider({ children }) {
  const [changes, setChanges] = useState([]);

  return (
    <ChangesContext.Provider value={{ changes, setChanges }}>
      {children}
    </ChangesContext.Provider>
  );
}
