import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Dashboard from './Dashboard';
import './index.css';

const WATER_TYPES = [
  { id: 'ประปาส่วนภูมิภาค', label: 'ประปาส่วนภูมิภาค' },
  { id: 'ประปาส่วนท้องถิ่น', label: 'ประปาส่วนท้องถิ่น' },
  { id: 'ประปาชุมชนผิวดิน', label: 'ประชาส่วนชุมชนผิวดิน' },
  { id: 'ประปาชุมชนบาดาล', label: 'ประชาส่วนชุมชนบาดาล' },
  { id: 'ประปาภูเขา/ไม่มีระบบ', label: 'ประปาภูเขา / ไม่มีระบบประปา' }
];

const KPIS = [
  { id: 'kpi_1', label: '1. บำรุงรักษาระบบประปา' },
  { id: 'kpi_2', label: '2. พัฒนาและปรับปรุงระบบประปาให้เพียงพอและได้มาตรฐาน' },
  { id: 'kpi_3', label: '3. เพิ่ม/พัฒนาแหล่งน้ำต้นทุนเพื่อแก้ปัญหาพื้นที่ขาดแคลนน้ำ' },
  { id: 'kpi_4', label: '4. การบริหารจัดการระบบประปา' },
  { id: 'kpi_5', label: '5. ตรวจสอบคุณภาพน้ำต้นทุน (น้ำผิวดินและน้ำบาดาล)' },
  { id: 'kpi_6', label: '6. ตรวจสอบคุณภาพน้ำประปาให้ได้มาตรฐาน' }
];

const EVAL_ITEMS = [
  { id: 'e1', label: 'ความเพียงพอของน้ำต้นทุน', subLabel: 'มีแหล่งน้ำดิบเพียงพอตลอดทั้งปี ไม่ขาดแคลนช่วงหน้าแล้ง' },
  { id: 'e2', label: 'น้ำใช้อุปโภคบริโภคเพียงพอ และมีใช้อย่างต่อเนื่อง', subLabel: 'น้ำประปาไหลแรงสม่ำเสมอ ไม่หยุดไหลบ่อย' },
  { id: 'e3', label: 'น้ำสะอาดเหมาะสม', subLabel: 'น้ำใส ไม่มีกลิ่น ไม่มีสีเจือปน ใช้อุปโภคบริโภคได้อย่างมั่นใจ' },
  { id: 'e4', label: 'ความสม่ำเสมอในการตรวจและเฝ้าระวังคุณภาพน้ำ', subLabel: '5 = ตรวจประจำและได้มาตรฐาน, 1 = ไม่เคยตรวจเลย' },
  { id: 'e5', label: 'ระบบประปาพร้อมใช้งาน', subLabel: 'สภาพของเครื่องสูบน้ำ ท่อส่งน้ำ และถังเก็บน้ำ อยู่ในสภาพดี' },
  { id: 'e6', label: 'ความรวดเร็วและประสิทธิภาพในการซ่อมบำรุง', subLabel: '5 = ซ่อมเร็วใช้งานได้ปกติ, 1 = ปล่อยทิ้งร้าง/ไม่มีช่างดูแล' },
  { id: 'e7', label: 'หน่วยงานทำงานร่วมกันดี', subLabel: 'การประสานงานระหว่างท้องถิ่น, ภูมิภาค และผู้นำชุมชน' },
  { id: 'e8', label: 'มีข้อมูลน้ำและมีแผนงานชัดเจน', subLabel: 'มีฐานข้อมูลผู้ใช้น้ำ และแผนพัฒนาระบบประปาที่ชัดเจน' },
  { id: 'e9', label: 'ประชาชนมีส่วนร่วม', subLabel: 'ชุมชนมีส่วนร่วมในการบริหารจัดการหรือดูแลรักษาแหล่งน้ำ' },
  { id: 'e10', label: 'การให้ความรู้ และการรณรงค์', subLabel: 'การส่งเสริมการใช้น้ำอย่างประหยัดและถูกสุขอนามัย' }
];

export default function GroupForm({ onBack }) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'dashboard'
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialFormState = {
    group_type: '',
    area_name: '',
    local_activities: '',
    urgency_score: '3',
    proposed_project: '',
    main_agency: '',
    support_agency: '',
  };

  // Create initial state for KPIs and EVALs dynamically
  KPIS.forEach(kpi => {
    initialFormState[`${kpi.id}_status`] = '';
    initialFormState[`${kpi.id}_prob`] = '';
    initialFormState[`${kpi.id}_cause`] = '';
    initialFormState[`${kpi.id}_obs`] = '';
  });

  EVAL_ITEMS.forEach(item => {
    initialFormState[item.id] = '';
  });

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => { window.scrollTo(0, 0); setStep(prev => prev + 1); };
  const prevStep = () => { window.scrollTo(0, 0); setStep(prev => prev - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // POST to local Node.js server
      const res = await fetch('http://localhost:3000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error!', error.message);
      setIsSubmitting(false);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาตรวจสอบว่า Backend Server กำลังทำงานอยู่หรือไม่ (npm run server)');
    }
  };

  return (
    <div className="app-wrapper">
      <section className="hero-section bg-hero-pattern" style={{ padding: '4rem 0 6rem 0' }}>
        <div className="container animate-fade-in">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>ระบบจัดทำข้อมูลแผนน้ำสะอาด</h1>
          <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>
            การประเมินความก้าวหน้าการขับเคลื่อนน้ำสะอาดเพื่อการอุปโภคบริโภคระดับพื้นที่
          </p>
          
          <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginBottom: '1rem' }}><ArrowLeft size={16} /> กลับหน้าหลัก</button>
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              📝 บันทึกข้อมูลใบงาน
            </button>
            <button 
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 แดชบอร์ดสรุปผล
            </button>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          
          {activeTab === 'dashboard' && <Dashboard />}

          {activeTab === 'form' && (
            <div className="glass-card animate-fade-in delay-200" style={{ maxWidth: '900px' }}>
              {isSuccess ? (
                <div className="success-message">
                  <CheckCircle className="success-icon" />
                  <h2 className="card-title">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
                  <p className="card-desc">ข้อมูลของคุณถูกส่งเข้าสู่แดชบอร์ดสรุปผลแล้ว</p>
                  <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => {
                    setIsSuccess(false);
                    setStep(1);
                    setFormData(initialFormState);
                  }}>
                    บันทึกข้อมูลกลุ่มต่อไป
                  </button>
                </div>
              ) : (
                <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                  
                  {/* STEP 1: ข้อมูลกลุ่ม */}
                  {step === 1 && (
                    <div>
                      <h2 className="card-title">ส่วนที่ 1: ข้อมูลกลุ่ม</h2>
                      <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                      
                      <div className="form-group">
                        <label className="form-label">ประเภทระบบประปาของกลุ่ม <span style={{color:'red'}}>*</span></label>
                        <select name="group_type" className="form-control" required value={formData.group_type} onChange={handleChange}>
                          <option value="">-- เลือก --</option>
                          {WATER_TYPES.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">พื้นที่ / หน่วยงานในกลุ่ม <span style={{color:'red'}}>*</span></label>
                        <input type="text" name="area_name" className="form-control" required value={formData.area_name} onChange={handleChange} placeholder="ระบุชื่อตำบล, อำเภอ หรือหน่วยงาน..." />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ใบงานที่ 1 & 2 */}
                  {step === 2 && (
                    <div>
                      <h2 className="card-title">ส่วนที่ 2: การประเมินความก้าวหน้า KPI</h2>
                      <p style={{color: 'var(--text-muted)'}}>ใบงานที่ 1 และ 2 (การบริหารจัดการ และคุณภาพน้ำ)</p>
                      <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                      
                      {KPIS.map((kpi, idx) => (
                        <div key={kpi.id} style={{ background: idx % 2 === 0 ? '#f9fafb' : 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h4 style={{marginBottom: '1rem', color: 'var(--primary-dark)'}}>{kpi.label}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{marginBottom: '0.5rem'}}>
                              <label className="form-label" style={{fontSize: '0.9rem'}}>สถานการณ์ปัจจุบัน</label>
                              <input type="text" name={`${kpi.id}_status`} className="form-control" value={formData[`${kpi.id}_status`]} onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{marginBottom: '0.5rem'}}>
                              <label className="form-label" style={{fontSize: '0.9rem'}}>ปัญหาที่พบ</label>
                              <input type="text" name={`${kpi.id}_prob`} className="form-control" value={formData[`${kpi.id}_prob`]} onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                              <label className="form-label" style={{fontSize: '0.9rem'}}>สาเหตุหลัก</label>
                              <input type="text" name={`${kpi.id}_cause`} className="form-control" value={formData[`${kpi.id}_cause`]} onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                              <label className="form-label" style={{fontSize: '0.9rem'}}>อุปสรรคสำคัญ</label>
                              <input type="text" name={`${kpi.id}_obs`} className="form-control" value={formData[`${kpi.id}_obs`]} onChange={handleChange} />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="form-group" style={{marginTop: '2rem'}}>
                        <label className="form-label">กิจกรรมที่อยากให้เกิดขึ้นในท้องถิ่น (ระดมสมอง)</label>
                        <textarea name="local_activities" className="form-control" rows="4" value={formData.local_activities} onChange={handleChange} placeholder="เสนอแนวคิดหรือกิจกรรมที่อยากให้มี..."></textarea>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ใบงานที่ 3 */}
                  {step === 3 && (
                    <div>
                      <h2 className="card-title">ส่วนที่ 3: พื้นที่/ชุมชนที่ควรเร่งแก้ไขปัญหา</h2>
                      <p style={{color: 'var(--text-muted)'}}>ใบงานที่ 3</p>
                      <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                      
                      {EVAL_ITEMS.map((item, index) => (
                        <div key={item.id} style={{ padding: '0.75rem', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{flex: 1, paddingRight: '1rem'}}>
                              <div>{item.label} <span style={{color:'red'}}>*</span></div>
                              {item.subLabel && <div style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem'}}>({item.subLabel})</div>}
                            </div>
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                              {['N/A', 5, 4, 3, 2, 1].map(score => (
                                <label key={score} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '40px'}}>
                                  <span style={{fontSize: score === 'N/A' ? '0.75rem' : '1rem', color: score === 'N/A' ? '#9ca3af' : 'inherit'}}>{score}</span>
                                  <input type="radio" name={item.id} value={score} required checked={formData[item.id] === String(score)} onChange={handleChange} />
                                </label>
                              ))}
                            </div>
                          </div>
                          {item.id === 'e10' && (
                            <div style={{ marginTop: '0.75rem' }}>
                              <input type="text" name="e10_topic" className="form-control" placeholder="โปรดระบุหัวข้อที่ให้ความรู้..." value={formData.e10_topic} onChange={handleChange} />
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="form-group" style={{marginTop: '2rem'}}>
                        <label className="form-label">โครงการ/มาตรการที่เสนอ (ทางออก)</label>
                        <textarea name="proposed_project" className="form-control" rows="3" value={formData.proposed_project} onChange={handleChange}></textarea>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">หน่วยงานหลัก (เจ้าภาพ)</label>
                          <input type="text" name="main_agency" className="form-control" value={formData.main_agency} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">หน่วยงานสนับสนุน</label>
                          <input type="text" name="support_agency" className="form-control" value={formData.support_agency} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    {step > 1 ? (
                      <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={isSubmitting}>
                        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> ย้อนกลับ
                      </button>
                    ) : <div></div>}

                    {step < 3 ? (
                      <button type="submit" className="btn btn-primary">
                        ถัดไป <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'กำลังส่งข้อมูล...' : 'บันทึกใบงาน'}
                      </button>
                    )}
                  </div>
                  
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


