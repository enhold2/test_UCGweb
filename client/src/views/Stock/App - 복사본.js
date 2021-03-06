import React, { Component } from 'react';
/*import logo from './logo.svg';*/
import './App.css';
import Customer from './Components/Customer/Customer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomerAdd from './Components/Customer/CustomerAdd';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';


const styles= theme => ({
  root : {
    width : '100%',
    miniwidth:1000
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper:{
    marginLeft:18,
    marginRight:18
  },
  progress : { 
    margin: theme.spacing.unit * 2
  },
  tableHead: {
    fontSize :'1.0rem'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
})


class App extends Component {


constructor(props) {
    super(props);
    this.state = {  
      customers: '',  
      completed: 0 ,
      searchKeyword: ''
    }  
    this.stateRefresh = this.stateRefresh.bind(this);  
    this.handleValueChange = this.handleValueChange.bind(this)
  }
  
  stateRefresh() {  
    this.setState({ 
      customers: '', 
      completed: 0,
      searchKeyword : ''
    }); 
    this.callApi()
    .then(res => this.setState({customers: res}))
    .catch(err => console.log(err));
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20); /* progress 0.02????????? */
    this.callApi()
      .then(res => this.setState({customers: res}))
      .catch(err => console.log(err)); 
  }

  callApi = async () => {
    const response = await fetch('/api/customer');
    const body = await response.json();
    return body;
  }
  
  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }
    
    
  render() {
    const filteredComponents = (data) => {
        data = data.filter((c) => {
        return c.name.indexOf(this.state.searchKeyword) > -1;
        });
        return data.map((c) => {
        return <Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
        });
    }
       
    const { classes} = this.props;
    const cellList =["No.","Image","Name","Birthday","Gender","Department","Delete"]
    return (
      <div className={classes.root}>
          <AppBar position="static">
          <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
          <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
           ?????? ?????????
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
          <div className={classes.searchIcon}>
          <SearchIcon />
          </div>
          <InputBase
          placeholder="????????????"
          classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
          }}
          name="searchKeyword"
          vlaue={this.state.searchKeyword}
          onChange={this.handleValueChange}
          />
          </div>
          </Toolbar>
          </AppBar>
        <div className={classes.menu}>
        <CustomerAdd stateRefresh={this.stateRefresh} />
        </div>      
        <Paper className={classes.root}>
          <Table className = {classes.Table}>
          <TableHead>
              <TableRow>
                {cellList.map(c => {
                  return<TableCell class className={classes.tableHead}>{c}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              { /*customers ? ?????? ?????????????????? */
                this.state.customers ? 
                filteredComponents(this.state.customers) :

/*
                this.state.customers.map(c => {
                  return(
                    <Customer
                      stateRefresh={this.stateRefresh}
                      key={c.id} 
                      id={c.id}
                      image={c.image}
                      name={c.name}
                      birthday={c.birthday}
                      gender={c.gender}
                      job={c.job}
                    />
                  )

              }) : */

                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress />
                    <CircularProgress color="secondary" />
                    <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
                  </TableCell>
                </TableRow>
              }


            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}



export default withStyles(styles)(App);
