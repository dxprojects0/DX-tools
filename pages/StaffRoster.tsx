import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addStaffShift, updateStaffShift } from '../features/businessSlice';

const StaffRoster: React.FC = () => {
  const dispatch = useDispatch();
  const shifts = useSelector((state: RootState) => state.business.staffShifts);

  const [form, setForm] = useState({ staffName: '', date: '', shift: 'Morning' as 'Morning' | 'Evening' | 'Full Day' });

  const addShift = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addStaffShift({
        id: `SH-${Date.now().toString().slice(-6)}`,
        staffName: form.staffName,
        date: form.date,
        shift: form.shift,
        attendance: 'Present',
        overtimeHours: 0,
      }),
    );
    setForm({ staffName: '', date: '', shift: 'Morning' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Staff Roster</h1>
        <p className="text-slate-500">Shift creation, attendance mark, overtime tracking, weekly schedule view.</p>
      </div>

      <form onSubmit={addShift} className="bg-white border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input required className="border rounded p-2" placeholder="Staff name" value={form.staffName} onChange={(e) => setForm({ ...form, staffName: e.target.value })} />
        <input required type="date" className="border rounded p-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <select className="border rounded p-2" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value as any })}>
          <option>Morning</option>
          <option>Evening</option>
          <option>Full Day</option>
        </select>
        <button className="bg-primary text-white rounded p-2 font-bold">Add Shift</button>
      </form>

      <div className="bg-white border rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="p-2">Staff</th>
              <th className="p-2">Date</th>
              <th className="p-2">Shift</th>
              <th className="p-2">Attendance</th>
              <th className="p-2">Overtime</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.staffName}</td>
                <td className="p-2">{s.date}</td>
                <td className="p-2">{s.shift}</td>
                <td className="p-2">
                  <select value={s.attendance} onChange={(e) => dispatch(updateStaffShift({ ...s, attendance: e.target.value as any }))} className="border rounded p-1 text-sm">
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="number" min="0" value={s.overtimeHours} onChange={(e) => dispatch(updateStaffShift({ ...s, overtimeHours: Number(e.target.value) || 0 }))} className="border rounded p-1 w-20 text-sm" />
                </td>
              </tr>
            ))}
            {shifts.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-400">No shifts created.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffRoster;
