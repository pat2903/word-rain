import React, {useState, useRef, useEffect} from 'react';
import Typewriter from 'typewriter-effect';
import {motion} from 'framer-motion';

const Game = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [words, setWords] = useState(['Donkey', 'Slug', 'Honk', 'Bottle', 'Spice']);
    const [divWidth, setDivWidth] = useState(0);
    const ref = useRef(null);

    // wait for div to be created before taking dimensions
    useEffect (() =>{
        if (ref.current) {
            setDivWidth(ref.current.offsetWidth)
        }
    }, []);

    const randomiseProp = () => {
        return {
        // random positions between 5-95% of div
        x: `${5 + Math.random() * 90}%`,
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
            <div ref={ref} className='h-screen max-w-2xl w-full bg-gray-700 relative overflow-hidden'>
                {words.map((word) => {
                    const {x, duration} = randomiseProp();
                    return(
                    <motion.span 
                    key = {word}
                    className='absolute text-white'
                    style={{ left: x, top: 0 }}
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