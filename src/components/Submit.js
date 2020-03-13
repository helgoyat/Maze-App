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
    const { isSearchBtn, isSolved, theme } = props;
    const classes = useStyles(theme);

    return (
        <React.Fragment>
            {
                !isSearchBtn ?
                    <div className={isSolved ? 'result-yes' : 'result-no'}>{isSolved ? 'Solved!' : 'No path were found.'}</div> :
                    <button onClick={props.calculatePath} className={classes.button}>Search</button>
            }
        </React.Fragment>
    )
}