import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ExtensionIcon from "@material-ui/icons/Extension";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

const Header = ({ classes }) => {
  return (
    <AppBar position="static" className={classes.root} color="white">
      <Toolbar>
        {/* Title / Logo */}
        <Link to="/" className={classes.grow}>
          <ExtensionIcon className={classes.logo} />
          <Typography variant="headline" className={classes.logoText} noWrap>
            ReusableComponents
          </Typography>
        </Link>

        {/* Signout Button */}
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
    color: "black",
    fontWeight: 500,
  },
});

export default withStyles(styles)(Header);
