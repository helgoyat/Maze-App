import React, { Component } from 'react';
// Components
import Submit from './components/Submit';
import Settings from './components/Settings';
// Style
import './assets/Styles.css';
// Themes
import Themes from './assets/Themes.js';

class App extends Component
{
    constructor()
    {
        super();
        this.initialMaze = {
            maze: null,
            start: { row: 0, col: 0 },
            target: { row: 0, col: 0 },
            isGenerated: false,
            isAnimation: false,
        };
        this.initialState = {
            isSolved: false,
            solutions: [],
            solution: null,
            isSearchBtn: true,
            leadCursor: 1,
        };
        this.state = {
            ...this.initialState,
            ...this.initialMaze,
            themes: Themes,
            activeTheme: 0,
        };
        this.generateMaze = this.generateMaze.bind(this);
        this.calculatePath = this.calculatePath.bind(this);
        this.searchPath = this.searchPath.bind(this);
        this.changeBlockType = this.changeBlockType.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.startAnimation = this.startAnimation.bind(this);
    }

    componentDidMount()
    {
        // Generate a square maze (5 by 5)
        this.generateMaze(5, 5);
    }

    /**
     * Generate random number 
     * from 0 (included) to limit (excluded)
     * @param {int} limit 
     */
    random(limit)
    {
        return Math.floor(Math.random() * limit);
    }

    /**
     * Generate Maze with set width and height
     * Fill maze with random number for UI representation
     * Set start and target points
     * @param {int} width 
     * @param {int} height 
     */
    generateMaze(width, height)
    {
        // Reset previous maze values
        this.setState({ ...this.initialState, ...this.initialMaze }, () =>
        {
            // Declare and assign a 2D array
            const array = [[]];

            // Fill with values 0
            for (let i = 0; i < width; ++i)
            {
                array[0].push(0);
            }
            for (let i = 1; i < height; ++i)
            {
                array.push(array[0]);
            }

            // Create maze and assign in 2D array 
            // random values in range [0-3]
            const maze = array.map(row => row.map(() => this.random(4)));

            // Create start and target points
            const start = {
                row: this.random(height),
                col: this.random(width)
            };
            const target = {};
            do
            {
                target.row = this.random(height);
                target.col = this.random(width);
            }
            while ((target.row === start.row) || (target.col === start.col));

            // Change the maze's start and target locations values to 0
            // i.e. make sure both start and target points
            // are placed on a 'path' (and not on an 'obstacle')
            maze[start.row][start.col] = 0;
            maze[target.row][target.col] = 0;

            // Set state with results
            this.setState({
                maze,
                start,
                target,
                isGenerated: true
            });
        });
    }

    calculatePath()
    {
        const { maze, start } = this.state;

        const height = maze.length;
        const width = maze[0].length;

        // Solution array
        const arraySol = [[]];

        // Fill solution array with 0
        for (let i = 0; i < width; ++i)
        {
            arraySol[0].push(0);
        }
        for (let i = 1; i < height; ++i)
        {
            arraySol.push(arraySol[0]);
        }

        // Start search
        this.searchPath(start, arraySol);

        // // Display result
        // const { solutions } = this.state;
        // const isSolved = (solutions.length > 0);
        // solutions.sort(function (a, b) { return a.pathLength - b.pathLength; });
        // const solution = (solutions.length > 0) ? solutions[0] : null;
        // this.setState({ isSearchBtn: false, isSolved, solution }, () =>
        // {
        //     if (isSolved)
        //     {
        //         this.startAnimation();
        //     }
        // });
    }

    searchPath(pt, arraySol, prevCount = 0)
    {
        const { maze, target } = this.state;
        // CURRENT VALUE
        const value = maze[pt.row][pt.col];
        // VARIABLES
        const height = (maze.length - 1);
        const width = (maze[0].length - 1);
        const isPath = (value === 0);
        const isNotVisited = (arraySol[pt.row][pt.col] === 0);

        // VALUE IS 0
        if (isPath)
        {
            // If not previously visited
            if (isNotVisited)
            {
                // NEXT COUNT
                const count = (prevCount + 1);

                // KEEP TRACK OF VISITED VALUE
                const updatedArray = arraySol.map(row => row.map(e => (e)));
                updatedArray[pt.row][pt.col] = count;

                const isTarget = ((target.row === pt.row) && (target.col === pt.col));

                // IF IS AT TARGET
                if (isTarget)
                {
                    const { solutions } = this.state;
                    solutions.push({ array: updatedArray, pathLength: count });
                    // this.setState({ solutions });
                    console.log(solutions);
                }
                else
                {
                    const nextPt = { row: pt.row, col: pt.col };
                    // TRY GO DOWN
                    if (pt.row < height)
                    {
                        nextPt.row = pt.row + 1;
                        this.searchPath(nextPt, updatedArray, count);
                    }
                    // TRY GO UP
                    if (pt.row > 0)
                    {
                        nextPt.row = pt.row - 1;
                        this.searchPath(nextPt, updatedArray, count);
                    }
                    // TRY GO RIGHT
                    if (pt.col < width)
                    {
                        nextPt.col = pt.col + 1;
                        this.searchPath(nextPt, updatedArray, count);
                    }
                    // TRY GO LEFT
                    if (pt.col > 0)
                    {
                        nextPt.col = pt.col - 1;
                        this.searchPath(nextPt, updatedArray, count);
                    }
                }
            }
        }
    }

    /**
     * Change/Switch maze block type at params coords
     * @param {int} row 
     * @param {int} column 
     */
    changeBlockType(row, column)
    {
        const maze = [...this.state.maze];

        if (maze[row][column] >= 1)
        {
            // Block type is an obstacle set it to path
            maze[row][column] = 0;
        }
        else
        {
            // Block type is a path set it to obstacle
            maze[row][column] = this.random(4) + 1;
        }

        this.setState({ ...this.initialState, maze });
    }

    changeSize(value)
    {
        const { maze } = this.state;

        const height = maze.length;
        const width = maze[0].length;

        switch (value)
        {
            case 0:
                if (height > window.$minSize)
                {
                    this.generateMaze(width, (height - 1));
                }
                break;
            case 1:
                if (height < window.$maxSize)
                {
                    this.generateMaze(width, (height + 1));
                }
                break;
            case 2:
                if (width > window.$minSize)
                {
                    this.generateMaze((width - 1), height);
                }
                break;
            case 3:
                if (width < window.$maxSize)
                {
                    this.generateMaze((width + 1), height);
                }
                break;
            default:
                break;
        }
    }

    startAnimation()
    {
        // // Get maze solution object
        // const { solution } = this.state;

        // // Start counter at 2 since lead is at 1
        // let i = 2;

        // this.setState({ isAnimation: true }, () =>
        // {
        //     // Each 700 ms moves the lead cursor
        //     const counter = setInterval(() =>
        //     {
        //         if (i === solution.pathLength)
        //         {
        //             clearInterval(counter);
        //             this.setState({ isAnimation: false });
        //         }
        //         this.setState({ leadCursor: i });
        //         i++;
        //     }, 700);
        // });
    }

    render()
    {
        const {
            maze,
            start,
            target,
            solution,
            isSolved,
            isSearchBtn,
            leadCursor,
            themes,
            activeTheme,
            isAnimation,
            isGenerated
        } = this.state;

        const theme = themes[activeTheme];
        const background = `linear-gradient(0deg, #272727 40%, #181818 50%, ` +
            `${theme.color.third} 30%, ${theme.color.secondary} 80%)`;

        return (
            <div className="App" style={{ background }}>
                {
                    isGenerated &&
                    <header className="App-header" style={{ height: isAnimation && '100vh' }}>
                        {
                            !isAnimation &&
                            <h1><font style={{ color: theme.color.main, textShadow: '0px 2px 0px #000000ad', textDecoration: 'overline' }}>{theme.title}</font> Maze</h1>
                        }
                        <div className="maze" style={{ backgroundColor: theme.color.main }}>
                            {
                                maze.map((row, index) =>
                                    (
                                        <div key={index} className="row">
                                            {
                                                row.map((e, i) =>
                                                {
                                                    const isStart = ((start.row === index) && (start.col === i));
                                                    const isTarget = ((target.row === index) && (target.col === i));
                                                    let obstacle = theme.emoji.obstacle_1;
                                                    switch (e)
                                                    {
                                                        case 2:
                                                            obstacle = theme.emoji.obstacle_2;
                                                            break;
                                                        case 3:
                                                            obstacle = theme.emoji.obstacle_3;
                                                            break;
                                                        default:
                                                            obstacle = theme.emoji.obstacle_1;
                                                            break;
                                                    }

                                                    return (
                                                        <div key={i}>
                                                            {
                                                                (solution !== null && (solution.array[index][i] !== 0)) ?
                                                                    (solution.array[index][i] === leadCursor) ?
                                                                        <span role="img" aria-label="emoji">{theme.emoji.animal}</span> :
                                                                        (solution.array[index][i] < leadCursor) ?
                                                                            <span onClick={() => (!isAnimation && !isStart) && this.changeBlockType(index, i)} role="img" aria-label="emoji" style={{ opacity: 0.3 }}>{theme.emoji.animal}</span> :
                                                                            isTarget ?
                                                                                <span role="img" aria-label="emoji">{theme.emoji.target}</span> :
                                                                                <span onClick={() => !isAnimation && this.changeBlockType(index, i)} role="img" aria-label="emoji">{theme.emoji.path}</span>
                                                                    :
                                                                    (e >= 1) ?
                                                                        <span onClick={() => !isAnimation && this.changeBlockType(index, i)} role="img" aria-label="emoji">{obstacle}</span> :
                                                                        isStart ?
                                                                            <span role="img" aria-label="emoji">{theme.emoji.animal}</span> :
                                                                            isTarget ?
                                                                                <span role="img" aria-label="emoji">{theme.emoji.target}</span> :
                                                                                <span onClick={() => !isAnimation && this.changeBlockType(index, i)} role="img" aria-label="emoji">{theme.emoji.path}</span>
                                                            }
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    )
                                )
                            }
                        </div>
                        {
                            !isAnimation &&
                            <React.Fragment>

                                <Submit
                                    isSearchBtn={isSearchBtn}
                                    isSolved={isSolved}
                                    calculatePath={this.calculatePath}
                                    theme={theme}
                                />

                                <div
                                    style={{
                                        marginTop: 20,
                                        color: '#ffffff3d',
                                        fontStyle: 'italic',
                                        textAlign: 'center'
                                    }}
                                >
                                    Click on maze symbols (path or obstacles) to switch types.
                                </div>

                                <div
                                    className="legend"
                                    style={{
                                        color: theme.color.main,
                                        backgroundColor: theme.color.main + '2e',
                                        border: `2px solid ${theme.color.main}2e`
                                    }}
                                >
                                    <div>Lead {theme.emoji.animal}</div>
                                    <div>Path {theme.emoji.path}</div>
                                    <div>Obstacles {theme.emoji.obstacle_1} {theme.emoji.obstacle_2} {theme.emoji.obstacle_3}</div>
                                    <div>Target {theme.emoji.target}</div>
                                </div>

                                <Settings
                                    changeSize={this.changeSize}
                                    theme={theme}
                                    maze={maze}
                                />

                                <div
                                    style={{
                                        color: '#808080',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Select a theme
                                </div>

                                <div style={{ marginTop: 4, marginBottom: 20, borderTop: '1px solid #808080' }}>
                                    {
                                        themes.map((e, i) => (<font key={i} onClick={() => this.setState({ activeTheme: i, ...this.initialState })} className="theme">{e.title}</font>))
                                    }
                                </div>

                                <div className="github">
                                    <i className="fas fa-code"></i>
                                    <a href="https://github.com/helgoyat/maze-game" target="_blank" rel="noopener noreferrer">App Code Here</a>
                                </div>
                            </React.Fragment>
                        }
                    </header>
                }
            </div>
        );
    }
}

export default App;