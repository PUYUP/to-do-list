from django.test import TestCase
from graphene.test import Client

from graph.schema import schema
from .models import ToDo


class GraphTestCase(TestCase):
	def setUp(self):
		super().setUp()

		# setup graphene client with schema will use later
		self.client = Client(schema)

		# create first todo object
		self.todoObj = ToDo.objects.create(title='meong', description='my lol cat')

	# this test show how add todo
	# because the first todo object has created so this test will create second todo object
	def test_add_todo(self):
		mutation = '''
			mutation addTodoMutation($title: String!, $description: String) {
				addTodo(
					input: {
						title: $title,
						description: $description
					}
				) {
					todo {
						id,
						title,
						description
					},
					code
				}
			}
		'''

		payload = {
			"title": "meong",
			"description": "my lol cat",
		}
		
		executed = self.client.execute(mutation, variables=payload)

		assert executed == {
			"data": {
				"addTodo": {
					"todo": {
						"id": "2",
						"title": "meong",
						"description": "my lol cat"
					},
					"code": "success"
				}
			}
		}

	# this test show how to make todo `checked`
	# use id from first todo object has created before
	def test_checked_todo(self):
		mutation = '''
			mutation markCheckedTodo($id: Int!) {
				updateTodo(
					where:{
						id: $id
					},
					input:{
						checked: true
					}
				) {
					todo{
						id,
						checked
					},
					code
				}
			}
		'''

		payload = {
			"id": 1,
		}

		executed = self.client.execute(mutation, variables=payload)

		assert executed == {
			"data": {
				"updateTodo": {
					"todo": {
						"id": "1",
						"checked": True
					},
					"code": "success"
				}
			}
		}

	# same as mark checked but this only update `title` and `description` field
	def test_updated_todo(self):
		mutation = '''
			mutation markCheckedTodo($id: Int!, $title: String!, $description: String) {
				updateTodo(
					where:{
						id: $id
					},
					input:{
						title: $title,
						description: $description,
					}
				) {
					todo{
						id,
						title,
						description
					},
					code
				}
			}
		'''

		payload = {
			"id": 1,
			"title": "meong updated",
			"description": "my lol funny cat"
		}

		executed = self.client.execute(mutation, variables=payload)

		assert executed == {
			"data": {
				"updateTodo": {
					"todo": {
						"id": "1",
						"title": "meong updated",
						"description": "my lol funny cat"
					},
					"code": "success"
				}
			}
		}

	# retrieves all todo without any parameter
	def test_all_todo(self):
		query = '''
			query allTodoQuery {
				allTodo {
					id,
					title
				}
			}
		'''

		executed = self.client.execute(query)

		assert executed == {
			"data": {
				"allTodo": [
					{
						"id": "1",
						"title": "meong"
					}
				]
			}
		}

	# retrieve single todo
	# use `id` from first todo object has created before
	def test_get_todo_by_id(self):
		query = '''
			query getTodoByIdQuery($id: Int!) {
				getTodoById(id: $id) {
					id,
					title
				}
			}
		'''

		payload = {
			"id": 1
		}

		executed = self.client.execute(query, variables=payload)

		assert executed == {
			"data": {
				"getTodoById": {
					"id": "1",
					"title": "meong"
				}
			}
		}

	# delete todo by `id`
	# on future maybe parameter not only `id`
	def test_delete_todo(self):
		mutation = '''
			mutation deleteTodoMutation($id: Int!) {
				deleteTodo(
					where: {
						id: $id
					}
				) {
					todo {
						id,
						title
					}
				}
			}
		'''

		payload = {
			"id": 1
		}

		executed = self.client.execute(mutation, variables=payload)
		assert executed == {
			"data": {
				"deleteTodo": {
					"todo": {
						"id": "1",
						"title": "meong"
					}
				}
			}
		}

	# test todo exist or not
	def test_not_found_todo(self):
		query = '''
			query getTodoByIdQuery($id: Int!) {
				getTodoById(id: $id) {
					id,
					title
				}
			}
		'''

		payload = {
			"id": 10
		}

		executed = self.client.execute(query, variables=payload)

		assert executed == {
			"data": {
				"getTodoById": None
			}
		}
