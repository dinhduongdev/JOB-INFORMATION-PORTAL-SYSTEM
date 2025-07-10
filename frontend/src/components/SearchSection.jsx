import { IoSearch, IoLocationOutline } from "react-icons/io5";

const SearchSection = () => {
  const popularSearches = ['Java', 'ReactJS', '.NET', 'Tester', 'PHP', 'Business Analysis', 'NodeJS', 'Team Management'];

  return (
    <div className="py-5" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="container text-white text-center">
        <h1 className="fw-bold">949 Việc làm IT cho Developer "Chất"</h1>
        
        {/* Search Bar */}
        <div className="d-flex mt-4 bg-white rounded p-2">
          <div className="d-flex align-items-center ps-2 pe-3 text-dark">
            <IoLocationOutline size={20} className="me-2" />
            <span>Tất cả thành phố</span>
          </div>    
          <input 
            type="text" 
            className="form-control border-0 shadow-none" 
            placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
            style={{ flexGrow: 1 }}
          />
          <button className="btn btn-danger d-flex align-items-center fw-bold ms-2">
            <IoSearch size={20} className="me-2" />
            Tìm Kiếm
          </button>
        </div>

        {/* Popular Searches */}
        <div className="d-flex align-items-center justify-content-center flex-wrap mt-3">
          <span className="me-3">Mọi người đang tìm kiếm:</span>
          {popularSearches.map(term => (
            <a href="#" key={term} className="btn btn-sm btn-outline-light m-1">{term}</a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;