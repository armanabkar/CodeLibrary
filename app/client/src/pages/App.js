import React, { useState } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";

import SearchCode from "../components/Component/SearchCode";
import CodeList from "../components/Component/CodeList";
import CreateCode from "../components/Component/CreateCode";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className={classes.container}>
      <SearchCode setSearchResults={setSearchResults} />
      <CreateCode />
      <Query query={GET_CODES_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          const codes = searchResults.length > 0 ? searchResults : data.codes;

          return <CodeList codes={codes} />;
        }}
      </Query>
    </div>
  );
};

export const GET_CODES_QUERY = gql`
  query getCodesQuery {
    codes {
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
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(App);
