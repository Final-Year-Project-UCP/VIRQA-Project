import React from 'react';
import { motion } from 'framer-motion';

const BackgroundParticles = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    style={{
                        background: i % 2 === 0 ? '#BFDBFE' : '#E5E7EB', // Blue-200 / Gray-200
                        width: Math.random() * 300 + 100,
                        height: Math.random() * 300 + 100,
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                    }}
                    animate={{
                        y: [0, Math.random() * 100 - 50, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundParticles;
