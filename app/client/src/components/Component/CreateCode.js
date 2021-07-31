import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

import { GET_CODES_QUERY } from "../../pages/App";
import Error from "../Shared/Error";

const CreateCode = ({ classes }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateCache = (cache, { data: { createCode } }) => {
    const data = cache.readQuery({ query: GET_CODES_QUERY });
    const codes = data.codes.concat(createCode.code);
    cache.writeQuery({ query: GET_CODES_QUERY, data: { codes } });
  };

  const handleSubmit = async (event, createCode) => {
    event.preventDefault();
    setSubmitting(true);
    createCode({ variables: { title, description, code } });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="fab"
        className={classes.fab}
        color="secondary"
      >
        {open ? <ClearIcon /> : <AddIcon />}
      </Button>

      <Mutation
        mutation={CREATE_CODE_MUTATION}
        onCompleted={(data) => {
          console.log({ data });
          setSubmitting(false);
          setOpen(false);
          setTitle("");
          setDescription("");
          setCode("");
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_CODES_QUERY }]}
      >
        {(createCode, { loading, error }) => {
          if (error) return <Error error={error} />;

          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={(event) => handleSubmit(event, createCode)}>
                <DialogTitle>Create Code</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description & Code
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label="Title"
                      placeholder="Add Title"
                      onChange={(event) => setTitle(event.target.value)}
                      value={title}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      rows="4"
                      label="Description"
                      placeholder="Add Description"
                      onChange={(event) => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      rows="4"
                      label="Code"
                      placeholder="Add Code"
                      onChange={(event) => setCode(event.target.value)}
                      value={code}
                      className={classes.textField}
                    />
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting ||
                      !title.trim() ||
                      !description.trim() ||
                      !code
                    }
                    type="submit"
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} size={24} />
                    ) : (
                      "Add Code"
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          );
        }}
      </Mutation>
    </>
  );
};

const CREATE_CODE_MUTATION = gql`
  mutation ($title: String!, $description: String!, $code: String!) {
    createCode(title: $title, description: $description, code: $code) {
      code {
        id
        title
        description
        code
        postedBy {
          id
          username
        }
      }
    }
  }
`;

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550,
  },
  textField: {
    margin: theme.spacing.unit,
  },
  cancel: {
    color: "red",
  },
  save: {
    color: "green",
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  icon: {
    marginLeft: theme.spacing.unit,
  },
  input: {
    display: "none",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200",
  },
});

export default withStyles(styles)(CreateCode);
