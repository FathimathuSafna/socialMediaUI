import { createContext, useState } from 'react';

export const AppContext = createContext(null);

export default function Context({ children }) {
  const [state, setstate] = useState(10);

  return (
    <AppContext.Provider value={{ data: state }}>
      {children}
    </AppContext.Provider>
  );
}
