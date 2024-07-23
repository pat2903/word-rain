import React, {useState, useRef, useEffect, useMemo} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';
import { TextField, Paper } from '@mui/material';

const Game = () => {
    const [gameOver, setGameOver] = useState(false);
    const [words, setWords] = useState(['Donkey', 'Slug', 'Honk', 'Bottle', 'Spice']);
    const [divWidth, setDivWidth] = useState(0);
    const ref = useRef(null);
    const [input, setInput] = useState('');
    const [points, setPoints] = useState(0);
    const [memoisedWords, setMemoisedWords] = useState([]);

    // wait for div to be created before taking dimensions
    useEffect (() =>{
        if (ref.current) {
            setDivWidth(ref.current.offsetWidth)
        }
    }, []);

    // memoise the words so that when the component is re-rendered, new properties
    // are not generated
    // create object that stores both words and properties
    useEffect(()=>{
        const initialMemoisedWords=words.map(word=>({
            word,
            props: randomiseProp()
        }));
        setMemoisedWords(initialMemoisedWords);
    }, []);

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
        
        // if it's in memoisedwords, then increment points, and remove the word from memoisedwords
        if (memoisedWords.some(({word}) => word === currInput)) {
            setPoints(p => p + 1);
            setMemoisedWords(w => w.filter(({word}) => word !== currInput));
            setInput('');
          }
      };

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
                {memoisedWords.map(({word, props}) => {
                    const {x, duration, delay} = props;
                    return(
                    <motion.span 
                    key = {word}
                    className='absolute text-white'
                    style={{ left: x, top: 0 }}
                    initial={{ y: '-100%' }}
                    animate={{ y: '100vh' }}
                    transition={{ duration, ease: 'linear', delay}}
                    > 
                        {word}
                    </motion.span>
                    );
                })}
            </div>
            <div className='max-w-2xl w-full relative bg-gray-700 mt-2'>
                <div className="text-white mb-2">Points: {points}</div>
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
                        placeholder="Start typing here"
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Game;