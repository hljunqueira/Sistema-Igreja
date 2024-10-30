import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
      light: "#3395ff",
      dark: "#0056b3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#6c757d",
      light: "#868e96",
      dark: "#495057",
      contrastText: "#fff",
    },
    error: {
      main: "#dc3545",
      light: "#e4606d",
      dark: "#9a2530",
    },
    warning: {
      main: "#ffc107",
      light: "#ffcd38",
      dark: "#b28704",
    },
    success: {
      main: "#28a745",
      light: "#34ce57",
      dark: "#1c7430",
    },
    info: {
      main: "#17a2b8",
      light: "#1fc8e3",
      dark: "#117a8b",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 4px 6px rgba(0,0,0,0.05)",
    "0px 6px 8px rgba(0,0,0,0.05)",
    "0px 8px 12px rgba(0,0,0,0.05)",
    "0px 12px 16px rgba(0,0,0,0.05)",
    // ... adicione mais sombras conforme necessário
  ],
});

export default theme;
