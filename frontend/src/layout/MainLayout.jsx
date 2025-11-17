import { Outlet } from "react-router-dom"
const MainLayout=()=>{
return<>
   <header style={{ padding: "20px", background: "#f4f4f4" }}>
        <h2>Website Header</h2>
      </header>

      {/* Content that changes with routing */}
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ padding: "20px", background: "#f4f4f4" }}>
        <p>© 2025 All rights reserved.</p>
      </footer>
</>
}
export default MainLayout