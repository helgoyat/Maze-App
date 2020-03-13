import React from 'react';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    editBlock: {
        flex: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        padding: 6,
        backgroundColor: '#121212',
        borderRadius: 30,
        border: '1px solid #090909',
        color: '#383838',
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
    const { pot, theme } = props;
    const classes = useStyles(theme);

    const nbColumns = pot[0].length;
    const nbRows = pot.length;

    return (
        <div className="edit-container">
            <div className={clsx(classes.editBlock, 'edit-block')}>
                <i onClick={() => props.changeSize('minus', 'row')} className="fas fa-minus-circle"></i>
                <font>{nbRows} rows</font>
                <i onClick={() => props.changeSize('plus', 'row')} className="fas fa-plus-circle"></i>
            </div>
            <div className={clsx(classes.editBlock, 'edit-block')}>
                <i onClick={() => props.changeSize('minus', 'col')} className="fas fa-minus-circle"></i>
                <font>{nbColumns} columns</font>
                <i onClick={() => props.changeSize('plus', 'col')} className="fas fa-plus-circle"></i>
            </div>
        </div>
    );
}