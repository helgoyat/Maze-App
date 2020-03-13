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
            pot: null,
            start: { row: 0, col: 0 },
            target: { row: 0, col: 0 },
            isGenerated: false,
        };
        this.initialState = {
            isSolved: false,
            solutions: [],
            solution: null,
            isSearchBtn: true,
            animalCursor: 1,
        };
        this.state = {
            ...this.initialState,
            ...this.initialMaze,
            isAnimation: false,
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

            // Create pot and assign in 2D array 
            // random values in range [0-3]
            const pot = array.map(row => row.map(() => this.random(4)));

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

            // Change the pot's start and target locations values to 0
            // i.e. make sure both start and target points
            // are placed on a 'path' (and not on an 'obstacle')
            pot[start.row][start.col] = 0;
            pot[target.row][target.col] = 0;

            // Set state with results
            this.setState({
                pot,
                start,
                target,
                isGenerated: true
            });
        });
    }

    calculatePath()
    {
        const { pot, start } = this.state;
        // Variables
        const height = pot.length;
        const width = pot[0].length;
        // Solution Array
        const array = [[]];
        for (let i = 0; i < width; i++)
        {
            array[0].push(0);
        }
        for (let i = 1; i < height; i++)
        {
            array.push(array[0]);
        }
        // Start search
        this.searchPath(start.row, start.col, array, 0);
        // Display result
        const { solutions } = this.state;
        const isSolved = (solutions.length > 0);
        solutions.sort(function (a, b) { return a.pathLength - b.pathLength; });
        const solution = (solutions.length > 0) ? solutions[0] : null;
        this.setState({ isSearchBtn: false, isSolved, solution }, () =>
        {
            if (isSolved)
            {
                this.startAnimation();
            }
        });
    }

    searchPath(row, column, prevArray, prevCount)
    {
        const { pot, target } = this.state;
        // CURRENT VALUE
        const value = pot[row][column];
        // VARIABLES
        const height = (pot.length - 1);
        const width = (pot[0].length - 1);
        const isPath = (value === 0);
        const isNotVisited = (prevArray[row][column] === 0);

        // VALUE IS 0
        if (isPath)
        {
            // If not previously visited
            if (isNotVisited)
            {
                // NEXT COUNT
                const count = (prevCount + 1);

                // KEEP TRACK OF VISITED VALUE
                const updatedArray = prevArray.map(row => row.map(e => (e)));
                updatedArray[row][column] = count;

                const isTarget = ((target.row === row) && (target.col === column));

                // IF IS AT TARGET
                if (isTarget)
                {
                    const { solutions } = this.state;
                    solutions.push({ array: updatedArray, pathLength: count });
                    this.setState({ solutions });
                } else
                {
                    // TRY GO DOWN
                    if (row < height)
                    {
                        this.searchPath((row + 1), column, updatedArray, count);
                    }
                    // TRY GO UP
                    if (row > 0)
                    {
                        this.searchPath((row - 1), column, updatedArray, count);
                    }
                    // TRY GO RIGHT
                    if (column < width)
                    {
                        this.searchPath(row, (column + 1), updatedArray, count);
                    }
                    // TRY GO LEFT
                    if (column > 0)
                    {
                        this.searchPath(row, (column - 1), updatedArray, count);
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
        const pot = [...this.state.pot];

        if (pot[row][column] >= 1)
        {
            // Block type is an obstacle set it to path
            pot[row][column] = 0;
        }
        else
        {
            // Block type is a path set it to obstacle
            pot[row][column] = (this.random(4) + 1);
        }

        this.setState({ ...this.initialState, pot });
    }

    changeSize(value)
    {
        const { pot } = this.state;

        const height = pot.length;
        const width = pot[0].length;

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
        const { solution } = this.state;
        let i = 2;
        this.setState({ isAnimation: true }, () =>
        {
            const counter = setInterval(() =>
            {
                if (i === solution.pathLength)
                {
                    clearInterval(counter);
                    this.setState({ isAnimation: false });
                }
                this.setState({ animalCursor: i });
                i++;
            }, 700);
        });
    }

    render()
    {
        const {
            pot,
            start,
            target,
            solution,
            isSolved,
            isSearchBtn,
            animalCursor,
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
                                pot.map((row, index) =>
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
                                                                    (solution.array[index][i] === animalCursor) ?
                                                                        <span role="img" aria-label="emoji">{theme.emoji.animal}</span> :
                                                                        (solution.array[index][i] < animalCursor) ?
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
                                    pot={pot}
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