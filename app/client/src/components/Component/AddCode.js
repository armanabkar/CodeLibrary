import React, { useState, useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { UserContext } from "../../Root";
import Error from "../Shared/Error";

const AddCode = ({ classes, code }) => {
  const currentUser = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(code.title);
  const [description, setDescription] = useState(code.description);
  const [currentCode, setCode] = useState(code.code);
  const [submitting, setSubmitting] = useState(false);
  const isCurrentUser = currentUser.id === code.postedBy.id;

  const handleSubmit = async (event, updateCode) => {
    event.preventDefault();
    setSubmitting(true);

    updateCode({
      variables: {
        codeId: code.id,
        title,
        description,
        code: currentCode,
      },
    });
  };

  return (
    isCurrentUser && (
      <>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>

        <Mutation
          mutation={UPDATE_CODE_MUTATION}
          onCompleted={(data) => {
            console.log({ data });
            setSubmitting(false);
            setOpen(false);
            setTitle("");
            setDescription("");
            setCode("");
          }}
        >
          {(updateCode, { loading, error }) => {
            if (error) return <Error error={error} />;

            return (
              <Dialog open={open} className={classes.dialog}>
                <form onSubmit={(event) => handleSubmit(event, updateCode)}>
                  <DialogTitle>Update Code</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Update the Title, Description & Code
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
                        value={currentCode}
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
                        !currentCode
                      }
                      type="submit"
                      className={classes.save}
                    >
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        "Update Code"
                      )}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            );
          }}
        </Mutation>
      </>
    )
  );
};

const UPDATE_CODE_MUTATION = gql`
  mutation (
    $codeId: Int!
    $title: String
    $code: String
    $description: String
  ) {
    updateCode(
      codeId: $codeId
      title: $title
      code: $code
      description: $description
    ) {
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
});

export default withStyles(styles)(AddCode);
