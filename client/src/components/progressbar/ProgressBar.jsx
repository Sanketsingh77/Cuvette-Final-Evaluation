import React, { useEffect, useState } from "react";
import styles from "./progressbar.module.css";

function ProgressBar({ isActive, onComplete, isCompleted }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            onComplete();
          }
          return prevProgress + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isActive]);
  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
    }
  }, [isCompleted]);
  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default ProgressBar;
