import React, { useState } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";

import SearchComponents from "../components/Component/SearchComponents";
import ComponentList from "../components/Component/ComponentList";
import CreateComponent from "../components/Component/CreateComponent";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className={classes.container}>
      <SearchComponents setSearchResults={setSearchResults} />
      <CreateComponent />
      <Query query={GET_COMPONENTS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          const components =
            searchResults.length > 0 ? searchResults : data.components;

          return <ComponentList components={components} />;
        }}
      </Query>
    </div>
  );
};

export const GET_COMPONENTS_QUERY = gql`
  query getComponentsQuery {
    components {
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
