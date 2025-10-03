import { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AdminAdminAttendence() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${ApiUrl}/admin/adminAttendence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.join(", "));
        } else {
          setAttendance(data.attendence?.data || []);
        }
      } catch (err) {
        setError("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const getDayOnlineHours = (date) => {
    const day = attendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    if (!day) return null;
    const hours = day.onlineTime / (1000 * 60 * 60);
    return hours > 0 ? hours.toFixed(1) : null;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const day = attendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    setSelectedDetails(day?.timings || []);
  };

  const calculateSessionDuration = (start, end) => {
    if (!end) return null;
    const durationMs = new Date(end) - new Date(start);
    const durationMin = Math.floor(durationMs / (1000 * 60));
    const hrs = Math.floor(durationMin / 60);
    const mins = durationMin % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  };

  const calculateTotalDayDuration = () => {
    return selectedDetails.reduce((total, t) => {
      if (!t.end) return total;
      const durationMs = new Date(t.end) - new Date(t.start);
      return total + durationMs;
    }, 0);
  };

  const totalDayDurationMs = calculateTotalDayDuration();
  const totalDayDurationHrs = totalDayDurationMs / (1000 * 60 * 60);

  const totalHours =
    attendance.reduce((sum, d) => sum + (d.onlineTime || 0), 0) /
    (1000 * 60 * 60);
  const totalDays = attendance.length;
  const avgHours = totalDays > 0 ? totalHours / totalDays : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />

      <main className="mx-auto max-w-6xl px-6 pb-16 md:pt-4">
        <h1 className="text-3xl font-bold mb-6">
          Attendance <span className="text-cyan-400">Overview</span>
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-16 justify-center items-center fixed inset-0 h-screen w-screen bg-black/60 z-60">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-fuchsia-500 animate-spin-slow"></div>
            </div>
            <p className="text-white text-xl text-center animate-pulse">
              Loading…
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Hours
                </h3>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Days
                </h3>
                <p className="text-2xl font-bold">{totalDays}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Avg Hours/Day
                </h3>
                <p className="text-2xl font-bold">{avgHours.toFixed(1)}h</p>
              </div>
            </div>

            <div className="flex h-fit flex-col md:flex-row gap-8">
              <div className="bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 backdrop-blur-xl w-full md:w-1/2 h-fit">
                <Calendar
                  onClickDay={handleDayClick}
                  tileContent={({ date, view }) =>
                    view === "month" && getDayOnlineHours(date) ? (
                      <div className="tile-hours">
                        {getDayOnlineHours(date)}h
                      </div>
                    ) : null
                  }
                  className="calendar-custom"
                />
              </div>

              <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 backdrop-blur-xl overflow-y-scroll h-full scrollbar-hide">
                {selectedDate ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedDate.toDateString()}
                    </h2>
                    {totalDayDurationMs > 0 && (
                      <p className="text-lg font-bold mb-4 text-cyan-300">
                        Total: {totalDayDurationHrs.toFixed(1)}h
                      </p>
                    )}
                    {selectedDetails.length > 0 ? (
                      <ul className="space-y-3">
                        {selectedDetails.map((t, idx) => (
                          <li
                            key={idx}
                            className="rounded-xl bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 px-4 py-3"
                          >
                            <p className="text-sm">
                              Start:{" "}
                              <span className="text-cyan-300 font-medium">
                                {new Date(t.start).toLocaleTimeString()}
                              </span>
                            </p>
                            <p className="text-sm">
                              End:{" "}
                              <span className="text-fuchsia-300 font-medium">
                                {t.end
                                  ? new Date(t.end).toLocaleTimeString()
                                  : "Ongoing"}
                              </span>
                            </p>
                            {t.end && (
                              <p className="text-sm text-white/70">
                                Session:{" "}
                                {calculateSessionDuration(t.start, t.end)}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/60">No timings recorded.</p>
                    )}
                  </>
                ) : (
                  <p className="text-white/60">Click a date to see details</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
