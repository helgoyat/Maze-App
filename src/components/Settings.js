import React from 'react';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    editBlock: {
        '&:hover': {
            color: theme => theme.color.main,
        },
        '&:hover > .fas:hover': {
            color: theme => theme.color.main,
            cursor: 'pointer',
        },
    },
});

export default function SettingsArea(props)
{
    const { maze, theme } = props;
    const classes = useStyles(theme);

    const nbColumns = maze[0].length;
    const nbRows = maze.length;

    return (
        <div className="edit-container">
            <div className={clsx(classes.editBlock, 'edit-block')}>
                <i onClick={() => props.changeSize(0)} className="fas fa-minus-circle"></i>
                <font>{nbRows} rows</font>
                <i onClick={() => props.changeSize(1)} className="fas fa-plus-circle"></i>
            </div>
            <div className={clsx(classes.editBlock, 'edit-block')}>
                <i onClick={() => props.changeSize(2)} className="fas fa-minus-circle"></i>
                <font>{nbColumns} columns</font>
                <i onClick={() => props.changeSize(3)} className="fas fa-plus-circle"></i>
            </div>
        </div>
    );
}