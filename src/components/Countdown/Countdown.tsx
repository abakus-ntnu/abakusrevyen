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

function Counter({ date }: Readonly<{ date: Date }>) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function updateCount() {
    const now = new Date().getTime();
    const distance = date.getTime() - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }

  useEffect(() => {
    const interval = setInterval(updateCount, 100);
    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);

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
  return <Counter date={date} />;
}
