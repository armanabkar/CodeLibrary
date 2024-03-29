import graphene
import codes.schema
import users.schema
import graphql_jwt


class Query(users.schema.Query, codes.schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, codes.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
