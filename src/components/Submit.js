import React from 'react';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    button: {
        color: theme => theme.color.main,
        borderColor: theme => theme.color.main,
        '&:hover': {
            backgroundColor: theme => theme.color.main,
        },
    },
});

export default function ControlArea(props)
{
    const { isSearchBtn, solution, theme } = props;

    const classes = useStyles(theme);
    const isSolved = (solution !== null);

    return (
        <React.Fragment>
            {
                !isSearchBtn ?
                    <div className={isSolved ? 'result-yes' : 'result-no'}>{isSolved ? 'Solved!' : 'No path were found.'}</div> :
                    <button onClick={props.solve} className={classes.button}>Search</button>
            }
        </React.Fragment>
    );
}