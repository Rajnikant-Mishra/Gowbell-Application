import React, { useEffect, useRef } from 'react';
import styles from './ProgressCircle.module.css';
 
const ProgressCircle = ({ value = 80 }) => {
  const numRef = useRef(null);
  const circleRef = useRef(null);
  const dotsRef = useRef(null);
 
  useEffect(() => {
    let count = 0;
    const time = 2000 / value;
 
    const interval = setInterval(() => {
      if (count >= value) {
        clearInterval(interval);
      } else {
        count += 1;
        if (numRef.current) {
          numRef.current.innerText = count;
        }
      }
    }, time);
 
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = 503 - (503 * (value / 100));
    }
 
    if (dotsRef.current) {
      dotsRef.current.style.transform = `rotate(${360 * (value / 100)}deg)`;
      if (value === 100) {
        dotsRef.current.style.opacity = 0;
      }
    }
 
    return () => clearInterval(interval);
  }, [value]);
 
  return (
<div className={styles.block}>
<div className={styles.box}>
<p className={styles.number}>
<span className={styles.num} ref={numRef}>{value}</span>
<span className={styles.sub}>%</span>
</p>
</div>
<span className={styles.dots} ref={dotsRef}></span>
<svg className={styles.svg}>
<defs>
<linearGradient id="gradientStyle">
<stop offset="0%" stopColor="#0C7BD3" />
<stop offset="100%" stopColor="#57B0FF" />
</linearGradient>
</defs>
<circle
          className={styles.circle}
          ref={circleRef}
          cx="90"
          cy="90"
          r="80"
        />
</svg>
</div>
  );
};
 
export default ProgressCircle;