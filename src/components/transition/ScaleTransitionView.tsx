"use client"

import { motion } from "framer-motion"

type ScaleTransitionViewProps = {
    children: React.ReactNode
    custom?: number
}

const ScaleTransitionView = (props: ScaleTransitionViewProps) => {
    const card = {
        visible: (custom: number) => ({
            opacity: [0, 1],
            scale: [0, 1],
            transition: { delay: custom * 0.02, duration: 0.4 },
        }),
    }

    return (
        <motion.div
            animate='visible'
            variants={card}
            custom={props.custom}
            className='origin-center'
        >
            {props.children}
        </motion.div>
    )
}

export default ScaleTransitionView
