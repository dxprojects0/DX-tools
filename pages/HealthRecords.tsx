import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addHealthRecord } from '../features/businessSlice';

const HealthRecords: React.FC = () => {
  const dispatch = useDispatch();
  const records = useSelector((state: RootState) => state.business.healthRecords);

  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    diagnosisNotes: '',
    prescriptionUrl: '',
    followUpDate: '',
  });

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addHealthRecord({
        id: `EHR-${Date.now().toString().slice(-6)}`,
        visitDate: new Date().toISOString().slice(0, 10),
        ...form,
        prescriptionUrl: form.prescriptionUrl || undefined,
        followUpDate: form.followUpDate || undefined,
      }),
    );
    setForm({ patientName: '', patientPhone: '', diagnosisNotes: '', prescriptionUrl: '', followUpDate: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Health Records</h1>
        <p className="text-slate-500">Patient profile, visit history, diagnosis notes, prescription link, and follow-up date.</p>
      </div>

      <form onSubmit={addRecord} className="bg-white border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <input required className="border rounded p-2" placeholder="Patient name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
        <input required className="border rounded p-2" placeholder="Phone" value={form.patientPhone} onChange={(e) => setForm({ ...form, patientPhone: e.target.value })} />
        <textarea required className="md:col-span-2 border rounded p-2" placeholder="Diagnosis notes" value={form.diagnosisNotes} onChange={(e) => setForm({ ...form, diagnosisNotes: e.target.value })} />
        <input className="border rounded p-2" placeholder="Prescription URL" value={form.prescriptionUrl} onChange={(e) => setForm({ ...form, prescriptionUrl: e.target.value })} />
        <input type="date" className="border rounded p-2" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
        <button className="md:col-span-2 bg-primary text-white rounded py-2 font-bold">Save Record</button>
      </form>

      <div className="bg-white border rounded-2xl p-4 space-y-3">
        <h3 className="font-black">Visit History</h3>
        {records.map((r) => (
          <div key={r.id} className="border rounded p-3">
            <div className="font-bold">{r.patientName} ({r.patientPhone})</div>
            <div className="text-xs text-slate-500">Visit: {r.visitDate}{r.followUpDate ? ` | Follow-up: ${r.followUpDate}` : ''}</div>
            <div className="text-sm mt-1">{r.diagnosisNotes}</div>
            {r.prescriptionUrl && <a className="text-sm text-primary underline" href={r.prescriptionUrl} target="_blank" rel="noreferrer">Prescription</a>}
          </div>
        ))}
        {records.length === 0 && <div className="text-slate-400">No records yet.</div>}
      </div>
    </div>
  );
};

export default HealthRecords;
