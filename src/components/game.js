import React, {useState, useEffect} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';
import { TextField, Paper, Slider } from '@mui/material';
import { generateWords } from './word-generator';

const PopUp = ({onStart, onRetry, isStart, points, correctWords, wrongWords, wordCount, setWordCount}) => {
    const handleSliderChange = (event, newValue) => {
        setWordCount(newValue);
    };

    return (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-gray-700 p-8 rounded-lg text-center text-white'>
                {isStart ? (
                    <>
                    <h2 className='text-2xl font-bold mb-4'>Word Rain</h2>
                    <p className='mb-4'>Translate the falling French words into English!</p>
                    <div className='mb-4'>
                        <p>Select number of words:</p>
                        <Slider
                            value={wordCount}
                            onChange={handleSliderChange}
                            aria-labelledby="word-count-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={5}
                            max={20}
                        />
                    </div>
                    <button
                    className='bg-gray-500 px-4 py-2 rounded'
                    onClick={() => onStart(wordCount)}
                    >
                        Start Game
                    </button>
                    </>
                ):(
                    <>
                    <h2 className='text-2xl font-bold mb-4'>Game Over</h2>
                    <p className='mb-4'>Your score: {points}</p>
                    <div className='mb-4'>
                        <h3 className='font-bold'>Correct Translations:</h3>
                        <ul>
                            {correctWords.map((word, index)=>(
                                <li key={index}>
                                    {word.french} - {word.english}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='mb-4'>
                        <h3 className='font-bold'>Missed or Wrong Translations:</h3>
                        <ul>
                            {wrongWords.map((word, index)=>(
                                <li key={index}>
                                    {word.french} - {word.english}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='mb-4'>
                        <p>Re-select number of words:</p>
                        <Slider
                            value={wordCount}
                            onChange={handleSliderChange}
                            aria-labelledby="word-count-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={5}
                            max={20}
                        />
                    </div>
                    <button 
                    className='bg-gray-500 text-white px-4 py-2 rounded'
                    onClick={() => onRetry(wordCount)}
                    >
                        Retry :)
                    </button>
                    </>
                )}
            </div>
        </div>
    );
};

const Game = () => {
    const [gameInProgress, setGameInProgress] = useState(false);
    const [showStartScreen, setShowStartScreen] = useState(true);
    const [input, setInput] = useState('');
    const [points, setPoints] = useState(0);
    const [memoisedWords, setMemoisedWords] = useState([]);
    const [outOfViewWords, setOutOfViewWords] = useState([]);
    const [correctWords, setCorrectWords] = useState([]);
    const [wrongWords, setWrongWords] = useState([]);
    const [totalWords, setTotalWords] = useState(0);
    // keep track of if the words are loaded
    // if they are loaded, then we can proceed with the game
    // to help with game synchronisation and premature game ends
    const [wordsLoaded, setWordsLoaded] = useState(false);
    // for the slider
    // req number of words
    const [wordCount, setWordCount] = useState(10);

    // get rid of out of view words
    useEffect(() => {
        setMemoisedWords(p => p.filter(({french}) => !outOfViewWords.includes(french)));
    }, [outOfViewWords]);

    const randomiseProp = () => {
        return {
        // random positions between 5-95% of div
        x: `${10 + Math.random() * 80}%`,
        // duration between 4 and 12 seconds
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 3
        }
    }

    const handleInput = (event) => {
        const currInput = event.target.value;
        setInput(currInput);

        const matchedWord = memoisedWords.find(
            ({english}) => english.toLowerCase() === currInput.toLowerCase()
        );
        
        // if it's in the memoisedWords list of objects
        // and not out of view, 
        // then increment points, and remove the word from memoisedwords
        if (matchedWord && !outOfViewWords.includes(matchedWord.french)) {
            setPoints(p => p + 1);
            // remove correctly guessed(?) word
            setMemoisedWords(w => w.filter(({french}) => french !== matchedWord.french));
            setOutOfViewWords(p => p.filter(word => word !== matchedWord.french));
            setCorrectWords(p => [...p, matchedWord])
            // remove from wrong words if guessed correctly
            setWrongWords(p => p.filter(w => w.french !== matchedWord.french));
            setInput('');
          }
      };

    // when words fall outside the div, they become out of view
    // add to array
    const addWordOutOfView = (word) => {
        if (gameInProgress) {
            setOutOfViewWords(p => [...p, word])
            // chceck if the word is not in correctWords before adding to wrongWords
            if (!correctWords.some(correctWord => correctWord.french === word)) {
                setWrongWords(p => [...p, memoisedWords.find(w => w.french === word)]);
            }
        }
    }

    const startGame = async (count) => {
        setShowStartScreen(false);
        setPoints(0);
        setOutOfViewWords([]);
        setCorrectWords([]);
        setWrongWords([]);
        // words arent loaded instantly
        // there is a brief moment where gameInProgress is false, wordsLoaded is true
        // from previous game, and memoisedWords is empty
        // this triggers endGame
        // hence, we have to set it to false at the start
        setWordsLoaded(false);

        const generatedWords = await generateWords(count);
        const initialMemoisedWords = generatedWords.map(wordPair => ({
            ...wordPair,
            props: randomiseProp()
        }));
        setMemoisedWords(initialMemoisedWords);
        setTotalWords(initialMemoisedWords.length);
        setWordsLoaded(true);
        setGameInProgress(true);
    };

    const endGame = () => {
        setGameInProgress(false);
        setShowStartScreen(false)
        setMemoisedWords([]);
    }

    useEffect(() => {
        if (gameInProgress && wordsLoaded && totalWords > 0 && memoisedWords.length === 0 && (outOfViewWords.length + correctWords.length === totalWords)) {
            endGame();
        }
    }, [correctWords, outOfViewWords, totalWords, gameInProgress, memoisedWords, wordsLoaded]);

    return(
        <div className='h-screen w-screen flex flex-col items-center bg-black'>
            {(showStartScreen || (!gameInProgress && wordsLoaded)) && (
                <PopUp 
                    isStart={showStartScreen}
                    points={points}
                    correctWords={correctWords}
                    wrongWords={wrongWords}
                    onStart={startGame}
                    onRetry={startGame}
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                />
            )}
            <div className='justify-start max-w-2xl mt-8'>
                <h1 className='text-4xl font-semibold mb-8 text-white'>
                    <Typewriter
                        options={{loop: true}}
                        onInit={(typewriter) => {
                            typewriter.typeString('Word Rain')
                            .pauseFor(1500)
                            .deleteAll()
                            .start();
                        }}
                    />
                </h1>
            </div>
            <div className='h-screen max-w-2xl w-full bg-gray-700 rounded-md relative overflow-hidden'>
                <div className="text-white flex justify-end mr-2 mt-1"> Points: {points}</div>
                {gameInProgress && memoisedWords.map(({french, english, props}) => {
                    const {x, duration, delay} = props;
                    return(
                    <motion.span 
                    key = {french}
                    className='absolute text-white'
                    style={{ left: x, top: 0 }}
                    initial={{ y: '-100%' }}
                    animate={{ y: '100vh' }}
                    transition={{ duration, ease: 'linear', delay}}
                    onAnimationComplete={() => addWordOutOfView(french)}
                    > 
                        {french}
                    </motion.span>
                    );
                })}
            </div>
            <div className='max-w-2xl w-full relative bg-gray-700 mt-2'>
                <Paper
                    elevation={16}
                    style={{
                    width: '100%'
                    }}
                >
                    <TextField
                        fullWidth
                        value={input}
                        onChange={handleInput}
                        placeholder="Enter the English translation here... Be quick!"
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Game;