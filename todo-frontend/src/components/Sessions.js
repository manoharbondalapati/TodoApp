import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSessions } from "../redux/SessionsSlice";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sessions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessions = useSelector((state) => state.sessions.sessions);
  const loading = useSelector((state) => state.sessions.loading);
  const error = useSelector((state) => state.sessions.error);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Sessions
      </Typography>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() => navigate("/todos")}
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
        >
          Todos
        </Button>
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          color="secondary"
        >
          Logout
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>IP Address</TableCell>
            <TableCell>Login Time</TableCell>
            <TableCell>Logout Time</TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions?.map((session) => (
            <TableRow key={session._id}>
              <TableCell>{session.ipAddress}</TableCell>
              <TableCell>{new Date(session.loginTime).toLocaleString()}</TableCell>
              <TableCell>
                {session.logoutTime
                  ? new Date(session.logoutTime).toLocaleString()
                  : "Active"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Sessions;
