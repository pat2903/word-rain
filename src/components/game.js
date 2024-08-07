import React, {useState, useRef, useEffect} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';
import { TextField, Paper } from '@mui/material';
import { generateWords } from './word-generator';

const PopUp = ({onStart, onRetry, isStart, points, correctWords, wrongWords}) => {
    return (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-lg text-center'>
                {isStart ? (
                    <>
                    <h2 className='text-2xl font-bold mb-4'>Word Rain</h2>
                    <p className='mb-4'>Translate the falling French words into English!</p>
                    <button
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                    onClick={onStart}
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
                    <button 
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                    onClick={onRetry}
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
    const [divWidth, setDivWidth] = useState(0);
    const ref = useRef(null);
    const [input, setInput] = useState('');
    const [points, setPoints] = useState(0);
    const [memoisedWords, setMemoisedWords] = useState([]);
    const [outOfViewWords, setOutOfViewWords] = useState([]);
    const [correctWords, setCorrectWords] = useState([]);
    const [wrongWords, setWrongWords] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    // wait for div to be created before taking dimensions
    useEffect (() =>{
        if (ref.current) {
            setDivWidth(ref.current.offsetWidth)
        }
    }, []);

    // memoise the words so that when the component is re-rendered, new properties
    // are not generated
    // create object that stores both words and properties
    // update: not it stores french and english as properties
    // useEffect(() => {
    //     async function fetchAndSetWords() {
    //         const generatedWords = await generateWords();
    //         const initialMemoisedWords = generatedWords.map(wordPair => ({
    //             ...wordPair,
    //             props: randomiseProp()
    //         }));
    //         setMemoisedWords(initialMemoisedWords);
    //     }
    //     fetchAndSetWords();
    // }, []);

    // get rid of out of view words
    useEffect(() => {
        setMemoisedWords(p => p.filter(({french}) => !outOfViewWords.includes(french)));
    }, [outOfViewWords]);

    const randomiseProp = () => {
        return {
        // random positions between 5-95% of div
        x: `${10 + Math.random() * 80}%`,
        duration: Math.random() * 8 + 2,
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
        //then increment points, and remove the word from memoisedwords
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
        setOutOfViewWords(p => [...p, word])
        // chceck if the word is not in correctWords before adding to wrongWords
        if (!correctWords.some(correctWord => correctWord.french === word)) {
            setWrongWords(p => [...p, memoisedWords.find(w => w.french === word)]);
        }
    }

    const startGame = async () => {
        setShowStartScreen(false);
        setPoints(0);
        setOutOfViewWords([]);
        setCorrectWords([]);
        setWrongWords([]);

        const generatedWords = await generateWords();
        const initialMemoisedWords = generatedWords.map(wordPair => ({
            ...wordPair,
            props: randomiseProp()
        }));
        setMemoisedWords(initialMemoisedWords);
        setTotalWords(initialMemoisedWords.length);
        setGameInProgress(true);
    };

    const endGame = () => {
        setGameInProgress(false);
        setShowStartScreen(false)
        // add any remaining words in memoisedWords that havent been correctly guessed
        // setWrongWords(prev => [
        //     ...prev,
        //     ...memoisedWords.filter(word => 
        //         !correctWords.some(correctWord => correctWord.french === word.french) &&
        //         !prev.some(wrongWord => wrongWord.french === word.french)
        //     )
        // ]);
    }

    useEffect(() => {
        if (gameInProgress && totalWords > 0 && (outOfViewWords.length + correctWords.length === totalWords)) {
            endGame();
        }
    }, [correctWords, outOfViewWords, totalWords, gameInProgress]);

    return(
        <div className='h-screen w-screen flex flex-col items-center bg-black'>
            {(showStartScreen || !gameInProgress) && (
                <PopUp 
                    isStart={showStartScreen}
                    points={points}
                    correctWords={correctWords}
                    wrongWords={wrongWords}
                    onStart={startGame}
                    onRetry={startGame}
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
            <div ref={ref} className='h-screen max-w-2xl w-full bg-gray-700 rounded-md relative overflow-hidden'>
                <div className="text-white flex justify-end mr-2 mt-1"> Points: {points}</div>
                {memoisedWords.map(({french, english, props}) => {
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