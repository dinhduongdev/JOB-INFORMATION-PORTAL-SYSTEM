import { useState, useEffect } from "react";

const JobPostForm = ({ jobToEdit, onSubmit, onCancel }) => {
  const initialState = {
    name: "",
    location: "",
    requirements: "",
    salary: { amount: "", currency: "VND", display_text: "" },
    description: "",
    due_date: "",
    expertise_id: "",
    title_ids: [],
    skill_ids: [],
    is_active: true,
  };

  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    if (jobToEdit) {
        setFormData({
            ...jobToEdit,
            title_ids: jobToEdit.titles?.map(t => t.id) || [],
            skill_ids: jobToEdit.skills?.map(s => s.id) || [],
            due_date: jobToEdit.due_date ? new Date(jobToEdit.due_date).toISOString().split('T')[0] : "",
            salary: jobToEdit.salary || { amount: "", currency: "VND", display_text: "" }, // Đảm bảo salary không bị null
        });
    } else {
        setFormData(initialState);
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({ ...prev, salary: { ...prev.salary, [field]: value } }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (name, value) => {
    const ids = value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0);
    setFormData((prev) => ({ ...prev, [name]: ids }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="job-form">
        <h2 className="form-title">
          {jobToEdit ? "Chỉnh sửa bài đăng" : "Tạo bài đăng tuyển dụng mới"}
        </h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Tên công việc</label>
            <input id="name" type="text" name="name" placeholder="VD: Lập trình viên ReactJS" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">Địa điểm</label>
            <input id="location" type="text" name="location" placeholder="VD: Quận 1, TP. Hồ Chí Minh" value={formData.location} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
            <label>Mức lương</label>
            <div className="salary-group">
                <input type="number" name="salary.amount" placeholder="Số tiền" value={formData.salary.amount} onChange={handleChange} />
                <select name="salary.currency" value={formData.salary.currency} onChange={handleChange}>
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                </select>
                <input type="text" name="salary.display_text" placeholder="Hiển thị (VD: Thỏa thuận)" value={formData.salary.display_text} onChange={handleChange} />
            </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Mô tả công việc</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="5" />
        </div>
        <div className="form-group">
          <label htmlFor="requirements">Yêu cầu ứng viên</label>
          <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows="5" />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="skill_ids">Skill IDs</label>
            <input id="skill_ids" type="text" placeholder="Nhập ID, cách nhau bằng dấu phẩy" value={formData.skill_ids.join(", ")} onChange={(e) => handleArrayChange("skill_ids", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="title_ids">Title IDs</label>
            <input id="title_ids" type="text" placeholder="Nhập ID, cách nhau bằng dấu phẩy" value={formData.title_ids.join(", ")} onChange={(e) => handleArrayChange("title_ids", e.target.value)} />
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="due_date">Hạn nộp hồ sơ</label>
            <input id="due_date" type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="is_active">
              <input id="is_active" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              Kích hoạt bài đăng
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn--secondary">Hủy</button>
          <button type="submit" className="btn btn--primary">
            {jobToEdit ? "Lưu thay đổi" : "Tạo bài đăng"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;