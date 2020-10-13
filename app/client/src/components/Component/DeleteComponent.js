import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import { UserContext } from "../../Root";
import { GET_COMPONENTS_QUERY } from "../../pages/App";

const DeleteComponent = ({ component }) => {
  const currentUser = useContext(UserContext);
  const isCurrentUser = currentUser.id === component.postedBy.id;

  const handleUpdateCache = (cache, { data: { deleteComponent } }) => {
    const data = cache.readQuery({ query: GET_COMPONENTS_QUERY });
    const index = data.components.findIndex(
      (component) => Number(component.id) === deleteComponent.componentId
    );
    // data.components.splice(index, 1)
    const components = [
      ...data.components.slice(0, index),
      ...data.components.slice(index + 1),
    ];
    cache.writeQuery({ query: GET_COMPONENTS_QUERY, data: { components } });
  };

  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_COMPONENT_MUTATION}
        variables={{ componentId: component.id }}
        onCompleted={(data) => {
          console.log({ data });
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_COMPONENTS_QUERY }]}
      >
        {(deleteComponent) => (
          <IconButton onClick={deleteComponent}>
            <TrashIcon />
          </IconButton>
        )}
      </Mutation>
    )
  );
};

const DELETE_COMPONENT_MUTATION = gql`
  mutation($componentId: Int!) {
    deleteComponent(componentId: $componentId) {
      componentId
    }
  }
`;

export default DeleteComponent;
