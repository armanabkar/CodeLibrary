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
import DeleteCode from "./DeleteCode";
import AddCode from "./AddCode";

const CodeList = ({ classes, codes }) => (
  <List>
    {codes.map((code) => (
      <ExpansionPanel
        key={code.id}
        style={{ margin: ".5em", borderRadius: "4px" }}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem className={classes.root}>
            <ListItemText
              primaryTypographyProps={{
                variant: "subheading",
                color: "black",
              }}
              primary={code.title}
              secondary={"Created by " + code.postedBy.username}
            />
            <CodeViewer
              currentCode={code.code}
              code={code.title}
              username={code.postedBy.username}
            />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography variant="body1">{code.description}</Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <AddCode code={code} />
          <DeleteCode code={code} />
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
  },
};

export default withStyles(styles)(CodeList);
