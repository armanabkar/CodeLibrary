import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CodeViewer from "../Shared/CodeViewer";
import DeleteComponent from "./DeleteComponent";
import UpdateComponent from "./UpdateComponent";

const ComponentList = ({ classes, components }) => (
  <List>
    {components.map((component) => (
      <ExpansionPanel key={component.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem className={classes.root}>
            <ListItemText
              primaryTypographyProps={{
                variant: "subheading",
                color: "black",
              }}
              primary={component.title}
              secondary={"Created by " + component.postedBy.username}
            />
            <CodeViewer
              code={component.code}
              component={component.title}
              username={component.postedBy.username}
            />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography variant="body1">{component.description}</Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <UpdateComponent component={component} />
          <DeleteComponent component={component} />
        </ExpansionPanelActions>
      </ExpansionPanel>
    ))}
  </List>
);

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  details: {
    alignItems: "center",
    marginLeft: "2rem",
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black",
    },
  }
};

export default withStyles(styles)(ComponentList);
