import React from 'react';

const AdmPage: React.FC = () => {
  return (
    <div className="container my-5">
      <header className="bg-light p-4 rounded shadow-sm mb-4">
        <h1 className="h3">Admin Dashboard</h1>
      </header>

      <main className="row g-4">
        <section className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <p className="card-text">Manage all registered users from here.</p>
            </div>
          </div>
        </section>

        <section className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reports</h5>
              <p className="card-text">View analytics and reports.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-muted mt-5">
        &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
      </footer>
    </div>
  );
};

export default AdmPage;
