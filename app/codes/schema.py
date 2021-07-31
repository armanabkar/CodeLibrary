import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from .models import Code
from users.schema import UserType


class CodeType(DjangoObjectType):
    class Meta:
        model = Code


class Query(graphene.ObjectType):
    codes = graphene.List(CodeType, search=graphene.String())

    def resolve_codes(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(code__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            return Code.objects.filter(filter)

        return Code.objects.all()


class CreateCode(graphene.Mutation):
    code = graphene.Field(CodeType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        code = graphene.String()

    def mutate(self, info, title, description, code):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a code.')

        code = Code(title=title, description=description,
                              code=code, posted_by=user)
        code.save()
        return CreateCode(code=code)


class UpdateCode(graphene.Mutation):
    code = graphene.Field(CodeType)

    class Arguments:
        code_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        code = graphene.String()

    def mutate(self, info, code_id, title, code, description):
        user = info.context.user
        existingCode = Code.objects.get(id=code_id)

        if existingCode.posted_by != user:
            raise GraphQLError('Not permitted to update this code.')

        existingCode.title = title
        existingCode.description = description
        existingCode.code = code

        existingCode.save()

        return UpdateCode(code=existingCode)


class DeleteCode(graphene.Mutation):
    code_id = graphene.Int()

    class Arguments:
        code_id = graphene.Int(required=True)

    def mutate(self, info, code_id):
        user = info.context.user
        code = Code.objects.get(id=code_id)

        if code.posted_by != user:
            raise GraphQLError('Not permitted to delete this code.')

        code.delete()

        return DeleteCode(code_id=code_id)


class Mutation(graphene.ObjectType):
    create_code = CreateCode.Field()
    update_code = UpdateCode.Field()
    delete_code = DeleteCode.Field()
