import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from .models import Component
from users.schema import UserType


class ComponentType(DjangoObjectType):
    class Meta:
        model = Component


class Query(graphene.ObjectType):
    components = graphene.List(ComponentType, search=graphene.String())

    def resolve_components(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(code__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            return Component.objects.filter(filter)

        return Component.objects.all()


class CreateComponent(graphene.Mutation):
    component = graphene.Field(ComponentType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        code = graphene.String()

    def mutate(self, info, title, description, code):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a component.')

        component = Component(title=title, description=description,
                              code=code, posted_by=user)
        component.save()
        return CreateComponent(component=component)


class UpdateComponent(graphene.Mutation):
    component = graphene.Field(ComponentType)

    class Arguments:
        component_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        code = graphene.String()

    def mutate(self, info, component_id, title, code, description):
        user = info.context.user
        component = Component.objects.get(id=component_id)

        if component.posted_by != user:
            raise GraphQLError('Not permitted to update this component.')

        component.title = title
        component.description = description
        component.code = code

        component.save()

        return UpdateComponent(component=component)


class DeleteComponent(graphene.Mutation):
    component_id = graphene.Int()

    class Arguments:
        component_id = graphene.Int(required=True)

    def mutate(self, info, component_id):
        user = info.context.user
        component = Component.objects.get(id=component_id)

        if component.posted_by != user:
            raise GraphQLError('Not permitted to delete this component.')

        component.delete()

        return DeleteComponent(component_id=component_id)


class Mutation(graphene.ObjectType):
    create_component = CreateComponent.Field()
    update_component = UpdateComponent.Field()
    delete_component = DeleteComponent.Field()
