import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

const Header = ({ classes }) => {
  return (
    <AppBar
      position="static"
      elevation="false"
      className={classes.root}
      color="primary"
    >
      <Toolbar>
        <Link to="/" className={classes.grow}>
          <Typography variant="headline" className={classes.logoText} noWrap>
            CODE LIBRARY
          </Typography>
        </Link>
        <Signout />
      </Toolbar>
    </AppBar>
  );
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logo: {
    marginRight: theme.spacing.unit,
    fontSize: 35,
    color: "#FFAF3A",
  },
  faceIcon: {
    marginRight: theme.spacing.unit,
    fontSize: 25,
    color: "black",
  },
  logoText: {
    color: "white",
    fontWeight: 500,
  },
});

export default withStyles(styles)(Header);
