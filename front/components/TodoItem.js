import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'

import { gql, useMutation } from '@apollo/client'

const MARKED_CHECKED = gql`
	mutation markedCheckedTodoMutation($id: Int!, $checked: Boolean!) {
		updateTodo(where: {id: $id}, input: {checked: $checked}){
			todo {
				title,
				checked
			}
			code
			message
		}
	}
`

const DELETE_ITEM = gql`
	mutation deleteTodoMutation($id: Int!) {
		deleteTodo(where: {id: $id}){
			todo {
				title,
				description,
				checked
			}
			code
			message
		}
	}
`

export default function TodoItem (props){
	const [markChecked, { data: todo, loading, error }] = useMutation(MARKED_CHECKED)
	const [deleteItem] = useMutation(DELETE_ITEM)
	const [checked, setChecked] = React.useState(false)

	function handleMarkChecked(evt, id) {
		setChecked(evt.target.checked)

		markChecked({ variables: { 
			id: id,
			checked: evt.target.checked
		}})
	}

	function handleDelete(id) {
		props.onDeleted(id)
		deleteItem({ variables: { id: id } })
	}

	function handleEdit(item) {
		props.onEdit(item)
	}

	React.useEffect(() => {
		setChecked(props.todo.checked)
	}, [props.todo])

	return (
		<ListItem
			secondaryAction={
				<>
					<IconButton 
						edge="end" 
						aria-label="delete" 
						onClick={() => handleDelete(props.todo.id)}
					>
						<DeleteIcon />
					</IconButton>

					<IconButton 
						sx={{ marginLeft: 2 }}
						edge="end" 
						aria-label="delete" 
						onClick={() => handleEdit(props.todo)}
					>
						<EditIcon />
					</IconButton>
				</>
			}
		>
			<Checkbox onChange={(evt) => handleMarkChecked(evt, props.todo.id)} checked={checked} />
			<ListItemText
				primary={props.todo.title}
				secondary={props.todo.description}
			/>
		</ListItem>
	)
}