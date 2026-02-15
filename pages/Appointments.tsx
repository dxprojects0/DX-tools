
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addAppointment, updateAppointmentStatus } from '../features/businessSlice';
import { Calendar, Plus, Phone, User, Check, X, Bell } from 'lucide-react';
import Drawer from '../components/Drawer';
import { shareData } from '../utils/share';

const Appointments: React.FC = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state: RootState) => state.business.appointments);
  const [isOpen, setIsOpen] = useState(false);
  
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addAppointment({
      id: `APP-${Date.now()}`,
      patientName: form.name,
      patientPhone: form.phone,
      date: form.date,
      time: form.time,
      status: 'Booked'
    }));
    setIsOpen(false);
  };

  const sendReminder = (appt: any) => {
    const text = `Hello ${appt.patientName}, your appointment is confirmed for ${appt.date} at ${appt.time}. Please arrive 10 mins early. Thank you!`;
    shareData("Appointment Reminder", text);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Doctor <span className="text-primary">Calendar</span></h1>
          <p className="text-slate-500 font-medium">Manage patient bookings and attendance.</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-primary text-white rounded-2xl font-black shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-all">
          <Plus size={18} /> New Booking
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Scheduled Visits</h3>
          {appointments.map(appt => (
            <div key={appt.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
               <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-primary font-black text-lg">{appt.time}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{appt.date.split('-').slice(1).join('/')}</span>
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-lg">{appt.patientName}</h4>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1">
                     <span className="flex items-center gap-1"><Phone size={12} /> {appt.patientPhone}</span>
                     <span className={`uppercase ${appt.status === 'Booked' ? 'text-blue-500' : appt.status === 'Visited' ? 'text-green-500' : 'text-red-500'}`}>{appt.status}</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => sendReminder(appt)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-blue-100"><Bell size={18} /></button>
                  {appt.status === 'Booked' && (
                    <>
                      <button onClick={() => dispatch(updateAppointmentStatus({ id: appt.id, status: 'Visited' }))} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100"><Check size={18} /></button>
                      <button onClick={() => dispatch(updateAppointmentStatus({ id: appt.id, status: 'Cancelled' }))} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><X size={18} /></button>
                    </>
                  )}
               </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="p-12 text-center text-slate-300 font-bold bg-white rounded-3xl border-2 border-dashed border-slate-100">
               No appointments found.
            </div>
          )}
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-8 text-white h-fit">
           <h3 className="text-xl font-black mb-4">Quick Stats</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                 <span className="text-slate-400 font-bold">Today</span>
                 <span className="text-primary font-black">8 Patients</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                 <span className="text-slate-400 font-bold">No-Shows</span>
                 <span className="text-red-400 font-black">2%</span>
              </div>
           </div>
        </div>
      </div>

      <Drawer title="Book Appointment" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleAdd} className="space-y-4">
          <input required placeholder="Patient Name" className="w-full p-4 border border-slate-100 rounded-2xl font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Phone Number" className="w-full p-4 border border-slate-100 rounded-2xl font-bold" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="date" className="w-full p-4 border border-slate-100 rounded-2xl font-bold" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <input required type="time" className="w-full p-4 border border-slate-100 rounded-2xl font-bold" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg">Confirm Booking</button>
        </form>
      </Drawer>
    </div>
  );
};

export default Appointments;
