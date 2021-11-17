import './App.css';
import {Tasks} from './features/tasks/Tasks';
import Grid from '@mui/material/Grid'

function App() {
    return (
        <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{minHeight: '100vh'}}>
            <div className="App">
                <Tasks />
            </div>
        </Grid>
    );
}

export default App;
