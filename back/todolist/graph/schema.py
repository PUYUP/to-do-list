import graphene

from todo import schema as todo_schema


class Query(
        todo_schema.ToDoQuery,
        graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    add_todo = todo_schema.TodoAddMutation.Field()
    delete_todo = todo_schema.TodoDeleteMutation.Field()
    update_todo = todo_schema.TodoUpdateMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
