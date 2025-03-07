import { useEffect, useState, type ReactNode } from "react";

interface Props {
  date: Date;
}

function Segment({ unit, count }: Readonly<{ unit: string; count: number }>) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl">{count.toString().padStart(2, "0")}</span>
      <span>{unit}</span>
    </div>
  );
}

function Counter({ timeRemaining }: Readonly<{ timeRemaining: number }>) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }, [timeRemaining]);

  return (
    <div className="flex space-x-[1.5rem] font-lcd">
      <Segment unit="DD" count={days} />
      <Segment unit="HH" count={hours} />
      <Segment unit="MIN" count={minutes} />
      <Segment unit="SEC" count={seconds} />
    </div>
  );
}

export default function Countdown({ date }: Readonly<Props>) {
  function getTimeRemaining() {
    return date.getTime() - new Date().getTime();
  }

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 100);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return timeRemaining > 0 ? (
    <Counter timeRemaining={timeRemaining} />
  ) : (
    <h1 className="text-2xl font-medium">Vi er live!</h1>
  );
}
