import * as React from 'react'
import Head from 'next/head'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { gql, useQuery } from '@apollo/client';

import TodoItem from '../components/TodoItem';
import TodoEditor from '../components/TodoEditor';

const ALL_TODO = gql`
  query {
    allTodo{
      id
      title
      description
      checked
    }
  }
`

export default function Home() {
  const [openEditor, setOpenEditor] = React.useState(false);
  const [data, setData] = React.useState([])
  const [todoItem, setTodoItem] = React.useState({})
  const { data: todoData, loading, error } = useQuery(ALL_TODO)

  React.useEffect(() => {
    if (!loading && !error) {
      setData(todoData.allTodo)
    }
  }, [todoData])

  function handleTodoAdded(todo) {
    setData([{ ...todo }, ...data])
  }

  function handleDeleteItem(id) {
    var filtered = data.filter(function (value, index, arr) {
      return value.id != id;
    });
    setData(filtered)
  }

  function handleEditItem(item) {
    setTodoItem(item)
    setOpenEditor(true)
  }

  function handleCancelEdit() {
    setOpenEditor(false)
  }

  function handleUpdated(item) {
    setOpenEditor(false)

    var filtered = data.map(function (value, index, arr) {
      if (value.id == item.id) {
        return item
      }
    });
    setData(filtered)
  }

  return (
    <>
      <Head>
        <title>To Do List App</title>
        <meta name="description" content="Simple to do list" />
      </Head>

      <main>
        <Typography variant='h1'>Simple To Do List</Typography>

        <Container>
          <Grid container spacing={2}>
            <Grid item>
              <Box>
                <Card>
                  <CardContent>
                    <TodoEditor onAdded={handleTodoAdded} />
                  </CardContent>
                </Card>
              </Box>

              {loading &&
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                  <CircularProgress />
                </Box>
              }

              {(!loading && data) ? (
                <List dense>
                  {data.map((val, idx) => {
                    return (
                      <TodoItem key={idx} todo={val} onDeleted={handleDeleteItem} onEdit={handleEditItem} />
                    )
                  })}
                </List>
              ) : (
                <Typography variant='p'>Currently empty</Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </main>

      <Dialog open={openEditor} onClose={handleCancelEdit} fullWidth maxWidth="xs">
        <DialogTitle>Change Todo Detail</DialogTitle>
        <DialogContent>
          <Box paddingTop={1}>
            <TodoEditor todo={todoItem} onUpdated={handleUpdated} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
