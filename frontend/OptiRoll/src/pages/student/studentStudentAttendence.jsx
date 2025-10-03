import { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Circular Progress Component
const CircularProgress = ({ percentage, color = "text-cyan-400" }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg className="w-24 h-24 transform -rotate-90">
      <circle
        className="text-gray-700"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="8"
        r={radius}
        cx="50%"
        cy="50%"
      />
      <circle
        className={`${color} transition-all duration-500`}
        stroke="currentColor"
        fill="transparent"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx="50%"
        cy="50%"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-white text-lg font-bold"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

export default function AdminStudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [adminAttendance, setAdminAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [selectedAdminHours, setSelectedAdminHours] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${ApiUrl}/student/studentAttendence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.join(", "));
        } else {
          setAttendance(data.attendence?.data || []);
          setAdminAttendance(data.adminAttendence?.data || []);
        }
      } catch (err) {
        setError("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const getDayOnlineHours = (date, data) => {
    const day = data.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    if (!day) return null;
    const hours = day.onlineTime / (1000 * 60 * 60);
    return hours > 0 ? hours.toFixed(1) : null;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const studentDay = attendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    const adminDay = adminAttendance.find(
      (d) => new Date(d.Date).toDateString() === date.toDateString()
    );
    setSelectedDetails(studentDay?.timings || []);
    setSelectedAdminHours(adminDay?.onlineTime || 0);
  };

  const calculateSessionDuration = (start, end) => {
    if (!end) return null;
    const durationMs = new Date(end) - new Date(start);
    const durationMin = Math.floor(durationMs / (1000 * 60));
    const hrs = Math.floor(durationMin / 60);
    const mins = durationMin % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  };

  // Overall stats
  const totalStudentHours =
    attendance.reduce((sum, d) => sum + (d.onlineTime || 0), 0) /
    (1000 * 60 * 60);
  const totalAdminHours =
    adminAttendance.reduce((sum, d) => sum + (d.onlineTime || 0), 0) /
    (1000 * 60 * 60);

  const totalDays = attendance.length;
  const avgStudentHours = totalDays > 0 ? totalStudentHours / totalDays : 0;
  const avgAdminHours =
    adminAttendance.length > 0 ? totalAdminHours / adminAttendance.length : 0;

  const overallAttendancePercent =
    totalAdminHours > 0 ? (totalStudentHours / totalAdminHours) * 100 : 0;

  const bestDay = attendance.reduce(
    (best, d) => (d.onlineTime > (best?.onlineTime || 0) ? d : best),
    null
  );
  const worstDay = attendance.reduce(
    (worst, d) => (d.onlineTime < (worst?.onlineTime || Infinity) ? d : worst),
    null
  );

  // Session analytics
  const totalStudentSessions = attendance.reduce(
    (count, d) => count + (d.timings?.length || 0),
    0
  );
  const totalAdminSessions = adminAttendance.reduce(
    (count, d) => count + (d.timings?.length || 0),
    0
  );
  const attendedDays = attendance.filter((d) => d.timings?.length > 0).length;

  // Selected day stats
  const selectedDayHours =
    selectedDetails.reduce((total, t) => {
      if (!t.end) return total;
      return total + (new Date(t.end) - new Date(t.start));
    }, 0) /
    (1000 * 60 * 60);

  const longestSession =
    selectedDetails.length > 0
      ? (
          selectedDetails.reduce((max, t) => {
            if (!t.end) return max;
            const duration = new Date(t.end) - new Date(t.start);
            return Math.max(max, duration);
          }, 0) /
          (1000 * 60)
        ).toFixed(0) + "m"
      : "0m";

  const attendancePercent =
    selectedAdminHours > 0
      ? (selectedDayHours / (selectedAdminHours / (1000 * 60 * 60))) * 100
      : 0;

  const selectedAdminSessions =
    adminAttendance.find(
      (d) => new Date(d.Date).toDateString() === selectedDate?.toDateString()
    )?.timings?.length || 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />

      <main className="mx-auto max-w-6xl px-6 pb-16 md:pt-4">
        <h1 className="text-3xl font-bold mb-6">
          Attendance <span className="text-cyan-400">Analytics</span>
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
            {/* Overall Stats */}
            <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-between">
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Student Hours
                </h3>
                <p className="text-2xl font-bold">
                  {totalStudentHours.toFixed(1)}h
                </p>
              </div>
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Admin Hours
                </h3>
                <p className="text-2xl font-bold">
                  {totalAdminHours.toFixed(1)}h
                </p>
              </div>
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Avg Student Hours
                </h3>
                <p className="text-2xl font-bold">
                  {avgStudentHours.toFixed(1)}h
                </p>
              </div>
              <div className="flex-1 min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Avg Admin Hours
                </h3>
                <p className="text-2xl font-bold">
                  {avgAdminHours.toFixed(1)}h
                </p>
              </div>
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Student Sessions
                </h3>
                <p className="text-2xl font-bold">{totalStudentSessions}</p>
              </div>
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-cyan-300">
                  Total Admin Sessions
                </h3>
                <p className="text-2xl font-bold">{totalAdminSessions}</p>
              </div>
              <div className="flex-1 w-full md:w-fit min-w-[220px] md:max-w-[280px] rounded-2xl bg-white/5 border border-white/10 shadow-lg p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm mb-2 text-cyan-300">
                  Overall Attendance %
                </h3>
                <CircularProgress
                  percentage={overallAttendancePercent}
                  color="text-green-400"
                />
              </div>
            </div>

            {/* Best/Worst Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {bestDay && (
                <div className="rounded-2xl bg-green-500/10 border border-green-400/30 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-green-300">
                    Best Day
                  </h3>
                  <p className="text-xl font-bold">
                    {new Date(bestDay.Date).toDateString()}
                  </p>
                  <p className="text-lg text-green-400">
                    {(bestDay.onlineTime / (1000 * 60 * 60)).toFixed(1)}h
                  </p>
                </div>
              )}
              {worstDay && (
                <div className="rounded-2xl bg-red-500/10 border border-red-400/30 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-red-300">
                    Worst Day
                  </h3>
                  <p className="text-xl font-bold">
                    {new Date(worstDay.Date).toDateString()}
                  </p>
                  <p className="text-lg text-red-400">
                    {(worstDay.onlineTime / (1000 * 60 * 60)).toFixed(1)}h
                  </p>
                </div>
              )}
            </div>

            {/* Calendar + Day Details */}
            <div className="flex flex-col md:flex-row gap-8 h-fit">
              {/* Calendar Section */}
              <div className="bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 w-full md:w-[45%] flex-shrink-0">
                <Calendar
                  onClickDay={handleDayClick}
                  tileContent={({ date, view }) =>
                    view === "month" && getDayOnlineHours(date, attendance) ? (
                      <div className="tile-hours text-xs text-cyan-300">
                        {getDayOnlineHours(date, attendance)}h
                      </div>
                    ) : null
                  }
                  className="calendar-custom"
                />
              </div>

              {/* Day Details Section */}
              <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 shadow-xl p-6 overflow-y-auto h-full scrollbar-hide">
                {selectedDate ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedDate.toDateString()}
                    </h2>

                    {/* Day Stats */}
                    {selectedDetails.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <p className="text-sm text-white/70">Attended</p>
                          <p className="text-lg font-bold text-cyan-300">
                            {selectedDayHours.toFixed(1)}h
                          </p>
                        </div>
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <p className="text-sm text-white/70">Admin Max</p>
                          <p className="text-lg font-bold text-fuchsia-300">
                            {(selectedAdminHours / (1000 * 60 * 60)).toFixed(1)}
                            h
                          </p>
                        </div>
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <p className="text-sm text-white/70">
                            Student Sessions
                          </p>
                          <p className="text-lg font-bold text-cyan-300">
                            {selectedDetails.length}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <p className="text-sm text-white/70">
                            Admin Sessions
                          </p>
                          <p className="text-lg font-bold text-fuchsia-300">
                            {selectedAdminSessions}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedDetails.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <p className="text-sm text-white/70">Longest</p>
                          <p className="text-lg font-bold text-cyan-300">
                            {longestSession}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[100px] rounded-xl bg-white/5 border border-white/10 p-3 flex justify-center items-center">
                          <CircularProgress
                            percentage={attendancePercent}
                            color="text-fuchsia-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Sessions List */}
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
