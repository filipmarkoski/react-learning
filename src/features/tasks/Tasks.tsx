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
import Autocomplete from '@mui/material/Autocomplete'
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect, useState} from "react";
import {red} from '@mui/material/colors';
import {MouseEvent} from 'react';

export interface ITask {
    ID: number,
    Name: string,
    Description: string,
    DateCreated: Date,
    DateModified: Date,
    IsActive: boolean,
    UUID: string
}

type TaskParcel = Pick<ITask, "Name" | "Description">;

export function Tasks() {
    const [checked, setChecked] = React.useState([0]);
    const [task, setTask] = React.useState('');
    const [tasks, setTasks] = useState<ITask[]>([]);

    const optionsTask = tasks.map(task => task.Name);

    useEffect(() => {
        // fetch('http://127.0.0.1:5000/api/tasks')
        fetch('tasks.json', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error(error));
    }, [setTasks]);

    const postTask = () => {
        const taskParcel: TaskParcel = {
            Name: task,
            Description: `${task} Description`
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

        const currentIndex = checked.indexOf(taskID);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(taskID);
        } else {
            newChecked.splice(currentIndex, 1);
        }

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


    return (
        <Box
            sx={{
                border: 1,
                borderRadius: 1,
                padding: 1
            }}
        >

            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={optionsTask}
                sx={{width: 300}}
                renderInput={(params) => <TextField {...params} label="Search Tasks"/>}
            />

            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {tasks.map((task) => {
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

            <Box
                component="form"
                autoComplete="off"
            >
                <Grid container
                      spacing={0}
                      direction="row"
                      alignItems="center"
                      justifyContent="center">
                    <TextField id="outlined-basic" label="Add Task" variant="outlined" size="small" color='success'
                               onChange={(e) => setTask(e.target.value)}/>
                    <Button variant="outlined" color='success' size="medium" sx={{ml: 1, pt: 0.85, pb: 0.85}}
                            onClick={postTask}>Add Task</Button>
                </Grid>
            </Box>

        </Box>
    );
}
