"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

// 參數: 數字, 小數點位數 補零幾位
const Counter = ({
    count = 0,
    length = 0,
    decimals = 0,
}: {
    count: number
    length?: number
    decimals?: number
}) => {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 300,
    })
    const isInView = useInView(ref, { once: true })

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
                ref.current.textContent = latest.toFixed(decimals).padStart(length, "0")
            }
        })

        return unsubscribe
    }, [springValue, count, decimals])

    return <span ref={ref} />
}

export default Counter
