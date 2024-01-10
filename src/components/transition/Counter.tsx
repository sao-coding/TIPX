"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

const Counter = ({ count, decimals = 0 }: { count: number; decimals?: number }) => {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 300,
    })
    const isInView = useInView(ref, { once: true, margin: "-100px 0px -100px 0px" })

    useEffect(() => {
        if (isInView) {
            motionValue.set(count)
        }
    }, [count, isInView, motionValue])

    useEffect(() => {
        if (ref.current && count === 0) {
            ref.current.textContent = "0"
            return
        }

        const unsubscribe = springValue.onChange((latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(decimals)
            }
        })

        return unsubscribe
    }, [springValue, count, decimals])

    return <span ref={ref} />
}

export default Counter
