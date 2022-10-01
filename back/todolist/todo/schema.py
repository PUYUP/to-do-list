import graphene
import copy

from django.utils.translation import gettext_lazy as _
from django.utils.encoding import smart_str
from django.core.exceptions import ObjectDoesNotExist

from graphene_django import DjangoObjectType

from .models import ToDo


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class ToDoQuery(graphene.ObjectType):
    allTodo = graphene.List(ToDoType)
    getTodoById = graphene.Field(ToDoType, id=graphene.Int())

    def resolve_allTodo(root, info):
        return ToDo.objects.all().order_by('-created')

    def resolve_getTodoById(root, info, id):
        try:
            return ToDo.objects.get(id=id)
        except ObjectDoesNotExist:
            return None


class TodoInputType(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    checked = graphene.Boolean()


class TodoUpdateInputType(TodoInputType):
    title = graphene.String(required=False)


class TodoWhereType(graphene.InputObjectType):
    id = graphene.Int(required=True)


class TodoAddMutation(graphene.Mutation):
    class Arguments:
        input = TodoInputType(required=True)

    todo = graphene.Field(ToDoType)
    code = graphene.String()
    message = graphene.String()

    @classmethod
    def mutate(cls, root, info, **data):
        try:
            input = data.get('input', {})
            instance = ToDo.objects.create(**input)
            return TodoAddMutation(todo=instance, code='success', message=_('Todo added success'))
        except Exception as e:
            return TodoAddMutation(code='wrong_value', message=smart_str(e))


class TodoUpdateMutation(graphene.Mutation):
    class Arguments:
        where = TodoWhereType(required=True)
        input = TodoUpdateInputType(required=True)

    todo = graphene.Field(ToDoType)
    code = graphene.String()
    message = graphene.String()

    @classmethod
    def mutate(cls, root, info, **data):
        try:
            where = data.get('where')
            id = where.get('id')
            input = data.get('input')

            obj = ToDo.objects.get(id=id)

            for key in input:
                setattr(obj, key, input.get(key))
            obj.save()

            return TodoUpdateMutation(todo=obj, code='success', message=_('Todo update success'))
        except ObjectDoesNotExist as e:
            return TodoUpdateMutation(code='not_found', message=smart_str(e))


class TodoDeleteMutation(graphene.Mutation):
    class Arguments:
        where = TodoWhereType(required=True)

    todo = graphene.Field(ToDoType)
    code = graphene.String()
    message = graphene.String()

    @classmethod
    def mutate(cls, root, info, **data):
        try:
            id = data.get('where').get('id')
            instance = ToDo.objects.get(id=id)
            old_instance = copy.copy(instance)
            instance.delete()

            return TodoDeleteMutation(todo=old_instance, code='success', message=_('Todo deleted success'))
        except ObjectDoesNotExist as e:
            return TodoDeleteMutation(code='not_found', message=smart_str(e))
