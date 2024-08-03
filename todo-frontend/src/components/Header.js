import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6">Welcome</Typography>
      <Box>
        <Button
          onClick={() => navigate("/todos")}
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
        >
          Todos
        </Button>
        <Button
          onClick={() => navigate("/sessions")}
          variant="contained"
          color="secondary"
          sx={{ mr: 1 }}
        >
          Sessions
        </Button>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
