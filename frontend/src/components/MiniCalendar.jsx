
import { useEffect, useState } from "react";
import "./MiniCalendar.css";

const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"];

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
export default function MiniCalendar({
    selectedDate,
    onDateSelect,
    events = [],
}) {
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const initial = selectedDate
            ? new Date(`${selectedDate}T12:00:00`)
            : new Date();

        return new Date(
            initial.getFullYear(),
            initial.getMonth(),
            1
        );
    });

    useEffect(() => {
        if (!selectedDate) return;

        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(selectedDate);

        if (!match) return;

        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);

        const date = new Date(year, month, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day
        ) {
            return;
        }

        setVisibleMonth(new Date(year, month, 1));
    }, [selectedDate]);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstWeekday = new Date(year, month, 1).getDay();
    const offset = (firstWeekday + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [
        ...Array(offset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    const monthLabel = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(visibleMonth);

    const eventDates = new Set(events.map((event) => event.date));
    const today = toDateKey(new Date());

    function changeMonth(direction) {
        setVisibleMonth(new Date(year, month + direction, 1));
    }

    return (
        <section className="mini-calendar" aria-label="Mini calendário">
            <div className="mini-calendar-header">
                <h3>{monthLabel}</h3>

                <div className="mini-calendar-navigation">
                    <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        aria-label="Mês anterior"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        aria-label="Próximo mês"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="mini-calendar-grid">
                {WEEKDAYS.map((day, index) => (
                    <span className="mini-calendar-weekday" key={index}>
                        {day}
                    </span>
                ))}

                {cells.map((day, index) => {
                    if (!day) {
                        return <span key={`empty-${index}`} />;
                    }

                    const dateKey = toDateKey(new Date(year, month, day));
                    const isToday = dateKey === today;
                    const isSelected = dateKey === selectedDate;
                    const hasEvent = eventDates.has(dateKey);

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            className={[
                                "mini-calendar-day",
                                isToday && "is-today",
                                isSelected && "is-selected",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() => onDateSelect?.(dateKey)}
                            aria-pressed={isSelected}
                            aria-label={`Selecionar ${day} de ${monthLabel}`}
                        >
                            {day}
                            {hasEvent && <span className="event-indicator" />}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
