import { Button } from "../components/ui/button";
import "../css/homepage.css"; // Make sure this path is correct

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Find Your Perfect Flat</h1>
        <p className="home-subtitle">
          Discover affordable, comfortable, and conveniently located flats across the city.
        </p>

        <div className="home-buttons">
          <Button className="home-btn">Browse Listings</Button>
          <Button className="home-btn secondary">Post Your Flat</Button>
        </div>
      </div>
    </div>
  );
}