import React, {useState, useEffect} from 'react';
import Typewriter from 'typewriter-effect';

const Game = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    return(
        <div className='h-screen flex flex-col items-center justify-center bg-black'>
            <h1 className='text-4xl font-semibold mb-8'>
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
            <h1>
                text
            </h1>
        </div>
    );
};

export default Game;