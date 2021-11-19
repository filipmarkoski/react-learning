import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect, useState} from "react";
import {red} from '@mui/material/colors';
import {MouseEvent} from 'react';
import {ChangeEvent} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Accordion, AccordionDetails, AccordionSummary, Paper, Stack} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

export interface ITask {
    ID: number,
    Name: string,
    Description: string,
    DateCreated: Date,
    DateModified: Date,
    IsActive: boolean,
    UUID: string
}

type TaskParcel = Pick<ITask, 'Name' | 'Description'>;

export function Tasks() {
    const [checked, setChecked] = useState([0]);
    const [task, setTask] = useState<ITask>();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [featuredTasks, setFeaturedTasks] = useState<ITask[]>([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        // fetch('http://127.0.0.1:5000/api/tasks')
        fetch('tasks.json', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
            .then(response => response.json())
            .then(tasks => {
                setTasks(tasks);
                setFeaturedTasks(tasks);
                let task: ITask = tasks[0];
                setTask(task);
            })
            .catch(error => console.error(error));
    }, [setTasks, setTask]);

    const postTask = () => {
        const taskParcel: TaskParcel = {
            Name: task?.Name ?? 'TaskName',
            Description: `${'task?.Name'} Description`
        }

        fetch('http://127.0.0.1:5000/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskParcel)
        })
            .then(response => response.json())
            .then(responseTask => setTasks([...tasks, responseTask]))
            .catch(error => console.error(error));
    };

    // TODO
    const deleteTask = (taskID: number) => {
        fetch(`http://127.0.0.1:5000/api/tasks/${taskID}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(responseTaskID => setTasks(tasks.filter(t => t.ID !== responseTaskID.ID)))
            .catch(error => console.error(error));
    };

    // : ((event: MouseEvent) => void)
    const toggle = (event: MouseEvent, taskID: number) => {
        event.preventDefault();
        setOpen(true);
        const currentIndex = checked.indexOf(taskID);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(taskID);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        let selectedTask: ITask = tasks.filter(task => task.ID === taskID)[0];
        setTask(selectedTask);

        if (event.shiftKey) {
            console.log('Shift-Click recognized.');

            if (newChecked.length === 3) {
                let startValue: number = tasks.map(task => task.ID).indexOf(newChecked[1]);
                let endValue: number = tasks.map(task => task.ID).indexOf(newChecked[2]);
                let minValue: number = Math.min(startValue, endValue);
                let maxValue: number = Math.max(startValue, endValue) + 1;
                setChecked([0, ...tasks.slice(minValue, maxValue).map(task => task.ID)]);
                return;
            }
        }
        setChecked(newChecked);
    };

    const handleSearch = (event: ChangeEvent) => {
        event.preventDefault();
        const target = event.target as HTMLTextAreaElement;
        let value = target.value;
        if (value === null || value === '') {
            setFeaturedTasks(tasks);
            return;
        }
        setFeaturedTasks(tasks.filter(task => task.Name.includes(value)));
    };

    return (

        <Grid container
              direction='row'
              justifyContent='center'
              alignItems='stretch'
              sx={{
                  minHeight: 400,
                  margin: 16,
                  background: 'yellow'
              }}
        >

            <Grid
                item xs={6}
                sx={{
                    border: 1,
                    borderRadius: 1,
                    padding: 1,
                    bgcolor: 'orange'
                }}
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
            >
                <TextField id="standard-basic" variant="standard"
                           onChange={handleSearch}
                           label={'Search the tasks...'}
                />
                <List sx={{bgcolor: 'background.paper'}}>
                    {featuredTasks.map((task) => {
                        const labelId = `checkbox-list-label-${task.ID}`;

                        return (
                            <ListItem
                                key={task.ID}
                                onClick={(event) => toggle(event as MouseEvent, task.ID)}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments"
                                                onClick={() => deleteTask(task.ID)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                }
                                disablePadding
                            >

                                <ListItemButton dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(task.ID) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                            sx={{
                                                color: red[800],
                                                '&.Mui-checked': {
                                                    color: red[600],
                                                },
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={`${task.Name}`}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                {/* Add Task */} <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Add Task</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Box
                        component="form"
                        autoComplete="off"
                    >
                        <Grid container
                              spacing={0}
                              direction="row"
                              alignItems="center"
                              justifyContent="center">
                            <TextField id="outlined-basic" label="Task Name..." variant="outlined" size="small"
                                       color='success'
                                       onChange={(e) => console.log(e.target.value)}/>
                            <Button variant="outlined" color='success' size="medium"
                                    sx={{ml: 1, pt: 0.85, pb: 0.85}}
                                    onClick={postTask}>Add Task</Button>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            </Grid>

            {/* Card */}
            <Grid item xs={6} component={Card} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch'}}
                  sx={{bgcolor: 'red',}}>
                <Collapse in={open} timeout="auto">
                    <CardContent>
                        <Stack direction="row"
                               justifyContent="space-between"
                               alignItems="baseline"
                               spacing={2}
                        style={{position: 'fixed', margin: 0,
    top: 'auto',}}>
                            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                Task #{task?.ID}
                            </Typography>
                            <IconButton onClick={() => {
                                setOpen(false)
                            }}>
                                <CloseIcon/>
                            </IconButton>

                        </Stack>

                        <Typography variant="h5" component="div">
                            {task?.Name}
                        </Typography>
                        <Typography sx={{mb: 1.5}} color="text.secondary">
                            {task?.Description}
                        </Typography>
                        <Typography variant="body2">
                            {task?.DateCreated}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Grid>


        </Grid>


    );
}
