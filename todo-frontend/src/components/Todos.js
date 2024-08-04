import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createTodo,
  deleteTodo,
  updateTodo,
  fetchTodos,
} from "../redux/TodosSlice";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Header from "./Header";

const Todos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const todos = useSelector((state) => state.todos.todos);
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [todoData, setTodoData] = useState({ title: "", description: "" });

  useEffect(() => {
    dispatch(fetchTodos()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleCreateTodo = () => {
    if (!todoData.title || !todoData.description) {
      message.error("Please enter both title and description");
      return;
    }

    dispatch(createTodo(todoData))
      .then(() => {
        setTodoData({ title: "", description: "" });
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Failed to create todo:", error);
        message.error("Failed to create todo. Please try again.");
      });
  };

  const handleUpdateTodo = (id) => {
    if (!todoData.title || !todoData.description) {
      message.error("Please enter both title and description");
      return;
    }

    dispatch(updateTodo(id, todoData))
      .then(() => {
        setEditTodo(null);
        setTodoData({ title: "", description: "" });
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Failed to update todo:", error);
        message.error("Failed to update todo. Please try again.");
      });
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id)).catch((error) => {
      console.error("Failed to delete todo:", error);
      message.error("Failed to delete todo. Please try again.");
    });
  };

  const viewTodoDetails = (id) => {
    navigate(`/todos/${id}`);
  };

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h5" gutterBottom>
          Welcome, {username}!
        </Typography>
        <Button
          onClick={() => setModalOpen(true)}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Create Todo
        </Button>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : todos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "24px" }}>
              No todos for you
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo._id}>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.description}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setEditTodo(todo);
                        setModalOpen(true);
                        setTodoData({
                          title: todo.title,
                          description: todo.description,
                        });
                      }}
                      variant="contained"
                      color="secondary"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTodo(todo._id)}
                      variant="contained"
                      color="error"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => viewTodoDetails(todo._id)}
                      variant="contained"
                      color="info"
                      sx={{ ml: 1 }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {editTodo ? "Edit Todo" : "Create Todo"}
            </Typography>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              variant="outlined"
              value={todoData.title}
              onChange={(e) =>
                setTodoData({ ...todoData, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              variant="outlined"
              value={todoData.description}
              onChange={(e) =>
                setTodoData({ ...todoData, description: e.target.value })
              }
            />
            <Button
              onClick={
                editTodo
                  ? () => handleUpdateTodo(editTodo._id)
                  : handleCreateTodo
              }
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {editTodo ? "Update" : "Create"}
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Todos;
