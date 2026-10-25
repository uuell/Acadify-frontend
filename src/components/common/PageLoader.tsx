import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="acadify-page-loader">
      <div className="acadify-loader-content">
        <div className="acadify-loader-spinner" />

        <h2>Acadify</h2>

        <p>Loading your workspace...</p>
      </div>
    </div>
  );
}

export default PageLoader;