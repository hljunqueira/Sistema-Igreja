import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff", // Defina a cor primária da sua aplicação aqui
    },
    secondary: {
      main: "#6c757d", // Defina a cor secundária da sua aplicação aqui
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Defina a família de fontes que você usará
  },
  // Adicione outras personalizações de tema aqui, se necessário
});

export default theme;
