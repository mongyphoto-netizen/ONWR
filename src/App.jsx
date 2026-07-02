import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './index.css';

const WATER_TYPES = [
  { id: 'pwa', label: 'ประปาส่วนภูมิภาค' },
  { id: 'local', label: 'ประปาท้องถิ่น (เทศบาล/อบต.) เป็นผู้ดูแลเอง' },
  { id: 'gw', label: 'ประปาชุมชน (น้ำบาดาล)' },
  { id: 'sw', label: 'ประปาชุมชน (น้ำผิวดิน)' },
  { id: 'mountain', label: 'ประปาภูเขา / ไม่มีระบบประปา' }
];

const EVAL_ITEMS = [
  { id: 'e1', label: 'ความเพียงพอของน้ำต้นทุน' },
  { id: 'e2', label: 'น้ำใช้อุปโภคบริโภคเพียงพอ และมีใช้อย่างต่อเนื่อง' },
  { id: 'e3', label: 'น้ำสะอาดเหมาะสม' },
  { id: 'e4', label: 'มีการตรวจคุณภาพน้ำ' },
  { id: 'e5', label: 'ระบบประปาพร้อมใช้งาน' },
  { id: 'e6', label: 'การซ่อมบำรุงดี' },
  { id: 'e7', label: 'หน่วยงานทำงานร่วมกันดี' },
  { id: 'e8', label: 'มีข้อมูลน้ำและมีแผนงานชัดเจน' },
  { id: 'e9', label: 'ประชาชนมีส่วนร่วม' },
  { id: 'e10', label: 'มีการให้ความรู้ และการรณรงค์' }
];

const KPI_ITEMS = [
  { id: 'k1', label: 'บำรุงรักษาระบบประปา (ตรวจสอบ/บำรุงรักษา/รายงานผล)' },
  { id: 'k2', label: 'ซ่อมแซมระบบประปา (ปั๊ม/ท่อ/ระบบกรอง)' },
  { id: 'k3', label: 'ก่อสร้างระบบประปาผิวดิน/บาดาล, ขยายเขตระบบประปา' },
  { id: 'k4', label: 'ปรับปรุงระบบผลิตน้ำประปาให้ได้มาตรฐาน' },
  { id: 'k5', label: 'จัดหาแหล่งน้ำต้นทุน (ขุดสระเก็บน้ำ,ขุดเจาะบาดาล,บ่อน้ำตื้น,สถานีสูบน้ำ)' },
  { id: 'k6', label: 'จัดหาน้ำในพื้นที่หาน้ำยากและพื้นที่สูง (ก่อสร้างระบบประปาภูเขา, ขุดเจาะบ่อบาดาล)' },
  { id: 'k7', label: 'การตรวจสอบคุณภาพแหล่งน้ำผิวดินและน้ำใต้ดิน' },
  { id: 'k8', label: 'การตรวจสอบคุณภาพน้ำประปา' },
  { id: 'k9', label: 'ฐานข้อมูลประปาหมู่บ้านและน้ำดื่มสะอาด' },
  { id: 'k10', label: 'มีการใช้เทคโนโลยี/นวัตกรรมในการจัดการน้ำ' },
  { id: 'k11', label: 'การพัฒนาองค์ความรู้ให้กับประชาชนทั่วไป' },
  { id: 'k12', label: 'สร้างการรับรู้ รณรงค์และประชาสัมพันธ์เรื่องน้ำสะอาด' },
  { id: 'k13', label: 'การประหยัดน้ำในทุกภาคส่วน' }
];

function App() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Part 1
    name: '', position: '', organization: '', phone: '', tambon: '', amphoe: '', province: '', experience: '',
    
    // Part 2
    total_villages: '',
    pwa_age: '', pwa_status: '',
    local_age: '', local_status: '',
    gw_age: '', gw_status: '',
    sw_age: '', sw_status: '',
    mountain_age: '', mountain_status: '',
    
    // Part 3
    ...Object.fromEntries(EVAL_ITEMS.map(item => [item.id, ''])),
    
    // Part 4
    ...Object.fromEntries(KPI_ITEMS.map(item => [item.id, ''])),
    
    // Part 5
    prob_most_common_1: '', prob_most_common_2: '', prob_most_common_3: '',
    prob_important_1: '', prob_important_2: '', prob_important_3: '',
    prob_cause_1: '', prob_cause_2: '', prob_cause_3: '',
    solutions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit data');
      
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error!', error.message);
      setIsSubmitting(false);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="app-wrapper">
      <section className="hero-section bg-hero-pattern" style={{ padding: '4rem 0 6rem 0' }}>
        <div className="container animate-fade-in">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>แบบประเมินสถานการณ์น้ำสะอาดในพื้นที่</h1>
          <p className="hero-subtitle" style={{ marginBottom: '1rem' }}>
            สำนักงานทรัพยากรน้ำแห่งชาติ (สทนช.)
          </p>
          {!isSuccess && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} style={{
                  width: '30px', height: '30px', borderRadius: '50%', 
                  background: step >= num ? 'var(--secondary)' : 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="glass-card animate-fade-in delay-200" style={{ maxWidth: '900px' }}>
            {isSuccess ? (
              <div className="success-message">
                <CheckCircle className="success-icon" />
                <h2 className="card-title">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
                <p className="card-desc">ขอบพระคุณที่สละเวลาให้ข้อมูลเพื่อการพัฒนาระบบน้ำอย่างยั่งยืน</p>
                <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
                  กรอกข้อมูลใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                
                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <h2 className="card-title">ส่วนที่ 1 ข้อมูลผู้ตอบ</h2>
                    <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="form-label">ชื่อ - นามสกุล <span style={{color:'red'}}>*</span></label><input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} /></div>
                      <div className="form-group"><label className="form-label">ตำแหน่ง</label><input type="text" name="position" className="form-control" value={formData.position} onChange={handleChange} /></div>
                      <div className="form-group"><label className="form-label">หน่วยงาน</label><input type="text" name="organization" className="form-control" value={formData.organization} onChange={handleChange} /></div>
                      <div className="form-group"><label className="form-label">เบอร์โทรศัพท์ <span style={{color:'red'}}>*</span></label><input type="text" name="phone" className="form-control" required value={formData.phone} onChange={handleChange} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="form-label">ตำบล</label><input type="text" name="tambon" className="form-control" value={formData.tambon} onChange={handleChange} /></div>
                      <div className="form-group"><label className="form-label">อำเภอ</label><input type="text" name="amphoe" className="form-control" value={formData.amphoe} onChange={handleChange} /></div>
                      <div className="form-group"><label className="form-label">จังหวัด <span style={{color:'red'}}>*</span></label><input type="text" name="province" className="form-control" required value={formData.province} onChange={handleChange} /></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">ประสบการณ์ทำงานด้านน้ำ <span style={{color:'red'}}>*</span></label>
                      <select name="experience" className="form-control" required value={formData.experience} onChange={handleChange}>
                        <option value="">-- เลือก --</option>
                        <option value="<1 ปี">&lt;1 ปี</option>
                        <option value="1–5 ปี">1–5 ปี</option>
                        <option value="6–10 ปี">6–10 ปี</option>
                        <option value=">10 ปี">&gt;10 ปี</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h2 className="card-title">ส่วนที่ 2 โครงสร้างระบบประปาในพื้นที่ (ถ้ามี)</h2>
                    <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                    <div className="form-group">
                      <label className="form-label">จำนวนหมู่บ้าน/ชุมชนทั้งหมดในพื้นที่ <span style={{color:'red'}}>*</span></label>
                      <input type="number" name="total_villages" className="form-control" required value={formData.total_villages} onChange={handleChange} placeholder="ระบุจำนวนตัวเลข" />
                    </div>
                    <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>จำแนกตามประเภทระบบประปา (โปรดระบุอายุและการใช้งาน หากไม่มีให้เว้นว่างไว้)</p>
                    
                    {WATER_TYPES.map(type => (
                      <div key={type.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb' }}>
                        <h4 style={{marginBottom: '1rem', color: 'var(--primary-dark)'}}>{type.label}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group" style={{marginBottom: 0}}>
                            <label className="form-label">ปีที่ปรับปรุงล่าสุด</label>
                            <select name={`${type.id}_age`} className="form-control" value={formData[`${type.id}_age`]} onChange={handleChange}>
                              <option value="">-- เลือก --</option>
                              <option value="< 5 ปี">&lt; 5 ปี</option>
                              <option value="5-10 ปี">5-10 ปี</option>
                              <option value="10-20 ปี">10-20 ปี</option>
                              <option value="> 20 ปี">&gt; 20 ปี</option>
                              <option value="ไม่ทราบ">ไม่ทราบ</option>
                            </select>
                          </div>
                          <div className="form-group" style={{marginBottom: 0}}>
                            <label className="form-label">สถานะการใช้งาน</label>
                            <select name={`${type.id}_status`} className="form-control" value={formData[`${type.id}_status`]} onChange={handleChange}>
                              <option value="">-- เลือก --</option>
                              <option value="ใช้งานได้ดี">ใช้งานได้ดี</option>
                              <option value="ใช้งานได้บางส่วน">ใช้งานได้บางส่วน</option>
                              <option value="ใช้งานไม่ได้">ใช้งานไม่ได้</option>
                              <option value="ไม่ทราบ">ไม่ทราบ</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <h2 className="card-title">ส่วนที่ 3 การประเมินสถานการณ์น้ำ</h2>
                    <p style={{color: 'var(--text-muted)'}}>5=ดีมาก/ไม่มีปัญหา, 4=ค่อนข้างดี, 3=ปานกลาง, 2=มีปัญหาค่อนข้างมาก, 1=มีปัญหารุนแรง</p>
                    <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {EVAL_ITEMS.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '4px' }}>
                          <span style={{flex: 1, paddingRight: '1rem'}}>{item.label} <span style={{color:'red'}}>*</span></span>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            {[5,4,3,2,1].map(score => (
                              <label key={score} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '40px'}}>
                                <span>{score}</span>
                                <input type="radio" name={item.id} value={score} required checked={formData[item.id] === String(score)} onChange={handleChange} />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div>
                    <h2 className="card-title">ส่วนที่ 4 การประเมิน KPI ตามแผนงาน</h2>
                    <p style={{color: 'var(--text-muted)'}}>5=ดำเนินการต่อเนื่อง, 4=ดำเนินการเกือบทั้งหมด, 3=ดำเนินการบางส่วน, 2=มีแผนยังไม่ได้ทำ, 1=ไม่มีแผน</p>
                    <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {KPI_ITEMS.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '4px' }}>
                          <span style={{flex: 1, paddingRight: '1rem', fontSize: '0.9rem'}}>{item.label} <span style={{color:'red'}}>*</span></span>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            {[5,4,3,2,1].map(score => (
                              <label key={score} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '35px'}}>
                                <span style={{fontSize: '0.8rem'}}>{score}</span>
                                <input type="radio" name={item.id} value={score} required checked={formData[item.id] === String(score)} onChange={handleChange} />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {step === 5 && (
                  <div>
                    <h2 className="card-title">ส่วนที่ 5 ปัญหาและข้อเสนอแนะ</h2>
                    <p style={{color: 'var(--text-muted)'}}>พิจารณาจากสภาพในช่วง 1 ปีที่ผ่านมา</p>
                    <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                    
                    <div className="form-group" style={{background: '#f9fafb', padding: '1.5rem', borderRadius: '8px'}}>
                      <h4>1. ปัญหาน้ำที่พบมากที่สุด (เลือกลำดับ 1-3)</h4>
                      <p style={{fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem'}}>1 = พบบ่อยที่สุด</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div><label>อันดับ 1</label><select name="prob_most_common_1" className="form-control" value={formData.prob_most_common_1} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำต้นทุนไม่พอ">น้ำต้นทุนไม่พอ</option><option value="ระบบประปาไม่ดี">ระบบประปาไม่ดี</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหารจัดการ">การบริหารจัดการ</option></select></div>
                        <div><label>อันดับ 2</label><select name="prob_most_common_2" className="form-control" value={formData.prob_most_common_2} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำต้นทุนไม่พอ">น้ำต้นทุนไม่พอ</option><option value="ระบบประปาไม่ดี">ระบบประปาไม่ดี</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหารจัดการ">การบริหารจัดการ</option></select></div>
                        <div><label>อันดับ 3</label><select name="prob_most_common_3" className="form-control" value={formData.prob_most_common_3} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำต้นทุนไม่พอ">น้ำต้นทุนไม่พอ</option><option value="ระบบประปาไม่ดี">ระบบประปาไม่ดี</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหารจัดการ">การบริหารจัดการ</option></select></div>
                      </div>
                    </div>

                    <div className="form-group" style={{background: '#f9fafb', padding: '1.5rem', borderRadius: '8px'}}>
                      <h4>2. ปัญหาสำคัญที่สุด (เลือกลำดับ 1-3)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div><label>อันดับ 1</label><select name="prob_important_1" className="form-control" value={formData.prob_important_1} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำไม่พอ">น้ำไม่พอ</option><option value="ระบบเสีย">ระบบเสีย</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหาร">การบริหาร</option></select></div>
                        <div><label>อันดับ 2</label><select name="prob_important_2" className="form-control" value={formData.prob_important_2} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำไม่พอ">น้ำไม่พอ</option><option value="ระบบเสีย">ระบบเสีย</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหาร">การบริหาร</option></select></div>
                        <div><label>อันดับ 3</label><select name="prob_important_3" className="form-control" value={formData.prob_important_3} onChange={handleChange}><option value="">-- เลือก --</option><option value="น้ำไม่พอ">น้ำไม่พอ</option><option value="ระบบเสีย">ระบบเสีย</option><option value="คุณภาพน้ำ">คุณภาพน้ำ</option><option value="การบริหาร">การบริหาร</option></select></div>
                      </div>
                    </div>

                    <div className="form-group" style={{background: '#f9fafb', padding: '1.5rem', borderRadius: '8px'}}>
                      <h4>3. สาเหตุหลัก (เลือกลำดับ 1-3)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div><label>อันดับ 1</label><select name="prob_cause_1" className="form-control" value={formData.prob_cause_1} onChange={handleChange}><option value="">-- เลือก --</option><option value="งบประมาณ">งบประมาณ</option><option value="เทคโนโลยี">เทคโนโลยี</option><option value="บุคลากร">บุคลากร</option><option value="ข้อมูล">ข้อมูล</option></select></div>
                        <div><label>อันดับ 2</label><select name="prob_cause_2" className="form-control" value={formData.prob_cause_2} onChange={handleChange}><option value="">-- เลือก --</option><option value="งบประมาณ">งบประมาณ</option><option value="เทคโนโลยี">เทคโนโลยี</option><option value="บุคลากร">บุคลากร</option><option value="ข้อมูล">ข้อมูล</option></select></div>
                        <div><label>อันดับ 3</label><select name="prob_cause_3" className="form-control" value={formData.prob_cause_3} onChange={handleChange}><option value="">-- เลือก --</option><option value="งบประมาณ">งบประมาณ</option><option value="เทคโนโลยี">เทคโนโลยี</option><option value="บุคลากร">บุคลากร</option><option value="ข้อมูล">ข้อมูล</option></select></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">4. แนวทางแก้ไข / ข้อเสนอแนะเพิ่มเติม</label>
                      <textarea name="solutions" className="form-control" rows="4" value={formData.solutions} onChange={handleChange}></textarea>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                  {step > 1 ? (
                    <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={isSubmitting}>
                      <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> ย้อนกลับ
                    </button>
                  ) : <div></div>}

                  {step < 5 ? (
                    <button type="submit" className="btn btn-primary">
                      ถัดไป <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมิน'}
                    </button>
                  )}
                </div>
                
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
