import React, { useState, useRef } from "react";
import { ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const SearchCode = ({ classes, setSearchResults }) => {
  const [search, setSearch] = useState("");
  const inputEl = useRef();

  const clearSearchInput = () => {
    setSearchResults([]);
    setSearch("");
    inputEl.current.focus();
  };

  const handleSubmit = async (event, client) => {
    event.preventDefault();
    const res = await client.query({
      query: SEARCH_CODE_QUERY,
      variables: { search },
    });
    setSearchResults(res.data.codes);
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <form onSubmit={(event) => handleSubmit(event, client)}>
          <Paper className={classes.root} elevation={1}>
            <IconButton onClick={clearSearchInput}>
              <ClearIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Search All Codes"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(event) => setSearch(event.target.value)}
              value={search}
              inputRef={inputEl}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </form>
      )}
    </ApolloConsumer>
  );
};

const SEARCH_CODE_QUERY = gql`
  query ($search: String) {
    codes(search: $search) {
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
`;

const styles = (theme) => ({
  root: {
    padding: "2px 4px",
    margin: theme.spacing.unit,
    display: "flex",
    alignItems: "center",
  },
});

export default withStyles(styles)(SearchCode);
