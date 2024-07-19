import React, {useState, useRef, useEffect} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';

const Game = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [words, setWords] = useState(['Donkey', 'Slug', 'Honk', 'Bottle', 'Spice']);
    const [divWidth, setDivWidth] = useState(0);
    const ref = useRef(null);

    // doesn't work
    // double check this tomorrow https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
    useEffect (() =>{
        if (ref.current) {
            setDivWidth(ref.current.offsetWidth)
        }
    }, []);

    const randomiseProp = () => {
        return {
        x: Math.random() * divWidth,
        duration: Math.random() * 5 + 2
        }
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
            <div ref={ref} className='h-screen max-w-2xl w-full bg-gray-700'>
                {words.map((word) => {
                    const {x, duration} = randomiseProp();
                    return(
                    <motion.span 
                    key = {word}
                    className='absolute text-white'
                    initial={{ y: 0, x }}
                    animate={{ y: '100vh' }}
                    transition={{ duration, ease: 'linear' }}
                    > 
                        {word}
                    </motion.span>
                    );
                })}
            </div>
        </div>
    );
};

export default Game;