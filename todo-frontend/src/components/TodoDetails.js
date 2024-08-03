import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoById } from "../redux/TodosSlice";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import Header from "./Header";

const TodoDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const todo = useSelector((state) => state.todos.todo);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);
  const username = localStorage.getItem("username");

  useEffect(() => {
    dispatch(fetchTodoById(id));
  }, [id, dispatch]);

  if (loading) return <CircularProgress />;

  if (error)
    return <Typography color="error">Failed to fetch todo details</Typography>;

  if (!todo) return <Typography>No Todo Found</Typography>;

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h5" gutterBottom>
          Welcome, {username}!
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6">Title: {todo.title}</Typography>
          <Typography variant="body1">
            Description: {todo.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/todos")}
          >
            Back to Todos
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default TodoDetails;
