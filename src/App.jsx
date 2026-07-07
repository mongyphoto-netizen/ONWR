import { useState } from 'react';
import IndividualForm from './IndividualForm';
import GroupForm from './GroupForm';
import { User, Users } from 'lucide-react';
import './index.css';

export default function App() {
  const [formType, setFormType] = useState(null);

  if (formType === 'individual') {
    return <IndividualForm onBack={() => setFormType(null)} />;
  }

  if (formType === 'group') {
    return <GroupForm onBack={() => setFormType(null)} />;
  }

  return (
    <div className="app-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ color: '#1e3a8a', fontSize: '2rem', marginBottom: '1rem' }}>ระบบจัดทำข้อมูลแผนน้ำสะอาด</h1>
        <p style={{ color: '#4b5563', marginBottom: '3rem', fontSize: '1.1rem' }}>
          การประเมินความก้าวหน้าการขับเคลื่อนน้ำสะอาดเพื่อการอุปโภคบริโภคระดับพื้นที่
        </p>

        <h3 style={{ marginBottom: '1.5rem', color: '#374151' }}>กรุณาเลือกประเภทแบบประเมิน</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Individual Button */}
          <button 
            onClick={() => setFormType('individual')}
            style={{ 
              background: 'white', 
              border: '2px solid #e5e7eb', 
              borderRadius: '12px', 
              padding: '2rem', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <User size={48} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>แบบประเมิน "รายบุคคล"</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>สำหรับผู้นำชุมชน หรือตัวแทนหมู่บ้านกรอกข้อมูลพื้นฐานในพื้นที่</p>
          </button>

          {/* Group Button */}
          <button 
            onClick={() => setFormType('group')}
            style={{ 
              background: 'white', 
              border: '2px solid #e5e7eb', 
              borderRadius: '12px', 
              padding: '2rem', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Users size={48} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>แบบประเมิน "แบบกลุ่ม"</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>สำหรับการระดมสมองเป็นกลุ่ม เพื่อประเมิน KPI และเสนอโครงการ</p>
          </button>

        </div>
      </div>
    </div>
  );
}
