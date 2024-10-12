// import { createContext, useState, useContext } from 'react';
// import PropTypes from 'prop-types';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [themeMode, setThemeMode] = useState('light');

//   const toggleTheme = () => {
//     setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// ThemeProvider.propTypes = {
//   children: PropTypes.node.isRequired, 
// };

// const useTheme = () => {
//   return useContext(ThemeContext);
// };

// export default useTheme;
