"use client"

import { motion } from "framer-motion"

type BottomToUpTransitionViewProps = {
    children: React.ReactNode
    custom?: number
}

const BottomToUpTransitionView = (props: BottomToUpTransitionViewProps) => {
    const card = {
        visible: (custom: number) => ({
            opacity: [0, 1],
            y: [50, -10, 0],
            transition: { delay: custom * 0.1, duration: 0.5 },
        }),
    }

    return (
        <motion.div animate='visible' variants={card} custom={props.custom}>
            {props.children}
        </motion.div>
    )
}

export default BottomToUpTransitionView
