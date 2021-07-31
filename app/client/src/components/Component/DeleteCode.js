import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import { UserContext } from "../../Root";
import { GET_CODES_QUERY } from "../../pages/App";

const DeleteCode = ({ code }) => {
  const currentUser = useContext(UserContext);
  const isCurrentUser = currentUser.id === code.postedBy.id;

  const handleUpdateCache = (cache, { data: { deleteCode } }) => {
    const data = cache.readQuery({ query: GET_CODES_QUERY });
    const index = data.codes.findIndex(
      (code) => Number(code.id) === deleteCode.codeId
    );
    // data.codes.splice(index, 1)
    const codes = [
      ...data.codes.slice(0, index),
      ...data.codes.slice(index + 1),
    ];
    cache.writeQuery({ query: GET_CODES_QUERY, data: { codes } });
  };

  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_CODE_MUTATION}
        variables={{ codeId: code.id }}
        onCompleted={(data) => {
          console.log({ data });
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_CODES_QUERY }]}
      >
        {(deleteCode) => (
          <IconButton onClick={deleteCode}>
            <TrashIcon />
          </IconButton>
        )}
      </Mutation>
    )
  );
};

const DELETE_CODE_MUTATION = gql`
  mutation ($codeId: Int!) {
    deleteCode(codeId: $codeId) {
      codeId
    }
  }
`;

export default DeleteCode;
