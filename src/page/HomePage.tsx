import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Home Page</h2>
      <button className="neon-button bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">
        Open AiBot
      </button>
    </div>
  );
};

export default HomePage;
