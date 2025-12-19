const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Load destinations data
const destinationsData = JSON.parse(fs.readFileSync('./data/destinations.json', 'utf8'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/plan-trip', (req, res) => {
    try {
        const { destination, days, persons, transport } = req.body;
        
        // Validate input
        if (!destination || !days || !persons || !transport) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const destData = destinationsData.destinations[destination];
        if (!destData) {
            return res.status(400).json({ error: 'Invalid destination' });
        }

        // Generate itinerary
        const itinerary = generateItinerary(destData.places, parseInt(days));
        
        // Calculate budget
        const budget = calculateBudget(destData, parseInt(days), parseInt(persons), transport);
        
        // Get stay areas
        const stayAreas = destData.stayAreas;

        res.json({
            destination,
            days: parseInt(days),
            persons: parseInt(persons),
            transport,
            itinerary,
            stayAreas,
            budget
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Generate day-wise itinerary
function generateItinerary(places, days) {
    const itinerary = [];
    const placesPerDay = Math.ceil(places.length / days);
    
    for (let day = 1; day <= days; day++) {
        const startIndex = (day - 1) * placesPerDay;
        const endIndex = Math.min(startIndex + placesPerDay, places.length);
        const dayPlaces = places.slice(startIndex, endIndex);
        
        itinerary.push({
            day: day,
            places: dayPlaces
        });
    }
    
    return itinerary;
}

// Calculate budget breakdown
function calculateBudget(destData, days, persons, transport) {
    const constants = {
        petrolPrice: 100,
        bikeMileage: 40,
        carMileage: 15,
        foodCostPerDay: 400,
        stayCostPerNight: 800,
        localTravelCost: 700
    };

    let travelCost = 0;
    const distance = destData.distance * 2; // Round trip

    switch (transport) {
        case 'Bike':
            travelCost = (distance / constants.bikeMileage) * constants.petrolPrice;
            break;
        case 'Bus':
            travelCost = destData.busTicket * persons;
            break;
        case 'Train':
            if (destData.trainTicket === 0) {
                travelCost = 0;
            } else {
                travelCost = destData.trainTicket * persons;
            }
            break;
        case 'Car':
            travelCost = (distance / constants.carMileage) * constants.petrolPrice;
            break;
    }

    const stayCost = constants.stayCostPerNight * (days - 1) * persons;
    const foodCost = constants.foodCostPerDay * days * persons;
    const localTravelCost = constants.localTravelCost * persons;
    const totalCost = travelCost + stayCost + foodCost + localTravelCost;

    return {
        travelCost: Math.round(travelCost),
        stayCost,
        foodCost,
        localTravelCost,
        totalCost: Math.round(totalCost),
        trainNote: destData.trainNote || null
    };
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});