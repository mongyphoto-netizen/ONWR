import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Users } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{textAlign: 'center', padding: '4rem'}}>กำลังโหลดข้อมูล...</div>;
  }

  // Calculate stats
  const totalSubmissions = data.length;
  
  // Find urgent projects (priority 4 or 5)
  const urgentProjects = data.filter(d => parseInt(d.urgency_score) >= 4);
  
  // Group counts by group_type
  const groupCounts = data.reduce((acc, curr) => {
    acc[curr.group_type] = (acc[curr.group_type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="stat-title">จำนวนกลุ่มที่ประเมิน</span>
            <Users size={24} color="var(--primary)" />
          </div>
          <span className="stat-value">{totalSubmissions}</span>
        </div>
        
        <div className="stat-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="stat-title">โครงการเร่งด่วน (ระดับ 4-5)</span>
            <AlertTriangle size={24} color="var(--error)" />
          </div>
          <span className="stat-value">{urgentProjects.length}</span>
        </div>
        
        <div className="stat-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="stat-title">ปัญหาที่พบมากที่สุด</span>
            <Activity size={24} color="var(--secondary)" />
          </div>
          <span className="stat-value" style={{fontSize: '1.25rem', marginTop: '0.5rem'}}>
            {data.length > 0 ? (data[0].kpi_1_prob || 'รอข้อมูล') : 'ไม่มีข้อมูล'}
          </span>
        </div>
      </div>

      <div className="dashboard-table-container">
        <div style={{padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
          <h3 style={{color: 'var(--primary-dark)'}}>โครงการที่เสนอและพื้นที่เร่งด่วน (ใบงานที่ 3)</h3>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>พื้นที่/หน่วยงาน</th>
              <th>ประเภทประปา</th>
              <th>ความเร่งด่วน</th>
              <th>ปัญหาหลัก</th>
              <th>โครงการที่เสนอ</th>
              <th>หน่วยงานรับผิดชอบ</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', color: 'var(--text-muted)'}}>ยังไม่มีข้อมูลการประเมิน</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td style={{fontWeight: 500}}>{item.area_name}</td>
                  <td>{item.group_type}</td>
                  <td>
                    <span className={`badge ${parseInt(item.urgency_score) >= 4 ? 'badge-urgent' : 'badge-normal'}`}>
                      ระดับ {item.urgency_score}
                    </span>
                  </td>
                  <td>{item.kpi_1_prob}</td>
                  <td>{item.proposed_project || '-'}</td>
                  <td>{item.main_agency || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="dashboard-table-container">
        <div style={{padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
          <h3 style={{color: 'var(--primary-dark)'}}>กิจกรรมที่อยากให้เกิดขึ้น (ใบงานที่ 1 & 2)</h3>
        </div>
        <div style={{padding: '1.5rem'}}>
          {data.length === 0 ? (
            <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>ยังไม่มีข้อมูล</p>
          ) : (
            <ul style={{paddingLeft: '1.5rem'}}>
              {data.map((item, idx) => item.local_activities && (
                <li key={idx} style={{marginBottom: '0.5rem'}}>{item.local_activities} (เสนอโดย {item.area_name})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
