# Smart Trip Planner with Budget Estimation

A complete web application for planning trips with day-wise itinerary, stay area suggestions, and detailed budget calculations.

## Features

- **Trip Planning**: Generate day-wise itinerary for popular destinations
- **Stay Recommendations**: Get best night stay area suggestions with reasons
- **Budget Calculation**: Complete cost breakdown including travel, stay, food, and local transport
- **Multiple Transport Options**: Support for Bike, Bus, Train, and Car with different cost calculations
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Data Storage**: JSON file
- **No external frameworks or libraries**

## Destinations Supported

- **Manali**: Hill station with adventure activities
- **Jaipur**: Historical city with palaces and forts  
- **Goa**: Beach destination with vibrant nightlife

## Installation & Setup

1. **Clone/Download the project**
   ```bash
   cd smart-trip-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
smart-trip-planner/
├── package.json
├── server.js
├── README.md
├── data/
│   └── destinations.json
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## Budget Calculation Logic

### Transport Costs:
- **Bike**: (Distance ÷ 40 km/l) × ₹100/liter
- **Car**: (Distance ÷ 15 km/l) × ₹100/liter  
- **Bus**: Fixed ticket price × persons
- **Train**: Fixed ticket price × persons

### Other Costs:
- **Food**: ₹400/day/person
- **Stay**: ₹800/night/person
- **Local Travel**: ₹700/person

## API Endpoints

- `GET /` - Serve main page
- `POST /api/plan-trip` - Generate trip plan and budget

## Usage

1. Select destination from dropdown
2. Enter number of days (1-15)
3. Enter number of persons (1-10)
4. Choose transport mode
5. Click "Plan Trip"
6. View detailed itinerary, stay suggestions, and budget breakdown

## Features Implemented

✅ Day-wise itinerary generation  
✅ Stay area recommendations with reasons  
✅ Complete budget breakdown  
✅ Transport-wise cost calculation  
✅ Responsive mobile-friendly design  
✅ Form validation and error handling  
✅ Loading states and user feedback  
✅ Clean, professional UI  

## Development

For development with auto-restart:
```bash
npm run dev
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- No database required - uses JSON file for data storage
- All calculations done server-side for accuracy
- Responsive design works on all screen sizes
- Error handling for invalid inputs
- Professional UI with smooth animations