import * as React from 'react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { gql, useMutation } from '@apollo/client'

const ADD_TODO = gql`
	mutation addTodoMutation($title:String!, $description: String){
		addTodo(input: {title:$title, description:$description}){
			todo {
				id,
				title,
				description,
				checked
			}
			code
			message
		}
  	}
`

const UPDATE_TODO = gql`
	mutation updateTodoMutation($id: Int!, $title: String!, $description: String) {
		updateTodo(where: {id: $id}, input: {title: $title, description: $description}){
			todo {
				id,
				title,
				description,
				checked
			}
			code
			message
		}
	}
`

export default function TodoEditor(props) {
	const { todo } = props
	const [ addTodo, { data: todoData, loading, error } ] = useMutation(ADD_TODO)
	const [ updateTodo, { data: todoDataUpdated, updateLoading } ] = useMutation(UPDATE_TODO)

	React.useEffect(() => {
		if (!loading && todoData) {
			props.onAdded(todoData.addTodo.todo)
		}
	}, [todoData, loading])

	React.useEffect(() => {
		if (!updateLoading && todoDataUpdated) {
			props.onUpdated(todoDataUpdated.updateTodo.todo)
		}
	}, [todoDataUpdated, updateLoading])

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				title: todo?.title,
				description: todo?.description,
			}}
			validationSchema={Yup.object({
				title: Yup.string().required('Required'),
				description: Yup.string(),
			})}
			onSubmit={(values) => {
				if (todo?.id) {
					updateTodo({ variables: {
						id: todo?.id,
						...values,
					}})
				} else {
					addTodo({ variables: {
						...values,
					}})
				}
			}}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				setFieldValue,
			}) => (
				<Form>
					<FormControl 
						fullWidth
						sx={{ 
							marginBottom: {
								xs: 3,
								sm: 4,
							} 
						}}
					>
						<TextField
							name="title"
							label={"Todo name"}
							placeholder={"eg: Write resume to get job at KOSSIE"}
							required={true}
							value={values.title}
							onChange={handleChange}
							size={'small'}
							error={touched.title && Boolean(errors.title)}
							helperText={touched.title && errors.title?.toLocaleString()}
						/>
					</FormControl>

					<FormControl 
						fullWidth
						sx={{ 
							marginBottom: {
								xs: 3,
								sm: 4,
							} 
						}}
					>
						<TextField
							multiline={true}
							minRows={3}
							maxRows={15}
							name="description"
							label={"Description"}
							placeholder={"eg: More detail about this todo"}
							required={true}
							value={values.description}
							onChange={handleChange}
							size={'small'}
							error={touched.description && Boolean(errors.description)}
							helperText={touched.description && errors.description?.toLocaleString()}
						/>
					</FormControl>

					<Button type="submit" variant="contained">
						{todo?.id ? 'Update Todo' : 'Add Todo'}
					</Button>
				</Form>
			)}
		</Formik>
	)
}