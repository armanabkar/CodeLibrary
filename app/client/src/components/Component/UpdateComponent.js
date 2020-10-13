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

const UpdateComponent = ({ classes, component }) => {
  const currentUser = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(component.title);
  const [description, setDescription] = useState(component.description);
  const [code, setCode] = useState(component.code);
  const [submitting, setSubmitting] = useState(false);
  const isCurrentUser = currentUser.id === component.postedBy.id;

  const handleSubmit = async (event, updateComponent) => {
    event.preventDefault();
    setSubmitting(true);

    updateComponent({
      variables: {
        componentId: component.id,
        title,
        description,
        code,
      },
    });
  };

  return (
    isCurrentUser && (
      <>
        {/* Update Component Button */}
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>

        {/* Update Component Dialog */}
        <Mutation
          mutation={UPDATE_COMPONENT_MUTATION}
          onCompleted={(data) => {
            console.log({ data });
            setSubmitting(false);
            setOpen(false);
            setTitle("");
            setDescription("");
            setCode("");
          }}
        >
          {(updateComponent, { loading, error }) => {
            if (error) return <Error error={error} />;

            return (
              <Dialog open={open} className={classes.dialog}>
                <form
                  onSubmit={(event) => handleSubmit(event, updateComponent)}
                >
                  <DialogTitle>Update Component</DialogTitle>
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
                        "Update Component"
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

const UPDATE_COMPONENT_MUTATION = gql`
  mutation(
    $componentId: Int!
    $title: String
    $code: String
    $description: String
  ) {
    updateComponent(
      componentId: $componentId
      title: $title
      code: $code
      description: $description
    ) {
      component {
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

export default withStyles(styles)(UpdateComponent);
