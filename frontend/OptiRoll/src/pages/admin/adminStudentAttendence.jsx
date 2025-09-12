import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router";

export default function AdminStudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const { sid } = useParams();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${ApiUrl}/admin/studentAttendence/${sid}`, {
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
  }, [sid]);

  const getDayOnlineHours = (date) => {
    const day = attendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    if (!day) return null;
    const hours = day.onlineTime / (1000 * 60 * 60); // ms → hrs
    return hours > 0 ? hours.toFixed(1) : null;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const day = attendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    setSelectedDetails(day?.timings || []);
  };

  // 🔹 Analytics
  const totalHours = attendance.reduce((sum, d) => sum + (d.onlineTime || 0), 0) / (1000 * 60 * 60);
  const totalDays = attendance.length;
  const avgHours = totalDays > 0 ? totalHours / totalDays : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />



      <main className="mx-auto max-w-6xl px-6 pb-16 md:pt-4">
        <h1 className="text-3xl font-bold mb-6">
          Attendance <span className="text-cyan-400">Overview</span>
        </h1>

        {loading && <p className="text-white/70">Loading attendance...</p>}
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">Total Hours</h3>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">Total Days</h3>
                <p className="text-2xl font-bold">{totalDays}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 backdrop-blur-xl text-center">
                <h3 className="text-lg font-semibold text-cyan-300">Avg Hours/Day</h3>
                <p className="text-2xl font-bold">{avgHours.toFixed(1)}h</p>
              </div>
            </div>

            <div className="flex h-fit flex-col md:flex-row gap-8">
              {/* Calendar */}
              <div className="bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 backdrop-blur-xl w-full md:w-1/2 h-fit">
                <Calendar
                  onClickDay={handleDayClick}
                  tileContent={({ date, view }) =>
                    view === "month" && (
                      <p className="text-xs mt-1 text-cyan-300">
                        {getDayOnlineHours(date)
                          ? `${getDayOnlineHours(date)}h`
                          : ""}
                      </p>
                    )
                  }
                  className="calendar-custom"
                />
              </div>

              {/* Day Details */}
              <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 backdrop-blur-xl overflow-y-scroll h-full scrollbar-hide">
                {selectedDate ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedDate.toDateString()}
                    </h2>
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
