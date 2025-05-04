// County and city data for North Texas
const locationData = {
    cooke: [
        'Gainesville', 'Muenster', 'Lindsay', 'Callisburg', 'Valley View', 
        'Myra', 'Oak Ridge', 'Era', 'Leo', 'Mountain Springs'
    ],
    grayson: [
        'Sherman', 'Denison', 'Van Alstyne', 'Howe', 'Whitesboro', 
        'Pottsboro', 'Collinsville', 'Gunter', 'Bells', 'Tom Bean'
    ]
};

// Update city dropdown when county changes
document.getElementById('county').addEventListener('change', function() {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = '<option value="">Select City/Town</option>';
    
    if (this.value && locationData[this.value]) {
        locationData[this.value].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

// More accurate estimate calculation for North Texas
function calculateInsuranceEstimate(homeValue, yearBuilt, county, roofAge, safetyFeatures, squareFeet) {
    // Base rates by county (annual premium per $1000 of coverage)
    const baseRates = {
        cooke: 6.5,    // $6.50 per $1000 (rural area)
        grayson: 6.8   // $6.80 per $1000 (more urban area)
    };
    
    // Calculate base premium
    let premium = (homeValue / 1000) * baseRates[county];
    
    // Property age adjustment
    const currentYear = new Date().getFullYear();
    const propertyAge = currentYear - yearBuilt;
    
    if (propertyAge >= 40) premium *= 1.25;      // Very old homes
    else if (propertyAge >= 30) premium *= 1.15; // Older homes
    else if (propertyAge >= 20) premium *= 1.10; // Aging homes
    else if (propertyAge >= 10) premium *= 1.05; // Moderate age
    
    // Roof age multipliers
    const roofMultipliers = {
        '0-5': 0.95,    // New roof discount
        '6-10': 1.00,   // Standard rate
        '11-15': 1.10,  // Aging roof
        '16+': 1.20     // Old roof surcharge
    };
    premium *= roofMultipliers[roofAge] || 1.00;
    
    // Size factor (larger homes have more to insure)
    if (squareFeet > 3000) premium *= 1.15;
    else if (squareFeet > 2500) premium *= 1.10;
    else if (squareFeet > 2000) premium *= 1.05;
    
    // Safety features discounts
    const safetyDiscounts = {
        'none': 1.00,
        'some': 0.95,    // Basic security (5% off)
        'many': 0.92,    // Good security (8% off)
        'all': 0.88      // Full security system (12% off)
    };
    premium *= safetyDiscounts[safetyFeatures] || 1.00;
    
    // Round to nearest $50
    premium = Math.round(premium / 50) * 50;
    
    return premium;
}

// Handle estimate form submission
function calculateEstimate(event) {
    event.preventDefault();
    
    // Get form values
    const homeValue = parseInt(document.getElementById('home-value').value);
    const yearBuilt = parseInt(document.getElementById('year-built').value);
    const county = document.getElementById('county').value;
    const roofAge = document.getElementById('roof-age').value;
    const safetyFeatures = document.getElementById('safety-features').value;
    const squareFeet = parseInt(document.getElementById('square-feet').value);
    
    // Calculate accurate estimate
    const estimate = calculateInsuranceEstimate(
        homeValue, 
        yearBuilt, 
        county, 
        roofAge, 
        safetyFeatures, 
        squareFeet
    );
    
    // Show results
    document.getElementById('results').style.display = 'block';
    document.getElementById('estimate-price').textContent = `$${estimate.toLocaleString()}/year`;
    document.getElementById('lead-form').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Handle quote form submission
function submitQuoteForm(event) {
    event.preventDefault();
    
    // Hide form, show success message
    document.getElementById('lead-form').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    
    // In a real implementation, you'd send this data to your CRM
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        contactTime: document.getElementById('contact-time').value,
        homeValue: document.getElementById('home-value').value,
        yearBuilt: document.getElementById('year-built').value,
        county: document.getElementById('county').value,
        city: document.getElementById('city').value,
        timestamp: new Date().toISOString()
    };
    
    console.log('Lead captured:', formData);
}