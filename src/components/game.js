import React, {useState, useRef, useEffect, useMemo} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';
import { TextField, Paper } from '@mui/material';
import { generateWords } from './word-generator';

const Game = () => {
    // const [gameOver, setGameOver] = useState(false);
    const [divWidth, setDivWidth] = useState(0);
    const ref = useRef(null);
    const [input, setInput] = useState('');
    const [points, setPoints] = useState(0);
    const [memoisedWords, setMemoisedWords] = useState([]);
    const [outOfViewWords, setOutOfViewWords] = useState([]);

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
    useEffect(() => {
        async function fetchAndSetWords() {
            const generatedWords = await generateWords();
            const initialMemoisedWords = generatedWords.map(wordPair => ({
                ...wordPair,
                props: randomiseProp()
            }));
            setMemoisedWords(initialMemoisedWords);
        }
        fetchAndSetWords();
    }, []);

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
            setInput('');
          }
      };

    // when words fall outside the div, they become out of view
    // add to array
    const addWordOutOfView = (word) => {
        setOutOfViewWords(p => [...p, word])
    }

    return(
        <div className='h-screen w-screen flex flex-col items-center bg-black'>
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
                        placeholder="Type the English translation here... Be quick!"
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Game;